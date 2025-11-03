# Mana Telugu Panchangam 2025

A simple web calendar showing Telugu Panchangam details for 2025. Use the drop-down on the main page to select your city and click a date to fetch that day’s Panchangam information from the public API.

Each month also has its own page under the `*.html` files.

The app fetches details from `https://telugu-calendar-live.onrender.com/panchang`.
If that service is unavailable, it falls back to a small bundled `panchangam_2025.json` file for demo data and shows an error when neither source is reachable.

## Quick start (no coding required)

Follow these steps exactly in order, even if you have never used GitHub before:

1. **Open the project page on GitHub.** Launch your web browser (Chrome, Edge, Safari, etc.) and go to the repository URL your developer shared with you. You should see a list of files and folders.
2. **Download everything in one click.** Look above the file list, near the upper-right corner of the page, for the green **Code** button. Click it, choose **Download ZIP**, and the browser will save a file named similar to `telugu-calendar-2025-main.zip`.
3. **Unzip the download.** Open your Downloads folder, right-click the ZIP file, and choose **Extract** (Windows) or double-click it (macOS). A new folder with the same name will appear once extraction is finished.
4. **Open the extracted folder.** Inside you will find the project files plus three “start server” helpers.
5. **Start the calendar with the script that matches your computer:**
   - On **Windows**, double-click `start-server.bat`. If Windows warns you, choose **More info** → **Run anyway**.
   - On **macOS**, double-click `start-server.command`. You may need to approve it in **System Settings → Privacy & Security** the first time.
   - On **Linux**, right-click in the folder, choose **Open in Terminal**, and run `./start-server.sh`.
6. **Leave the terminal window open.** A black window (Command Prompt or Terminal) will appear showing lines like “Serving HTTP on…”. Do not close it.
7. **Open the calendar in your browser.** Type <http://localhost:8000> into the browser’s address bar and press **Enter**. The Telugu calendar home page will load.
8. **Stop when you are done.** Close the browser tab. Go back to the terminal window and press **Ctrl + C** (or close the window) to shut down the server.

> **Note:** These start scripts use Python, which is already installed on macOS and most Linux computers. On Windows you may need to install Python from [python.org](https://www.python.org/downloads/) first. During the installer, make sure you tick **Add python.exe to PATH**.

If you prefer to start the server manually (for example, on another port), you can run `python3 -m http.server 8000` from the project folder and open <http://localhost:8000> in your browser. Any static file server (such as VS Code’s Live Server extension or `npx serve`) will also work.
