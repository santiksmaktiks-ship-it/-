@echo off
python -m pip install -r requirements.txt
python -m PyInstaller --noconfirm --clean --onefile --windowed --name JarvisAI jarvis.py
echo.
echo EXE: dist\JarvisAI.exe
pause
