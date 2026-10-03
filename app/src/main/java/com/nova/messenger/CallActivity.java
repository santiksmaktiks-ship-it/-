package com.nova.messenger;
import android.Manifest;
import android.app.Activity;
import android.os.Bundle;
import android.content.pm.PackageManager;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class CallActivity extends Activity {
    private WebView web;
    private String url;
    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        url=getIntent().getStringExtra("url");
        if (checkSelfPermission(Manifest.permission.CAMERA)!=PackageManager.PERMISSION_GRANTED ||
            checkSelfPermission(Manifest.permission.RECORD_AUDIO)!=PackageManager.PERMISSION_GRANTED) {
            requestPermissions(new String[]{Manifest.permission.CAMERA,Manifest.permission.RECORD_AUDIO},900);
        }
        open();
    }
    private void open(){
        web=new WebView(this);
        WebSettings s=web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient(){
            @Override public void onPermissionRequest(final PermissionRequest req){
                runOnUiThread(() -> req.grant(req.getResources()));
            }
        });
        setContentView(web);
        web.loadUrl(url);
    }
    @Override public void onRequestPermissionsResult(int r,String[] p,int[] g){
        super.onRequestPermissionsResult(r,p,g); if(r==900 && web!=null) web.reload();
    }
    @Override public void onBackPressed(){ if(web!=null && web.canGoBack()) web.goBack(); else super.onBackPressed(); }
    @Override protected void onDestroy(){ if(web!=null) web.destroy(); super.onDestroy(); }
}