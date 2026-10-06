from pathlib import Path
def app_data_dir():
    import os
    return Path(os.getenv("APPDATA",Path.home())) / "JarvisAssistant"
