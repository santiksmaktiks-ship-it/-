import tkinter as tk
from tkinter import ttk, messagebox
import threading, os
class JarvisWindow:
    def __init__(self, app):
        self.app=app; self.root=tk.Tk(); self.root.title("JARVIS AI"); self.root.geometry("900x650"); self.root.configure(bg="#0b0f14")
        self.chat=tk.Text(self.root,bg="#111821",fg="#e8eef5",insertbackground="white",font=("Segoe UI",12),relief="flat"); self.chat.pack(fill="both",expand=True,padx=18,pady=(18,8))
        bar=tk.Frame(self.root,bg="#0b0f14"); bar.pack(fill="x",padx=18,pady=12)
        self.entry=tk.Entry(bar,bg="#18212b",fg="white",insertbackground="white",font=("Segoe UI",12),relief="flat"); self.entry.pack(side="left",fill="x",expand=True,ipady=12); self.entry.bind("<Return>",lambda e:self.send())
        tk.Button(bar,text="SEND",command=self.send,bg="#243241",fg="white",relief="flat",padx=20).pack(side="left",padx=6)
        tk.Button(bar,text="🎙",command=self.voice,bg="#243241",fg="white",relief="flat",padx=16).pack(side="left")
        tk.Button(bar,text="SETTINGS",command=self.settings,bg="#243241",fg="white",relief="flat").pack(side="left",padx=6)
    def write(self,s): self.chat.insert("end",s+"\n\n"); self.chat.see("end")
    def send(self):
        text=self.entry.get().strip()
        if not text:return
        self.entry.delete(0,"end"); self.write("YOU: "+text); threading.Thread(target=self._ask,args=(text,),daemon=True).start()
    def _ask(self,text):
        try: ans=self.app.ask(text); self.root.after(0,self.write,"JARVIS: "+ans)
        except Exception as e:self.root.after(0,messagebox.showerror,"JARVIS",str(e))
    def voice(self):
        def work():
            try:
                wav=self.app.mic.record(); text=self.app.ai.transcribe(wav); self.root.after(0,lambda:(self.entry.delete(0,"end"),self.entry.insert(0,text),self.send()))
            except Exception as e:self.root.after(0,messagebox.showerror,"Microphone",str(e))
        threading.Thread(target=work,daemon=True).start()
    def settings(self):
        w=tk.Toplevel(self.root); w.title("JARVIS Settings"); w.geometry("520x300"); w.configure(bg="#0b0f14")
        labels=["API key","Model","Language","Voice"]; vars=[]
        vals=[self.app.config.api_key,self.app.config.model,self.app.config.language,self.app.config.voice]
        for i,(lab,val) in enumerate(zip(labels,vals)):
            tk.Label(w,text=lab,bg="#0b0f14",fg="white").grid(row=i,column=0,padx=12,pady=10,sticky="w"); v=tk.StringVar(value=val); vars.append(v); tk.Entry(w,textvariable=v,width=42,bg="#18212b",fg="white",insertbackground="white").grid(row=i,column=1,padx=12,pady=10)
        def save():
            self.app.config.api_key,self.app.config.model,self.app.config.language,self.app.config.voice=[v.get().strip() for v in vars]; self.app.config.save(); w.destroy()
        tk.Button(w,text="SAVE",command=save).grid(row=5,column=1,pady=15,sticky="e")
    def run(self): self.root.mainloop()
