# Mana Telugu Panchangam 2025

A simple web calendar showing Telugu Panchangam details for 2025. Use the drop-down on the main page to select your city and click a date to fetch that day’s Panchangam information from the public API.

Each month also has its own page under the `*.html` files.

The app fetches details from `https://telugu-calendar-live.onrender.com/panchang`.  
If that service is unavailable, it falls back to a small bundled `panchangam_2025.json` file for demo data and shows an error when neither source is reachable.
