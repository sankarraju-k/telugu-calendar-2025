
const cities = {
  "Hyderabad": { lat: 17.385, lon: 78.4867, tz: 5.5 },
  "Chennai": { lat: 13.0827, lon: 80.2707, tz: 5.5 },
  "Bangalore": { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  "Kerala": { lat: 9.9312, lon: 76.2673, tz: 5.5 },
  "London": { lat: 51.5074, lon: -0.1278, tz: 0 },
  "Toronto": { lat: 43.6532, lon: -79.3832, tz: -5 },
  "California": { lat: 34.0522, lon: -118.2437, tz: -8 }
};

let selectedCity = "Hyderabad";

window.onload = () => {
  const citySelect = document.getElementById("citySelect");
  for (const city in cities) {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  }
  citySelect.value = selectedCity;
  citySelect.addEventListener("change", () => {
    selectedCity = citySelect.value;
    loadCalendar(2025);
  });
  loadCalendar(2025);
};

function loadCalendar(year) {
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  for (let m = 0; m < 12; m++) {
    const monthDiv = document.createElement("div");
    monthDiv.innerHTML = `<h2>${new Date(year, m).toLocaleString('default', { month: 'long' })}</h2>`;
    for (let d = 1; d <= 31; d++) {
      const date = new Date(year, m, d);
      if (date.getMonth() !== m) break;
      const btn = document.createElement("button");
      btn.textContent = d;
      btn.onclick = () => showDetails(d, m + 1, year);
      monthDiv.appendChild(btn);
    }
    calendar.appendChild(monthDiv);
  }
}

const API_URL = "https://telugu-calendar-live.onrender.com/panchang";
const LOCAL_DATA_URL = "panchangam_2025.json";

function renderPanchangam(data, day, month, year) {
  const details = document.getElementById("details");
  const nakshatra = data.nakshatra || data.nakshatram || "";
  const rahu = data.rahu_kalam || data.rahukalam || "";

  details.innerHTML = `
    <h3>${selectedCity} — ${day}-${month}-${year}</h3>
    <p><strong>Tithi:</strong> ${data.tithi || ""}</p>
    <p><strong>Nakshatra:</strong> ${nakshatra}</p>
    ${rahu ? `<p><strong>Rahu Kalam:</strong> ${rahu}</p>` : ""}`;
}

async function showDetails(day, month, year) {
  const { lat, lon, tz } = cities[selectedCity];
  const details = document.getElementById("details");
  details.innerHTML = "Loading…";
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ day, month, year, lat, lon, tzone: tz })
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const data = await response.json();

    if (data.tithi) {
      renderPanchangam(data, day, month, year);
      return;
    }
    throw new Error("No data");
  } catch (err) {
    console.error("API fetch failed", err);
    try {
      const res = await fetch(LOCAL_DATA_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const local = await res.json();
      const key = `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
      if (local[key]) {
        renderPanchangam(local[key], day, month, year);
      } else {
        details.innerHTML = "No Panchangam data found.";
      }
    } catch (e) {
      console.error("Local data load failed", e);
      details.innerHTML = "Error fetching Panchangam.";
    }
  }
}
