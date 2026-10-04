package ru.rgatu.parttime;

import android.content.*;
import com.google.firebase.*;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.android.gms.tasks.Tasks;
import java.io.*;
import java.net.*;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import org.json.*;

/** Firebase settings are downloaded from our backend, so connecting FCM requires no APK rebuild. */
public final class PushManager {
    public static void restore(Context context) {
        String config=context.getSharedPreferences("sync",0).getString("firebase_config","");
        if(!config.isEmpty())try{initialize(context,new JSONObject(config));}catch(Exception ignored){}
    }
    private static synchronized void initialize(Context context,JSONObject config)throws Exception {
        if(!FirebaseApp.getApps(context).isEmpty())return;
        FirebaseOptions options=new FirebaseOptions.Builder().setApplicationId(config.getString("appId"))
            .setApiKey(config.getString("apiKey")).setProjectId(config.getString("projectId"))
            .setGcmSenderId(config.getString("messagingSenderId")).build();
        FirebaseApp.initializeApp(context,options);
    }
    public static JSONObject subscribe(Context context)throws Exception {
        JSONObject config=new JSONObject(SyncEngine.fetch("api/config",65536));
        if(!config.optBoolean("fcmConfigured")||config.isNull("android"))throw new IOException("Серверные уведомления Android ещё не подключены. Сейчас уведомления можно включить в PWA.");
        JSONObject options=config.getJSONObject("android");initialize(context,options);
        context.getSharedPreferences("sync",0).edit().putString("firebase_config",options.toString()).apply();
        FirebaseMessaging messaging=FirebaseMessaging.getInstance();messaging.setAutoInitEnabled(true);
        String token=Tasks.await(messaging.getToken(),20,TimeUnit.SECONDS);
        return register(context,token);
    }
    public static JSONObject register(Context context,String token)throws Exception {
        SharedPreferences prefs=context.getSharedPreferences("sync",0);
        String owner=prefs.getString("push_owner","");
        if(owner.isEmpty()){owner=SyncEngine.sha256(UUID.randomUUID().toString().getBytes("UTF-8"));prefs.edit().putString("push_owner",owner).apply();}
        JSONObject input=new JSONObject();input.put("owner",owner);input.put("token",token);
        JSONObject result=post("api/android/subscribe",input);
        String old=prefs.getString("push_id","");
        prefs.edit().putString("push_id",result.getString("id")).putBoolean("notifications",true).apply();
        if(!old.isEmpty()&&!old.equals(result.getString("id")))unsubscribeId(old,owner);
        return result;
    }
    public static void unsubscribe(Context context) {
        SharedPreferences prefs=context.getSharedPreferences("sync",0);prefs.edit().putBoolean("notifications",false).apply();
        String id=prefs.getString("push_id",""),owner=prefs.getString("push_owner","");
        try{if(!id.isEmpty())unsubscribeId(id,owner);prefs.edit().remove("push_id").apply();}catch(Exception ignored){}
        try{FirebaseMessaging.getInstance().setAutoInitEnabled(false);}catch(Exception ignored){}
    }
    private static void unsubscribeId(String id,String owner)throws Exception {
        JSONObject input=new JSONObject();input.put("id",id);input.put("owner",owner);post("api/push/unsubscribe",input);
    }
    private static JSONObject post(String path,JSONObject data)throws Exception {
        HttpURLConnection connection=(HttpURLConnection)new URL(SyncEngine.ROOT+path).openConnection();
        try {
            connection.setRequestProperty("User-Agent","Mozilla/5.0 RGATUCalendar/1.0 Android");connection.setConnectTimeout(15000);connection.setReadTimeout(15000);connection.setRequestMethod("POST");connection.setDoOutput(true);
            connection.setRequestProperty("Content-Type","application/json");byte[] bytes=data.toString().getBytes("UTF-8");connection.setFixedLengthStreamingMode(bytes.length);
            try(OutputStream out=connection.getOutputStream()){out.write(bytes);}
            if(connection.getResponseCode()!=200)throw new IOException("Не удалось подключить уведомления. Попробуйте позже.");
            try(InputStream in=connection.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()){byte[] b=new byte[4096];int n;while((n=in.read(b))!=-1){if(out.size()+n>65536)throw new IOException();out.write(b,0,n);}return new JSONObject(out.toString("UTF-8"));}
        }finally{connection.disconnect();}
    }
}
