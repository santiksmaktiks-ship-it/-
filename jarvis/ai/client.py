import requests

class AIClient:
    def __init__(self, config): self.config = config
    def chat(self, messages):
        if not self.config.api_key: raise RuntimeError("Добавь API key в Settings.")
        r=requests.post("https://api.openai.com/v1/chat/completions",headers={"Authorization":f"Bearer {self.config.api_key}","Content-Type":"application/json"},json={"model":self.config.model,"messages":messages,"temperature":0.7},timeout=90)
        r.raise_for_status(); return r.json()["choices"][0]["message"]["content"].strip()
    def transcribe(self, wav_path):
        with open(wav_path,"rb") as f:
            r=requests.post("https://api.openai.com/v1/audio/transcriptions",headers={"Authorization":f"Bearer {self.config.api_key}"},files={"file":("audio.wav",f,"audio/wav")},data={"model":"whisper-1","language":self.config.language},timeout=90)
        r.raise_for_status(); return r.json()["text"].strip()
    def speak(self, text, out_path):
        r=requests.post("https://api.openai.com/v1/audio/speech",headers={"Authorization":f"Bearer {self.config.api_key}","Content-Type":"application/json"},json={"model":"gpt-4o-mini-tts","voice":self.config.voice,"input":text},timeout=90)
        r.raise_for_status(); open(out_path,"wb").write(r.content)
