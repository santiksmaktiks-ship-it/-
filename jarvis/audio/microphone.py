import tempfile, wave, sounddevice as sd
import numpy as np
class Microphone:
    def __init__(self, config): self.config=config
    def record(self, seconds=6):
        rate=self.config.sample_rate
        data=sd.rec(int(seconds*rate),samplerate=rate,channels=1,dtype="int16",device=self.config.input_device); sd.wait()
        p=tempfile.mktemp(suffix=".wav")
        with wave.open(p,"wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate); w.writeframes(np.asarray(data,dtype=np.int16).tobytes())
        return p
