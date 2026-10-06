import sounddevice as sd
class AudioDevices:
    def inputs(self): return [(i,d["name"]) for i,d in enumerate(sd.query_devices()) if d["max_input_channels"]>0]
    def outputs(self): return [(i,d["name"]) for i,d in enumerate(sd.query_devices()) if d["max_output_channels"]>0]
