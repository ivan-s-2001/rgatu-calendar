#!/usr/bin/env python3
"""Manual official-source ingestion. Failed downloads never replace the last valid DB."""
import argparse, datetime as dt, hashlib, html, json, os, re, sqlite3, subprocess, tempfile
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlparse, unquote
from urllib.request import Request, urlopen

SOURCE = 'https://www.rsatu.ru/students/raspisanie-sessii/'
ROOT = Path(__file__).resolve().parents[1]

class SourcePage(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links=[]; self.current=None; self.lines=[]; self.skip=0; self.window=[]
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag in ('script','style'): self.skip+=1
        if tag=='a': self.current={'href':attrs.get('href',''),'text':attrs.get('title',''),'context':' '.join(self.window[-8:])}
    def handle_data(self,data):
        if self.skip:return
        text=' '.join(data.split())
        if not text:return
        self.lines.append(text); self.window.append(text)
        if self.current is not None:self.current['text']+=' '+text
    def handle_endtag(self,tag):
        if tag in ('script','style') and self.skip:self.skip-=1
        if tag=='a' and self.current is not None:self.links.append(self.current);self.current=None

def download(url,limit):
    target=urlparse(url)
    if target.scheme not in ('https','http') or target.hostname not in ('www.rsatu.ru','rsatu.ru'):
        raise ValueError('Источник должен принадлежать rsatu.ru')
    request=Request(url,headers={'User-Agent':'RGATU-Calendar/1.0 (+manual schedule check)','Accept':'text/html,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    with urlopen(request,timeout=45) as response:
        if urlparse(response.geturl()).hostname not in ('www.rsatu.ru','rsatu.ru'):raise ValueError('Источник перенаправил на другой сайт')
        body=response.read(limit+1)
        if len(body)>limit:raise ValueError('Источник превысил лимит размера')
        return body

def candidates(page,url=SOURCE):
    result=[]
    for link in page.links:
        href=urljoin(url,html.unescape(link['href']))
        decoded=unquote(href)
        text=(decoded+' '+link['text']).lower()
        if not urlparse(decoded).path.lower().endswith('.xlsx'):continue
        if urlparse(href).hostname not in ('www.rsatu.ru','rsatu.ru'):continue
        explicit=bool(re.search(r'фзо|fzo|заоч|zaochn',text))
        if not explicit and not re.search(r'фзо|заоч',link['context'],re.I):continue
        dates=[]
        for d,m,y in re.findall(r'(\d{1,2})[._-](\d{1,2})[._-](20\d{2})',text):
            try:dates.append(dt.date(int(y),int(m),int(d)).isoformat())
            except ValueError:pass
        years=re.findall(r'20\d{2}',text)
        rank=(max(years,default='0000'),max(dates,default='0000-00-00'),int(explicit))
        result.append((rank,href,link['text'].strip()))
    # Prefer explicit filenames, then the most recent school year and revision date.
    return sorted(set(result),reverse=True)

def records(data,group_only=False):
    result={}
    for sheet in data['sheets']:
        if group_only and sheet['kind']!='groups':continue
        for entity in sheet['entities']:
            for entry in entity['entries']:
                key='|'.join((sheet['kind'],entity['name'],entry['date'],str(entry['pair'])))
                value=' '.join(entry['text'].split())
                if key in result and result[key]!=value:raise ValueError('Противоречащие записи в файле: '+key)
                result[key]=value
    return result

def difference(old,new):
    before=records(old,True) if old else {};after=records(new,True)
    added=set(after)-set(before);removed=set(before)-set(after)
    changed={k for k in set(after)&set(before) if after[k]!=before[k]}
    details=[{'kind':'added','key':k,'after':after[k]} for k in sorted(added)]
    details += [{'kind':'changed','key':k,'before':before[k],'after':after[k]} for k in sorted(changed)]
    details += [{'kind':'removed','key':k,'before':before[k]} for k in sorted(removed)]
    return {'added':len(added),'changed':len(changed),'removed':len(removed)},details

def atomic(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    temporary=path.with_name(path.name+'.tmp');temporary.write_bytes(data);temporary.replace(path)

def write_snapshot(data,destination,source_url='',notices=None,checked_at=None):
    destination=Path(destination);destination.mkdir(parents=True,exist_ok=True)
    old_path=destination/'schedule.json';old=json.loads(old_path.read_text()) if old_path.exists() else None
    if not data.get('sheets') or not records(data):raise ValueError('Пустой файл не заменяет базу')
    notices=notices if notices is not None else data.get('notices',[])
    canonical=json.dumps({'records':records(data),'notices':notices},sort_keys=True,ensure_ascii=False,separators=(',',':')).encode()
    revision=hashlib.sha256(canonical).hexdigest();previous=old.get('revision') if old else None
    now=checked_at or dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds')
    old_manifest=json.loads((destination/'latest.json').read_text()) if (destination/'latest.json').exists() else {}
    changed=revision!=previous
    changes,details=difference(old,data)
    if old is None:changes={'added':0,'changed':0,'removed':0};details=[]
    if changed:
        data.update(revision=revision,notices=notices)
        data['source']['pageUrl']=SOURCE
        if source_url:data['source']['fileUrl']=source_url
        payload=json.dumps(data,ensure_ascii=False,separators=(',',':')).encode()
        atomic(old_path,payload)
        db_temp=destination/'schedule.sqlite.tmp'
        if db_temp.exists():db_temp.unlink()
        connection=sqlite3.connect(db_temp)
        connection.executescript('CREATE TABLE metadata(key TEXT PRIMARY KEY,value TEXT);CREATE TABLE entries(kind TEXT,entity TEXT,date TEXT,pair INTEGER,text TEXT,sheet TEXT,cell TEXT,PRIMARY KEY(kind,entity,date,pair));CREATE INDEX by_entity_date ON entries(entity,date,pair);')
        connection.executemany('INSERT INTO metadata VALUES(?,?)',[('revision',revision),('source_url',source_url),('page_url',SOURCE),('published_at',now)])
        for sheet in data['sheets']:
            for entity in sheet['entities']:
                for entry in entity['entries']:
                    connection.execute('INSERT OR IGNORE INTO entries VALUES(?,?,?,?,?,?,?)',(sheet['kind'],entity['name'],entry['date'],entry['pair'],entry['text'],sheet['title'],entry['cell']))
        connection.commit();connection.close();db_temp.replace(destination/'schedule.sqlite')
        atomic(destination/'changes.json',json.dumps({'revision':revision,'publishedAt':now,'changes':changes,'infoChanged':notices!=(old or {}).get('notices',[]),'details':details},ensure_ascii=False,separators=(',',':')).encode())
    else:payload=old_path.read_bytes();changes=old_manifest.get('changes',{'added':0,'changed':0,'removed':0})
    manifest={'revision':revision,'data':'data/schedule.json','sha256':hashlib.sha256(payload).hexdigest(),'checkedAt':now,'publishedAt':now if changed else old_manifest.get('publishedAt',now),'sourceUrl':SOURCE,'fileUrl':source_url or old_manifest.get('fileUrl',''),'changes':changes,'infoChanged':notices!=(old or {}).get('notices',[]) if changed else old_manifest.get('infoChanged',False),'checkFrequency':'manual'}
    atomic(destination/'latest.json',json.dumps(manifest,ensure_ascii=False,separators=(',',':')).encode())
    return changed,manifest

def refresh(page_url=SOURCE):
    body=download(page_url,4*1024*1024)
    try:document=body.decode('utf-8')
    except UnicodeDecodeError:document=body.decode('cp1251')
    page=SourcePage();page.feed(document)
    options=candidates(page,page_url)
    if not options:raise ValueError('Не найдены ссылки на XLSX ФЗО. Последняя база сохранена.')
    errors=[]
    for _,url,label in options[:5]:
        try:
            workbook=download(url,25*1024*1024)
            if not workbook.startswith(b'PK'):raise ValueError('Источник вернул не XLSX')
            with tempfile.TemporaryDirectory() as temporary:
                folder=Path(temporary);source=folder/'source.xlsx';source.write_bytes(workbook)
                java=ROOT/'app/src/main/java/ru/rgatu/parttime/XlsxReader.java'
                subprocess.run(['java','-m','jdk.compiler/com.sun.tools.javac.Main','-encoding','UTF-8','-d',str(folder),str(java)],check=True,capture_output=True)
                result=subprocess.run(['java','-cp',str(folder),'ru.rgatu.parttime.XlsxReader',str(source),label or unquote(urlparse(url).path.split('/')[-1])],check=True,capture_output=True)
                data=json.loads(result.stdout)
            notices=sorted(set(t for t in page.lines if len(t)>20 and re.search(r'ФЗО|заочн|расписание звонков|\d\s*пара|экзамены.*начина',t,re.I)))[:60]
            return write_snapshot(data,ROOT/'docs/data',url,notices)
        except Exception as error:errors.append(str(error))
    raise ValueError('Не удалось прочитать ни один файл ФЗО. Последняя база сохранена. '+ '; '.join(errors))

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--seed',type=Path);args=parser.parse_args()
    if args.seed:
        data=json.loads(args.seed.read_text());changed,manifest=write_snapshot(data,ROOT/'docs/data',checked_at='2026-06-23T00:00:00+00:00')
        args.seed.write_bytes((ROOT/'docs/data/schedule.json').read_bytes())
    else:changed,manifest=refresh()
    print(json.dumps({'changed':changed,'revision':manifest['revision'],'changes':manifest['changes']}))
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'],'a') as output:output.write('changed='+str(changed).lower()+'\n')

if __name__=='__main__':main()
