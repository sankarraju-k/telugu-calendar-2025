# Mana Telugu Panchangam 2025

A simple web calendar showing Telugu Panchangam details for 2025. Use the drop-down on the main page to select your city and click a date to fetch that day’s Panchangam information from the public API.

Each month also has its own page under the `*.html` files.

The app fetches details from `https://telugu-calendar-live.onrender.com/panchang`.
If that service is unavailable, it falls back to a small bundled `panchangam_2025.json` file for demo data and shows an error when neither source is reachable.

## Quick start (no coding required)

1. Open this project on GitHub in your web browser. In the upper-right corner of the file list you will see a green **Code** button—click it and choose **Download ZIP**.
2. Unzip the folder somewhere easy to find (for example, your Desktop).
3. Open the unzipped folder and double-click the start file for your computer:
   - **Windows:** `start-server.bat`
   - **macOS:** `start-server.command`
   - **Linux:** run `start-server.sh`
4. A terminal window will open and show messages from a small web server. Leave it running.
5. Open your web browser and go to <http://localhost:8000>. The Telugu calendar will load automatically.
6. When you are finished, close the browser tab and return to the terminal window to press **Ctrl + C** (or simply close the window) to stop the server.

> **Note:** These start scripts use Python, which is already installed on macOS and most Linux computers. On Windows you may need to install Python from [python.org](https://www.python.org/downloads/) first. During the installer, make sure you tick **Add python.exe to PATH**.

If you prefer to start the server manually (for example, on another port), you can run `python3 -m http.server 8000` from the project folder and open <http://localhost:8000> in your browser. Any static file server (such as VS Code’s Live Server extension or `npx serve`) will also work.
