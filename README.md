Cancer Awareness & Support

What this is
- A simple static landing page (HTML/CSS/JS) demonstrating a Cancer Awareness & Support page.
- Includes a contact form (client-side only) and a "Daily Quote" section that fetches real-time quotes from the public Quotable API.

Files
- `index.html` — landing page with banner, mission text, contact form, and quote section.
- `styles.css` — responsive styling.
- `script.js` — client-side behavior for form and quotes.

How to run locally

1. First, make sure you have Python installed on your computer. You can check by opening cmd.exe and typing:
```cmd
python --version
```
If you don't see a version number, download Python from https://python.org

2. Open cmd.exe and navigate to the project folder:
```cmd
cd /d "C:\Users\Dharmik\Downloads\TEST"
```

3. Start the Python HTTP server:
```cmd
python -m http.server 8000
```
You should see a message saying "Serving HTTP on :: port 8000"

4. Open your web browser and visit:
   http://localhost:8000

5. To stop the server when you're done:
   Press Ctrl+C in the cmd window

Notes
- Contact form doesn't send data to a server — it's a front-end demo only.
- Quotes come from https://api.quotable.io and update every 15 seconds; if the API is unreachable the app will show an error message in the quote box.