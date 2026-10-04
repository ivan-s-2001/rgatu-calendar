#!/usr/bin/env python3
"""Build and publish a signed APK and its update manifest. Requires JDK 17 + SDK 35."""
import argparse, hashlib, json, os, re, shutil, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--gradle',default=str(ROOT/'gradlew'))
    parser.add_argument('--offline',action='store_true')
    args=parser.parse_args()
    key=os.environ.get('RGATU_KEYSTORE');password=os.environ.get('RGATU_KEY_PASSWORD')
    if not key or not password or not Path(key).is_file():
        raise SystemExit('Set RGATU_KEYSTORE to the existing signing key and RGATU_KEY_PASSWORD to its password.')
    subprocess.run(['python3',str(ROOT/'tools/prepare_web.py')],check=True)
    command=['bash',args.gradle,'--no-daemon',':app:assembleRelease']
    if args.offline:command.append('--offline')
    subprocess.run(command,cwd=ROOT,check=True)
    source=(ROOT/'app/src/main/java/ru/rgatu/parttime/MainActivity.java').read_text()
    code=int(re.search(r'VERSION_CODE\s*=\s*(\d+)',source).group(1))
    version=re.search(r'VERSION_NAME\s*=\s*"([^"]+)"',source).group(1)
    target=ROOT/'docs/downloads'/('RgatuCalendar-'+version+'.apk');target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(ROOT/'app/build/outputs/apk/release/app-release.apk',target)
    data={'versionCode':code,'versionName':version,'apk':'downloads/'+target.name,'bytes':target.stat().st_size,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'minAndroid':'8.0','notes':'Расписание ФЗО, поиск, избранное, офлайн база, ЛК1 и ЛК2.'}
    (ROOT/'docs/version.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    print(target)
if __name__=='__main__':main()
