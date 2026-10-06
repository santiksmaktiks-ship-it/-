from .microphone import Microphone
class Recorder:
    def __init__(self, microphone): self.microphone=microphone
    def capture(self, seconds=6): return self.microphone.record(seconds)
