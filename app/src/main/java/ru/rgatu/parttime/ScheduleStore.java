package ru.rgatu.parttime;

import android.content.*;
import android.database.Cursor;
import android.database.sqlite.*;
import java.io.*;
import org.json.*;

/** Atomic offline database, with a separate slot for a user's own Excel file. */
public final class ScheduleStore extends SQLiteOpenHelper {
    private final Context context;
    public ScheduleStore(Context context) { super(context.getApplicationContext(), "rgatu-schedule.db", null, 1); this.context=context.getApplicationContext(); }
    @Override public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE datasets (scope TEXT PRIMARY KEY, revision TEXT NOT NULL, json TEXT NOT NULL, updated_at INTEGER NOT NULL)");
        db.execSQL("CREATE TABLE entries (scope TEXT NOT NULL, sheet_id TEXT NOT NULL, kind TEXT NOT NULL, entity_id TEXT NOT NULL, entity_name TEXT NOT NULL, date TEXT NOT NULL, pair INTEGER NOT NULL, text TEXT NOT NULL, cell TEXT NOT NULL, PRIMARY KEY(scope,sheet_id,entity_id,date,pair))");
        db.execSQL("CREATE INDEX entries_by_date ON entries(scope,entity_id,date,pair)");
    }
    @Override public void onUpgrade(SQLiteDatabase db,int oldVersion,int newVersion) { throw new IllegalStateException("Неизвестная версия базы."); }
    public static void validate(JSONObject data) throws JSONException {
        JSONArray sheets=data.getJSONArray("sheets"); int total=0;
        if(sheets.length()==0||sheets.length()>80)throw new JSONException("В файле нет поддерживаемого расписания.");
        for(int i=0;i<sheets.length();i++) {
            JSONObject sheet=sheets.getJSONObject(i); String kind=sheet.getString("kind");
            if(!kind.matches("groups|teachers|rooms"))throw new JSONException("Неизвестный тип листа.");
            JSONArray entities=sheet.getJSONArray("entities");
            for(int j=0;j<entities.length();j++) {
                JSONObject entity=entities.getJSONObject(j);entity.getString("id");entity.getString("name");
                JSONArray rows=entity.getJSONArray("entries");
                for(int k=0;k<rows.length();k++) {
                    JSONObject row=rows.getJSONObject(k);int pair=row.getInt("pair");
                    if(!row.getString("date").matches("\\d{4}-\\d{2}-\\d{2}")||pair<1||pair>20||row.getString("text").trim().isEmpty())throw new JSONException("Некорректная запись расписания.");
                    if(++total>100000)throw new JSONException("В расписании слишком много записей.");
                }
            }
        }
        if(total==0)throw new JSONException("Расписание пустое.");
    }
    public synchronized void put(String scope,String json) throws JSONException {
        JSONObject data=new JSONObject(json);validate(data);
        SQLiteDatabase db=getWritableDatabase();db.beginTransaction();
        try {
            ContentValues meta=new ContentValues();meta.put("scope",scope);meta.put("json",json);meta.put("revision",data.optString("revision","bundled"));meta.put("updated_at",System.currentTimeMillis());
            db.insertWithOnConflict("datasets",null,meta,SQLiteDatabase.CONFLICT_REPLACE);
            db.delete("entries","scope=?",new String[]{scope});
            JSONArray sheets=data.getJSONArray("sheets");
            for(int i=0;i<sheets.length();i++) {
                JSONObject sheet=sheets.getJSONObject(i);JSONArray entities=sheet.getJSONArray("entities");
                for(int j=0;j<entities.length();j++) {
                    JSONObject entity=entities.getJSONObject(j);JSONArray rows=entity.getJSONArray("entries");
                    for(int k=0;k<rows.length();k++) {
                        JSONObject row=rows.getJSONObject(k);ContentValues v=new ContentValues();
                        v.put("scope",scope);v.put("sheet_id",sheet.getString("id"));v.put("kind",sheet.getString("kind"));v.put("entity_id",entity.getString("id"));v.put("entity_name",entity.getString("name"));v.put("date",row.getString("date"));v.put("pair",row.getInt("pair"));v.put("text",row.getString("text"));v.put("cell",row.optString("cell",""));
                        db.insertOrThrow("entries",null,v);
                    }
                }
            }
            db.setTransactionSuccessful();
        } finally { db.endTransaction(); }
    }
    public String get(String scope) {
        try(Cursor cursor=getReadableDatabase().query("datasets",new String[]{"json"},"scope=?",new String[]{scope},null,null,null)) { return cursor.moveToFirst()?cursor.getString(0):null; }
    }
    public String revision() {
        try(Cursor cursor=getReadableDatabase().query("datasets",new String[]{"revision"},"scope=?",new String[]{"official"},null,null,null)) { return cursor.moveToFirst()?cursor.getString(0):""; }
    }
    public String active() throws Exception {
        String official=get("official");
        if(official==null) {
            ByteArrayOutputStream out=new ByteArrayOutputStream();
            try(InputStream in=context.getAssets().open("schedule.json")){byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1)out.write(b,0,n);}
            official=out.toString("UTF-8");put("official",official);
        }
        if(context.getSharedPreferences("sync",0).getBoolean("manual",false)) { String manual=get("import");if(manual!=null)return manual; }
        return official;
    }
}
