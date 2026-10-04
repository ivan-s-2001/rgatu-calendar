package ru.rgatu.parttime;

import android.app.*;
import android.content.*;
import android.content.res.Configuration;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.*;
import android.provider.OpenableColumns;
import android.util.AtomicFile;
import android.view.*;
import android.webkit.*;
import android.widget.*;
import java.io.*;
import java.net.*;
import java.util.concurrent.*;
import org.json.*;

public final class MainActivity extends Activity {
    private static final String ORIGIN = "appassets.androidplatform.net";
    private static final String PAGE = "https://ivan-s-2001.github.io/rgatu-calendar/";
    private static final int VERSION_CODE = 1;
    private static final String VERSION_NAME = "1.0.0";
    private WebView web;
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private boolean alive = true;
    private boolean pageReady = false;

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE);
        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(246, 247, 249));
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            root.setOnApplyWindowInsetsListener((v, insets) -> {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout());
                v.setPadding(bars.left, bars.top, bars.right, bars.bottom);
                return insets;
            });
        }
        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(246, 247, 249));
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setBuiltInZoomControls(false);
        web.addJavascriptInterface(new Bridge(), "Android");
        web.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView view,String url){pageReady=true;refreshFromServer();}
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
                Uri url = req.getUrl();
                if (!ORIGIN.equals(url.getHost()) || !"https".equals(url.getScheme()))
                    return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream(new byte[0]));
                String path = url.getPath();
                if (path == null || !path.startsWith("/assets/") || path.contains("..")) return null;
                path = path.substring(8);
                String mime = path.endsWith(".js") ? "application/javascript" : path.endsWith(".css") ? "text/css"
                        : path.endsWith(".json") ? "application/json" : path.endsWith(".svg") ? "image/svg+xml" : "text/html";
                try { return new WebResourceResponse(mime, "UTF-8", getAssets().open(path)); }
                catch (IOException e) { return new WebResourceResponse("text/plain", "UTF-8", new ByteArrayInputStream(new byte[0])); }
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest req) {
                return !ORIGIN.equals(req.getUrl().getHost());
            }
        });
        boolean dark = (getResources().getConfiguration().uiMode & Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
        setBars(dark);
        web.loadUrl("https://" + ORIGIN + "/assets/index.html");
        NotificationJob.schedule(this);
    }

    public final class Bridge {
        @JavascriptInterface public String data() {
            try (ScheduleStore store=new ScheduleStore(MainActivity.this)) {
                return store.active();
            } catch (Exception e) { return "{}"; }
        }
        @JavascriptInterface public String state() { return getPreferences(0).getString("state", "{}"); }
        @JavascriptInterface public void saveState(String value) { if (value.length() < 100000) getPreferences(0).edit().putString("state", value).apply(); }
        @JavascriptInterface public String version() { return VERSION_NAME; }
        @JavascriptInterface public void theme(boolean dark) { runOnUiThread(() -> setBars(dark)); }
        @JavascriptInterface public void importFile() {
            runOnUiThread(() -> {
                Intent pick = new Intent(Intent.ACTION_OPEN_DOCUMENT).setType("*/*").addCategory(Intent.CATEGORY_OPENABLE);
                pick.putExtra(Intent.EXTRA_MIME_TYPES, new String[]{"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/octet-stream"});
                try { startActivityForResult(pick, 101); } catch (ActivityNotFoundException e) { message("На телефоне не найден выбор файлов."); }
            });
        }
        @JavascriptInterface public void resetData() {
            runOnUiThread(() -> new AlertDialog.Builder(MainActivity.this).setTitle("Вернуть официальное расписание?")
                .setMessage("Откроется последняя сохранённая официальная база. Избранное сохранится.")
                .setNegativeButton("Отмена", null).setPositiveButton("Вернуть", (d, w) -> {
                    getSharedPreferences("sync",0).edit().putBoolean("manual",false).apply();
                    try(ScheduleStore store=new ScheduleStore(MainActivity.this)) {String json=store.active();call("onDataset",json);}
                    catch (Exception e) { message("Не удалось прочитать расписание."); }
                }).show());
        }
        @JavascriptInterface public void share(String text) {
            if (text.length() > 32000) return;
            runOnUiThread(() -> {
                Intent send = new Intent(Intent.ACTION_SEND).setType("text/plain").putExtra(Intent.EXTRA_TEXT, text);
                startActivity(Intent.createChooser(send, "Поделиться расписанием"));
            });
        }
        @JavascriptInterface public void openPage() { runOnUiThread(() -> openExternal(PAGE)); }
        @JavascriptInterface public void openOfficial(String url) {
            try { URL target=new URL(url);if("https".equals(target.getProtocol())&&java.util.Arrays.asList("www.rsatu.ru","old.rsatu.ru","lk.rsatu.ru").contains(target.getHost()))runOnUiThread(()->openExternal(url)); }catch(Exception ignored){}
        }
        @JavascriptInterface public boolean notificationsEnabled() {
            return getSharedPreferences("sync",0).getBoolean("notifications",false)&&(Build.VERSION.SDK_INT<33||checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)==android.content.pm.PackageManager.PERMISSION_GRANTED);
        }
        @JavascriptInterface public void setNotifications(boolean enabled) {
            if(!enabled){worker.execute(()->{PushManager.unsubscribe(MainActivity.this);call("onNotificationPermission","{}");});return;}
            if(Build.VERSION.SDK_INT>=33&&checkSelfPermission(android.Manifest.permission.POST_NOTIFICATIONS)!=android.content.pm.PackageManager.PERMISSION_GRANTED) {
                runOnUiThread(()->requestPermissions(new String[]{android.Manifest.permission.POST_NOTIFICATIONS},202));return;
            }
            enablePush();
        }
        @JavascriptInterface public void syncData() {worker.execute(()->call("onSyncComplete",SyncEngine.sync(MainActivity.this,true).toString()));}
        @JavascriptInterface public void download(String relative) {
            try {
                URL url = new URL(new URL(PAGE), relative);
                if ("https".equals(url.getProtocol()) && "ivan-s-2001.github.io".equals(url.getHost()) && url.getPath().startsWith("/rgatu-calendar/") && url.getPath().endsWith(".apk"))
                    runOnUiThread(() -> openExternal(url.toString()));
            } catch (Exception ignored) {}
        }
        @JavascriptInterface public void checkUpdate() {
            worker.execute(() -> {
                HttpURLConnection connection = null;
                try {
                    connection = (HttpURLConnection) new URL(PAGE + "version.json?current=" + VERSION_CODE + "&t=" + System.currentTimeMillis()).openConnection();
                    connection.setConnectTimeout(12000); connection.setReadTimeout(12000); connection.setUseCaches(false);
                    if (connection.getResponseCode() != 200) throw new IOException();
                    JSONObject release = new JSONObject(readText(connection.getInputStream(), 65536));
                    if (!release.has("versionCode") || !release.has("versionName") || !release.has("apk")) throw new IOException();
                    release.put("available", release.getInt("versionCode") > VERSION_CODE);
                    call("onUpdate", release.toString());
                } catch (Exception e) { call("onUpdate", "{\"error\":\"Не удалось проверить обновление. Проверьте интернет и попробуйте ещё раз.\"}"); }
                finally { if (connection != null) connection.disconnect(); }
            });
        }
    }

    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request != 101 || result != RESULT_OK || data == null || data.getData() == null) return;
        final Uri uri = data.getData();
        String display = "Расписание.xlsx";
        try (Cursor c = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (c != null && c.moveToFirst()) display = c.getString(0);
        } catch (Exception ignored) {}
        final String filename = display;
        call("onImportStart", "{}");
        worker.execute(() -> {
            try (InputStream in = getContentResolver().openInputStream(uri)) {
                if (in == null) throw new IOException("Не удалось открыть файл.");
                String json = XlsxReader.read(in, filename);
                try(ScheduleStore store=new ScheduleStore(MainActivity.this)){store.put("import",json);}
                getSharedPreferences("sync",0).edit().putBoolean("manual",true).apply();
                call("onDataset", json);
            } catch (Exception e) {
                String msg = e.getMessage();
                call("onImportError", "{\"error\":" + XlsxReader.quote(msg == null ? "Не удалось открыть Excel. Выберите XLSX с расписанием РГАТУ." : msg) + "}");
            }
        });
    }
    private static String readText(InputStream in, int limit) throws IOException {
        try (InputStream input = in; ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[8192]; int n;
            while ((n = input.read(buffer)) != -1) { if (out.size() + n > limit) throw new IOException("Файл слишком большой."); out.write(buffer, 0, n); }
            return out.toString("UTF-8");
        }
    }
    private void call(String name, String json) { runOnUiThread(() -> { if (alive) web.evaluateJavascript("window." + name + "(" + json + ")", null); }); }
    private void message(String text) { Toast.makeText(this, text, Toast.LENGTH_LONG).show(); }
    private void refreshFromServer() {
        long last=getSharedPreferences("sync",0).getLong("last_attempt",0);
        if(!pageReady||System.currentTimeMillis()-last<60*60*1000L)return;
        worker.execute(()->call("onAutoSync",SyncEngine.sync(MainActivity.this,true).toString()));
    }
    private void enablePush() {
        worker.execute(()->{try{PushManager.subscribe(MainActivity.this);call("onNotificationPermission","{}");runOnUiThread(()->message("Уведомления подключены"));}
            catch(Exception error){getSharedPreferences("sync",0).edit().putBoolean("notifications",false).apply();call("onNotificationPermission","{}");runOnUiThread(()->message(error.getMessage()==null?"Не удалось включить уведомления.":error.getMessage()));}});
    }
    private void openExternal(String url) {
        try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url))); }
        catch (ActivityNotFoundException e) { message("Не найден браузер для открытия страницы."); }
    }
    private void setBars(boolean dark) {
        int bg = dark ? Color.rgb(20, 23, 28) : Color.rgb(246, 247, 249);
        getWindow().setStatusBarColor(bg); getWindow().setNavigationBarColor(bg);
        if (Build.VERSION.SDK_INT >= 30) {
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) controller.setSystemBarsAppearance(dark ? 0 : WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS,
                WindowInsetsController.APPEARANCE_LIGHT_STATUS_BARS | WindowInsetsController.APPEARANCE_LIGHT_NAVIGATION_BARS);
        } else getWindow().getDecorView().setSystemUiVisibility(dark ? 0 : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        if (web != null) { web.setBackgroundColor(bg); if (web.getParent() instanceof View) ((View) web.getParent()).setBackgroundColor(bg); }
    }
    @Override public void onBackPressed() {
        web.evaluateJavascript("window.handleBack ? window.handleBack() : false", result -> { if (!"true".equals(result)) finish(); });
    }
    @Override protected void onResume(){super.onResume();if(pageReady){web.evaluateJavascript("window.refreshFromDevice && window.refreshFromDevice()",null);refreshFromServer();}}
    @Override public void onRequestPermissionsResult(int request,String[] permissions,int[] results){super.onRequestPermissionsResult(request,permissions,results);if(request==202){if(results.length>0&&results[0]==android.content.pm.PackageManager.PERMISSION_GRANTED)enablePush();else call("onNotificationPermission","{}");}}
    @Override protected void onDestroy() { alive = false; worker.shutdownNow(); if (web != null) { web.removeJavascriptInterface("Android"); web.destroy(); } super.onDestroy(); }
}
