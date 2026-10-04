package ru.rgatu.parttime;

import android.app.job.*;
import android.content.*;
import java.util.concurrent.*;

public final class NotificationJob extends JobService {
    private ExecutorService executor;
    public static void schedule(Context context) {
        JobScheduler scheduler=(JobScheduler)context.getSystemService(Context.JOB_SCHEDULER_SERVICE);
        JobInfo job=new JobInfo.Builder(20261,new ComponentName(context,NotificationJob.class))
            .setRequiredNetworkType(JobInfo.NETWORK_TYPE_ANY).setPeriodic(60*60*1000L).setPersisted(true).build();
        scheduler.schedule(job);
    }
    @Override public boolean onStartJob(JobParameters parameters) {
        executor=Executors.newSingleThreadExecutor();
        executor.execute(()->{SyncEngine.sync(getApplicationContext(),true);jobFinished(parameters,false);executor.shutdown();});return true;
    }
    @Override public boolean onStopJob(JobParameters parameters) {if(executor!=null)executor.shutdownNow();return true;}
    public static final class BootReceiver extends android.content.BroadcastReceiver {
        @Override public void onReceive(Context context,Intent intent){if(Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction()))schedule(context);}
    }
}
