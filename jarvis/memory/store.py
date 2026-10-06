import json
from pathlib import Path
class MemoryStore:
    def __init__(self, path): self.path=Path(path); self.data=self._load()
    def _load(self):
        try: return json.loads(self.path.read_text(encoding="utf-8"))
        except Exception: return {}
    def get(self,key,default=None): return self.data.get(key,default)
    def set(self,key,value):
        self.data[key]=value; self.path.parent.mkdir(parents=True,exist_ok=True); self.path.write_text(json.dumps(self.data,ensure_ascii=False,indent=2),encoding="utf-8")
