## Cancer Awareness & Support

What this is
- A simple static landing page (HTML/CSS/JS) demonstrating a Cancer Awareness & Support page.
- Modernized UI/UX with a two-column responsive layout, mission highlights, newsletter, FAQ, Daily Quote widget, and a contact form.
demo: "https://cancerawarenessandsupport.netlify.app

Files
- `index.html` — landing page with banner, mission highlights, FAQ, contact form, newsletter, and quote section.
- `styles.css` — responsive styling and theme variables.
- `script.js` — client-side behavior for form validation, quotes, newsletter handling, FAQ interactions, and small UI helpers (toast, smooth-scroll).

Key features 
- Newsletter: now displayed as a white card (`.newsletter`) with a coral CTA button for strong contrast.
- Quote system: attempts multiple public APIs (`quotable.io`, `zenquotes.io`, `goprogram.ai`) with a local fallback. Quotes auto-rotate every ~15s; users can pause/resume, request a new quote with the "New Quote" button or press the `n` key.
- FAQ: full-width, single-column presentation with an **Accordion** toggle (`#faqAccordionToggle`) — when enabled, opening one FAQ closes others. The toggle preference is saved to `localStorage`.
- Contact form: client-side validation (name, email, message), character counter (500 char limit), visual error states, and a toast confirmation on success. Note: form submissions are not sent to a backend by default.
- Accessibility: visible focus outlines, keyboard-friendly controls, and reduced visual noise for assistive tech.

How to run locally

1. Make sure you have Python installed. Verify with:
```cmd
python --version
```

2. Open `cmd.exe` and navigate to the project folder (example path for this workspace):
```cmd
cd /d "C:\Users\Dharmik\Cancer Awareness & Support"
```

3. Start the local static server:
```cmd
python -m http.server 8000
```
You should see a message like "Serving HTTP on :: port 8000"

4. Open your browser and visit:

   http://localhost:8000

5. To stop the server: press Ctrl+C in the terminal.

Quick testing checklist
- Quotes: wait ~15s for auto-rotate, or press the `n` key / click "New Quote" to fetch immediately. If APIs fail the app uses local fallbacks.
- Newsletter: submit an email in the newsletter card to see client-side validation and a toast confirmation.
- FAQ: toggle the Accordion switch in the FAQ header to enable/disable automatic closing of other items. The setting persists between visits.
- Contact: try submitting without required fields to see validation errors; submit valid input to see the toast success message and form reset.

Notes & limitations
- This is a front-end demo. The contact and newsletter forms do not post to a real server — integrate a backend or form provider (e.g., Netlify Forms, EmailJS) if you want real submissions.
- The quote fetcher accesses third-party APIs; depending on CORS and network connectivity some APIs may be unavailable. The script uses multiple endpoints and falls back to a local set of quotes.


License
- This project is provided as-is for demonstration and learning purposes.
