import json, os, threading, tempfile, wave, time
import tkinter as tk
from tkinter import ttk, messagebox
import requests
import sounddevice as sd
import numpy as np

APP_NAME="JARVIS"
CONFIG=os.path.join(os.getenv("APPDATA") or os.path.expanduser("~"), "JarvisAssistant", "config.json")
os.makedirs(os.path.dirname(CONFIG), exist_ok=True)

def load_config():
    try:
        with open(CONFIG,"r",encoding="utf-8") as f: return json.load(f)
    except Exception: return {"api_key":"","model":"gpt-4o-mini","language":"ru","voice":True,"input_device":None,"output_device":None}

def save_config(c):
    with open(CONFIG,"w",encoding="utf-8") as f: json.dump(c,f,ensure_ascii=False,indent=2)

class Jarvis:
    def __init__(self, root):
        self.root=root; self.cfg=load_config(); self.recording=False; self.frames=[]
        root.title("JARVIS AI"); root.geometry("1050x760"); root.minsize(850,620); root.configure(bg="#070b12")
        self.style=ttk.Style(); self.style.theme_use("clam")
        self.style.configure("TButton",font=("Segoe UI",10),padding=8,background="#121a27",foreground="#e8f4ff")
        self.build()
        self.refresh_devices()

    def build(self):
        top=tk.Frame(self.root,bg="#070b12"); top.pack(fill="x",padx=24,pady=18)
        tk.Label(top,text="J A R V I S",font=("Segoe UI",22,"bold"),fg="#8fe8ff",bg="#070b12").pack(side="left")
        tk.Label(top,text="  AI ASSISTANT",font=("Segoe UI",10),fg="#60758a",bg="#070b12").pack(side="left",pady=(8,0))
        ttk.Button(top,text="⚙ Настройки",command=self.settings).pack(side="right")
        self.status=tk.Label(self.root,text="ГОТОВ",font=("Segoe UI",10,"bold"),fg="#61d9a2",bg="#070b12"); self.status.pack()
        chatbox=tk.Frame(self.root,bg="#0b111b",highlightthickness=1,highlightbackground="#182638"); chatbox.pack(fill="both",expand=True,padx=24,pady=12)
        self.chat=tk.Text(chatbox,bg="#0b111b",fg="#d9e8f4",insertbackground="white",font=("Segoe UI",11),wrap="word",padx=18,pady=18,bd=0)
        self.chat.pack(fill="both",expand=True); self.chat.tag_config("user",foreground="#8fe8ff"); self.chat.tag_config("jarvis",foreground="#b9ffc9")
        bottom=tk.Frame(self.root,bg="#070b12"); bottom.pack(fill="x",padx=24,pady=12)
        self.entry=tk.Entry(bottom,bg="#111a27",fg="#e8f4ff",insertbackground="white",font=("Segoe UI",12),relief="flat")
        self.entry.pack(side="left",fill="x",expand=True,ipady=12,padx=(0,10)); self.entry.bind("<Return>",lambda e:self.send_text())
        ttk.Button(bottom,text="Отправить",command=self.send_text).pack(side="right")
        self.voice=tk.Button(self.root,text="🎙",font=("Segoe UI",30,"bold"),fg="#dffaff",bg="#102234",activebackground="#17384e",relief="flat",width=4,height=1,command=self.toggle_record)
        self.voice.pack(pady=(4,8))
        self.voice.bind("<ButtonPress-1>",self.start_record); self.voice.bind("<ButtonRelease-1>",self.stop_record)
        tk.Label(self.root,text="Удерживай кнопку и говори • Enter отправляет текст",font=("Segoe UI",9),fg="#52697d",bg="#070b12").pack(pady=(0,16))
        self.add("JARVIS","Система онлайн. Введи запрос или удерживай кнопку микрофона. Я использую AI-модель для ответов.")

    def add(self,who,text):
        self.chat.insert("end",f"{who}:\n",who.lower()); self.chat.insert("end",text+"\n\n"); self.chat.see("end")

    def set_status(self,s,color="#61d9a2"): self.status.config(text=s,fg=color); self.root.update_idletasks()

    def send_text(self):
        text=self.entry.get().strip()
        if not text:return
        self.entry.delete(0,"end"); self.add("USER",text); threading.Thread(target=self.ask,args=(text,),daemon=True).start()

    def ask(self,text):
        key=self.cfg.get("api_key","").strip()
        if not key:
            self.root.after(0,lambda:self.add("JARVIS","API-ключ не задан. Открой ⚙ Настройки и вставь ключ OpenAI."))
            return
        self.root.after(0,lambda:self.set_status("ДУМАЮ...","#ffd166"))
        system=("Ты JARVIS, умный персональный AI-ассистент пользователя. Отвечай полезно, точно и кратко, "
                "на языке пользователя. Если задача требует уточнений, задай их. Не выдумывай факты.")
        try:
            r=requests.post("https://api.openai.com/v1/chat/completions",headers={"Authorization":f"Bearer {key}","Content-Type":"application/json"},
                json={"model":self.cfg.get("model","gpt-4o-mini"),"messages":[{"role":"system","content":system},{"role":"user","content":text}],"temperature":0.7},timeout=90)
            r.raise_for_status(); answer=r.json()["choices"][0]["message"]["content"]
            self.root.after(0,lambda:self.add("JARVIS",answer)); self.root.after(0,lambda:self.set_status("ГОТОВ"))
            if self.cfg.get("voice"): threading.Thread(target=self.speak,args=(answer,),daemon=True).start()
        except Exception as e:
            msg=f"Ошибка AI: {e}"
            self.root.after(0,lambda:self.add("JARVIS",msg)); self.root.after(0,lambda:self.set_status("ОШИБКА","#ff6b6b"))

    def start_record(self,event=None):
        if self.recording:return
        self.recording=True; self.frames=[]; self.set_status("СЛУШАЮ...","#8fe8ff"); self.voice.config(bg="#17435a")
        def rec():
            try:
                dev=self.cfg.get("input_device"); sr=16000
                def cb(indata,frames,time_info,status):
                    if self.recording:self.frames.append(indata.copy())
                self.stream=sd.InputStream(device=dev,samplerate=sr,channels=1,dtype="float32",callback=cb)
                self.stream.start()
            except Exception as e:
                self.recording=False; self.root.after(0,lambda:messagebox.showerror("Микрофон",str(e)))
        threading.Thread(target=rec,daemon=True).start()

    def stop_record(self,event=None):
        if not self.recording:return
        self.recording=False; self.voice.config(bg="#102234")
        try:self.stream.stop(); self.stream.close()
        except:pass
        if not self.frames:return
        audio=np.concatenate(self.frames,axis=0)
        fd,path=tempfile.mkstemp(suffix=".wav"); os.close(fd)
        with wave.open(path,"wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(16000); w.writeframes((audio*32767).astype(np.int16).tobytes())
        threading.Thread(target=self.transcribe,args=(path,),daemon=True).start()

    def transcribe(self,path):
        key=self.cfg.get("api_key","").strip()
        if not key:return
        self.root.after(0,lambda:self.set_status("РАСПОЗНАЮ...","#ffd166"))
        try:
            with open(path,"rb") as f:
                r=requests.post("https://api.openai.com/v1/audio/transcriptions",headers={"Authorization":f"Bearer {key}"},files={"file":("speech.wav",f,"audio/wav")},data={"model":"whisper-1","language":self.cfg.get("language","ru")},timeout=90)
            r.raise_for_status(); text=r.json().get("text","").strip()
            if text:self.root.after(0,lambda:self.add("USER",text)); threading.Thread(target=self.ask,args=(text,),daemon=True).start()
        except Exception as e:self.root.after(0,lambda:self.add("JARVIS",f"Ошибка распознавания: {e}"))
        finally:
            try:os.remove(path)
            except:pass

    def speak(self,text):
        key=self.cfg.get("api_key","").strip()
        try:
            r=requests.post("https://api.openai.com/v1/audio/speech",headers={"Authorization":f"Bearer {key}","Content-Type":"application/json"},json={"model":"gpt-4o-mini-tts","voice":"alloy","input":text,"response_format":"wav"},timeout=90)
            r.raise_for_status(); fd,path=tempfile.mkstemp(suffix=".wav"); os.close(fd)
            open(path,"wb").write(r.content)
            with wave.open(path,"rb") as w: data=w.readframes(w.getnframes()); rate=w.getframerate(); ch=w.getnchannels()
            audio=np.frombuffer(data,dtype=np.int16).astype(np.float32)/32768
            if ch>1: audio=audio.reshape(-1,ch)
            sd.play(audio,rate,device=self.cfg.get("output_device")); sd.wait(); os.remove(path)
        except Exception as e:self.root.after(0,lambda:self.set_status("ГОТОВ"))

    def refresh_devices(self):
        try:self.devices=sd.query_devices()
        except:self.devices=[]
    def settings(self):
        win=tk.Toplevel(self.root); win.title("Настройки JARVIS"); win.geometry("520x480"); win.configure(bg="#0b111b")
        tk.Label(win,text="Настройки",font=("Segoe UI",18,"bold"),fg="#8fe8ff",bg="#0b111b").pack(pady=16)
        frame=tk.Frame(win,bg="#0b111b"); frame.pack(fill="both",expand=True,padx=24)
        def row(label,var,show=None):
            tk.Label(frame,text=label,fg="#b9cddd",bg="#0b111b").pack(anchor="w",pady=(8,3)); e=tk.Entry(frame,textvariable=var,show=show,bg="#111a27",fg="white",insertbackground="white",relief="flat"); e.pack(fill="x",ipady=8); return e
        key=tk.StringVar(value=self.cfg.get("api_key","")); row("OpenAI API Key",key,"*")
        model=tk.StringVar(value=self.cfg.get("model","gpt-4o-mini")); row("Модель",model)
        lang=tk.StringVar(value=self.cfg.get("language","ru")); row("Язык распознавания (ru/en)",lang)
        tk.Label(frame,text="Микрофон",fg="#b9cddd",bg="#0b111b").pack(anchor="w",pady=(8,3))
        ins=[(i,d["name"]) for i,d in enumerate(self.devices) if d["max_input_channels"]>0]
        out=[(i,d["name"]) for i,d in enumerate(self.devices) if d["max_output_channels"]>0]
        iv=tk.StringVar(value=str(self.cfg.get("input_device",""))); ttk.Combobox(frame,textvariable=iv,values=[f"{i}: {n}" for i,n in ins],state="readonly").pack(fill="x")
        tk.Label(frame,text="Наушники / колонки",fg="#b9cddd",bg="#0b111b").pack(anchor="w",pady=(8,3))
        ov=tk.StringVar(value=str(self.cfg.get("output_device",""))); ttk.Combobox(frame,textvariable=ov,values=[f"{i}: {n}" for i,n in out],state="readonly").pack(fill="x")
        voice=tk.BooleanVar(value=self.cfg.get("voice",True)); tk.Checkbutton(frame,text="Озвучивать ответы",variable=voice,fg="#b9cddd",bg="#0b111b",selectcolor="#111a27",activebackground="#0b111b").pack(anchor="w",pady=10)
        def save():
            def idx(v):
                try:return int(v.get().split(":")[0])
                except:return None
            self.cfg.update({"api_key":key.get().strip(),"model":model.get().strip() or "gpt-4o-mini","language":lang.get().strip() or "ru","input_device":idx(iv),"output_device":idx(ov),"voice":voice.get()}); save_config(self.cfg); win.destroy(); self.add("JARVIS","Настройки сохранены.")
        ttk.Button(frame,text="Сохранить",command=save).pack(pady=12)
        tk.Label(frame,text="Ключ хранится локально в профиле Windows и не записывается в GitHub.",fg="#52697d",bg="#0b111b",font=("Segoe UI",8)).pack()

if __name__=="__main__":
    root=tk.Tk(); Jarvis(root); root.mainloop()
