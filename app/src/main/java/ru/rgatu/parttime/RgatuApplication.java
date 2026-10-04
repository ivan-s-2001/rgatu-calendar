package ru.rgatu.parttime;
public final class RgatuApplication extends android.app.Application {
    @Override public void onCreate(){super.onCreate();PushManager.restore(this);}
}
