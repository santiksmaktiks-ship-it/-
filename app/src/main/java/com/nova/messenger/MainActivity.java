package com.nova.messenger;
import android.app.Activity;
import android.content.*;
import android.net.wifi.WifiManager;
import android.os.*;
import android.webkit.*;
import org.json.JSONObject;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.UUID;

public class MainActivity extends Activity {
    static final String GROUP="239.10.10.10"; static final int PORT=45454;
    WebView web; SharedPreferences prefs; String deviceId,nickname; MulticastSocket socket; WifiManager.MulticastLock lock; volatile boolean listening;
    @Override public void onCreate(Bundle b){
        super.onCreate(b);
        prefs=getSharedPreferences("nova",MODE_PRIVATE);
        deviceId=prefs.getString("device_id",null);
        if(deviceId==null){deviceId=UUID.randomUUID().toString();prefs.edit().putString("device_id",deviceId).apply();}
        nickname=prefs.getString("nickname","Nova User");
        web=new WebView(this);
        WebSettings s=web.getSettings(); s.setJavaScriptEnabled(true); s.setDomStorageEnabled(true); s.setMediaPlaybackRequiresUserGesture(false);
        web.setWebViewClient(new WebViewClient());
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new Bridge(),"Android");
        setContentView(web); web.loadUrl("file:///android_asset/index.html"); startLan();
    }
    void startLan(){
        try{
            WifiManager wm=(WifiManager)getApplicationContext().getSystemService(WIFI_SERVICE);
            lock=wm.createMulticastLock("NovaMessenger"); lock.setReferenceCounted(false); lock.acquire();
        }catch(Exception ignored){}
        listening=true;
        new Thread(()->{
            try{
                socket=new MulticastSocket(PORT); InetAddress group=InetAddress.getByName(GROUP); socket.joinGroup(group);
                byte[] buf=new byte[32768];
                while(listening){
                    DatagramPacket p=new DatagramPacket(buf,buf.length); socket.receive(p);
                    String raw=new String(p.getData(),p.getOffset(),p.getLength(),StandardCharsets.UTF_8);
                    runOnUiThread(()->web.evaluateJavascript("window.onLanMessage("+JSONObject.quote(raw)+");",null));
                }
            }catch(Exception ignored){} finally { if(socket!=null) socket.close(); }
        },"nova-lan-listener").start();
    }
    void sendLan(String payload){
        new Thread(()->{try{
            if(socket==null||socket.isClosed()) socket=new MulticastSocket();
            byte[] d=payload.getBytes(StandardCharsets.UTF_8);
            socket.send(new DatagramPacket(d,d.length,InetAddress.getByName(GROUP),PORT));
        }catch(Exception ignored){}},"nova-lan-send").start();
    }
    void startCall(String mode,String room){
        Intent i=new Intent(this,CallActivity.class);
        i.putExtra("url","https://meet.jit.si/NovaMessenger-"+room.replaceAll("[^a-zA-Z0-9_-]","-"));
        i.putExtra("mode",mode); startActivity(i);
    }
    public class Bridge{
        @JavascriptInterface public String getNickname(){return nickname;}
        @JavascriptInterface public String getDeviceId(){return deviceId;}
        @JavascriptInterface public void setNickname(String v){ nickname=(v==null||v.trim().isEmpty())?"Nova User":v.trim(); if(nickname.length()>32) nickname=nickname.substring(0,32); prefs.edit().putString("nickname",nickname).apply(); }
        @JavascriptInterface public void sendLanMessage(String p){try{JSONObject o=new JSONObject(p);o.put("senderId",deviceId);o.put("nick",nickname);sendLan(o.toString());}catch(Exception ignored){}}
        @JavascriptInterface public void startCall(String m,String r){runOnUiThread(()->MainActivity.this.startCall(m,r));}
        @JavascriptInterface public void copyText(String t){ClipboardManager cm=(ClipboardManager)getSystemService(CLIPBOARD_SERVICE);cm.setPrimaryClip(ClipData.newPlainText("Nova Messenger",t==null?"":t));}
    }
    @Override protected void onDestroy(){listening=false;if(socket!=null)socket.close();try{if(lock!=null&&lock.isHeld())lock.release();}catch(Exception ignored){}if(web!=null)web.destroy();super.onDestroy();}
}