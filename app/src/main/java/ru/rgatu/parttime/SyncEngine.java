package ru.rgatu.parttime;

import android.Manifest;
import android.app.*;
import android.content.*;
import android.content.pm.PackageManager;
import android.os.Build;
import java.io.*;
import java.net.*;
import java.security.MessageDigest;
import java.util.Locale;
import org.json.*;

public final class SyncEngine {
    public static final String ROOT="https://rgatu-calendar-api.ivan-s-2001.workers.dev/";
    public static final String CHANNEL="schedule_changes";
    public static synchronized JSONObject sync(Context context,boolean notify) {
        context.getSharedPreferences("sync",0).edit().putLong("last_attempt",System.currentTimeMillis()).apply();
        try(ScheduleStore store=new ScheduleStore(context)) {
            store.active();
            String manifestText=fetch("api/latest?t="+System.currentTimeMillis(),128*1024);
            JSONObject manifest=new JSONObject(manifestText);
            String revision=manifest.getString("revision");
            if(!revision.matches("[a-f0-9]{64}"))throw new IOException("Некорректная версия расписания.");
            boolean changed=!revision.equals(store.revision());
            if(changed) {
                String path=manifest.optString("data","api/schedule");
                if(!path.equals("api/schedule"))throw new IOException("Некорректный путь расписания.");
                String text=fetch(path+"?revision="+revision,16*1024*1024);
                JSONObject dataset=new JSONObject(text);
                if(!revision.equals(dataset.getString("revision")))throw new IOException("Источник обновляется. Повторите проверку позже.");
                if(!manifest.getString("sha256").equals(sha256(text.getBytes("UTF-8"))))throw new IOException("Не совпала контрольная сумма расписания.");
                store.put("official",text);
                context.getSharedPreferences("sync",0).edit().putString("last_changes",manifest.toString()).apply();
                if(notify)sendNotification(context,manifest);
            }
            context.getSharedPreferences("sync",0).edit().putLong("last_checked",System.currentTimeMillis()).apply();
            JSONObject result=new JSONObject();result.put("changed",changed);
            boolean manual=context.getSharedPreferences("sync",0).getBoolean("manual",false);
            result.put("message",manual?"Официальная база проверена. Сейчас вы просматриваете Excel с телефона.":changed?summary(manifest):"База совпадает с последней опубликованной версией.");
            result.put("data",new JSONObject(store.active()));return result;
        } catch(Exception e) {
            JSONObject result=new JSONObject();try{result.put("error","Не удалось проверить источник. Сохранённое расписание доступно офлайн. Попробуйте позже.");}catch(JSONException ignored){}return result;
        }
    }
    static String fetch(String relative,int limit)throws Exception {
        HttpURLConnection c=(HttpURLConnection)new URL(ROOT+relative).openConnection();
        try {
            c.setRequestProperty("User-Agent","Mozilla/5.0 RGATUCalendar/1.0 Android");c.setConnectTimeout(12000);c.setReadTimeout(12000);c.setUseCaches(false);c.setInstanceFollowRedirects(false);
            if(c.getResponseCode()!=200)throw new IOException("Источник временно недоступен.");
            try(InputStream in=c.getInputStream();ByteArrayOutputStream out=new ByteArrayOutputStream()) {
                byte[] b=new byte[8192];int n;while((n=in.read(b))!=-1){if(out.size()+n>limit)throw new IOException("Данные слишком большие.");out.write(b,0,n);}return out.toString("UTF-8");
            }
        }finally{c.disconnect();}
    }
    public static String sha256(byte[] data)throws Exception {StringBuilder b=new StringBuilder();for(byte value:MessageDigest.getInstance("SHA-256").digest(data))b.append(String.format(Locale.ROOT,"%02x",value&255));return b.toString();}
    public static String summary(JSONObject manifest) {
        JSONObject changes=manifest.optJSONObject("changes");
        if(changes==null)return "Опубликовано новое расписание.";
        return "Добавлено записей: "+changes.optInt("added")+". Изменено: "+changes.optInt("changed")+". Удалено: "+changes.optInt("removed")+"."+(manifest.optBoolean("infoChanged")?" Обновлена информация на сайте.":"");
    }
    private static void sendNotification(Context context,JSONObject manifest) {
        if(!context.getSharedPreferences("sync",0).getBoolean("notifications",false))return;
        if(Build.VERSION.SDK_INT>=33&&context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return;
        NotificationManager manager=(NotificationManager)context.getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationChannel channel=new NotificationChannel(CHANNEL,"Изменения расписания",NotificationManager.IMPORTANCE_DEFAULT);
        channel.setDescription("Добавленные, изменённые и удалённые записи РГАТУ");manager.createNotificationChannel(channel);
        Intent open=new Intent(context,MainActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent intent=PendingIntent.getActivity(context,0,open,PendingIntent.FLAG_UPDATE_CURRENT|PendingIntent.FLAG_IMMUTABLE);
        String text=summary(manifest);
        Notification notification=new Notification.Builder(context,CHANNEL).setSmallIcon(android.R.drawable.ic_popup_sync)
            .setContentTitle("Расписание РГАТУ обновлено").setContentText(text).setStyle(new Notification.BigTextStyle().bigText(text))
            .setContentIntent(intent).setAutoCancel(true).build();manager.notify(2026,notification);
    }
}
