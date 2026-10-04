package ru.rgatu.parttime;

import com.google.firebase.messaging.*;
import java.util.concurrent.*;

public final class PushService extends FirebaseMessagingService {
    @Override public void onNewToken(String token) {
        if(getSharedPreferences("sync",0).getBoolean("notifications",false)) {
            ExecutorService work=Executors.newSingleThreadExecutor();work.execute(()->{try{PushManager.register(getApplicationContext(),token);}catch(Exception ignored){}finally{work.shutdown();}});
        }
    }
    @Override public void onMessageReceived(RemoteMessage message) {
        String revision=message.getData().get("revision");
        if(revision!=null&&revision.matches("[a-f0-9]{64}"))SyncEngine.sync(getApplicationContext(),true);
    }
}
