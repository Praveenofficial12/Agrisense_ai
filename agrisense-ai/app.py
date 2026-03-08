import subprocess
import os
import time
import sys
import webbrowser
import platform
import socket

def get_local_ip():
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def kill_port(port):
    """
    Kills any process running on the specified port (Windows only).
    """
    if platform.system() == "Windows":
        try:
            # Find PID using netstat
            output = subprocess.check_output(f'netstat -aon | findstr :{port}', shell=True).decode()
            for line in output.splitlines():
                if "LISTENING" in line:
                    pid = line.strip().split()[-1]
                    if pid != "0":
                        subprocess.run(f'taskkill /F /PID {pid}', shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
                        print(f"🧹 Cleared process {pid} on port {port}")
        except:
            pass

def main():
    print("🚀 Starting AgriSense AI Full Stack...")
    
    root_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(root_dir, "backend")
    frontend_dir = os.path.join(root_dir, "frontend")

    python_path = sys.executable
    local_ip = get_local_ip()

    # 0. Kill existing instances
    kill_port(8000)
    kill_port(3000)

    # 1. Start Backend (Detached/Background)
    print("📦 Starting Backend (FastAPI)...")
    backend_cmd = [python_path, "main.py"]
    
    # Flags for detached background processes on Windows
    flags = 0x08000000 | 0x00000008 if platform.system() == "Windows" else 0

    subprocess.Popen(
        backend_cmd, 
        cwd=backend_dir, 
        stdout=subprocess.DEVNULL, 
        stderr=subprocess.DEVNULL,
        creationflags=flags
    )

    # 2. Give the backend a moment
    time.sleep(3)

    # 3. Start Frontend (Detached/Background)
    print("🎨 Starting Frontend (Vite)...")
    npm_cmd = "npm.cmd" if platform.system() == "Windows" else "npm"
    subprocess.Popen(
        [npm_cmd, "run", "dev"], 
        cwd=frontend_dir, 
        stdout=subprocess.DEVNULL, 
        stderr=subprocess.DEVNULL,
        creationflags=flags,
        shell=(platform.system() == "Windows")
    )

    # 4. Success Message
    print(f"\n✅ AgriSense AI is running in the background!")
    print(f"➜ Local:   http://localhost:3000")
    print(f"➜ Network: http://{local_ip}:3000")
    print(f"➜ Backend: http://localhost:8000")

    # 5. Open Browser
    print("\n🌐 Opening Browser...")
    time.sleep(4) 
    webbrowser.open("http://localhost:3000")

    print("\nThis launcher will now exit. The servers will continue running silently.")
    time.sleep(2)
    sys.exit(0)

if __name__ == "__main__":
    main()
