const API_URL = "https://telugu-calendar-live.onrender.com/panchang";
const LOCAL_DATA_FILES = {
  2025: "panchangam_2025.json"
};
const DEFAULT_YEAR = 2025;
const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

const cities = {
  Hyderabad: { lat: 17.385, lon: 78.4867, tz: 5.5 },
  Chennai: { lat: 13.0827, lon: 80.2707, tz: 5.5 },
  Bangalore: { lat: 12.9716, lon: 77.5946, tz: 5.5 },
  Visakhapatnam: { lat: 17.6868, lon: 83.2185, tz: 5.5 },
  Vijayawada: { lat: 16.5062, lon: 80.648, tz: 5.5 },
  Kerala: { lat: 9.9312, lon: 76.2673, tz: 5.5 },
  London: { lat: 51.5074, lon: -0.1278, tz: 0 },
  Toronto: { lat: 43.6532, lon: -79.3832, tz: -5 },
  California: { lat: 34.0522, lon: -118.2437, tz: -8 }
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const festivalData = {
  "01-01-2025": ["English New Year"],
  "14-01-2025": ["Bhogi"],
  "15-01-2025": ["Makara Sankranti"],
  "16-01-2025": ["Kanuma"],
  "26-01-2025": ["Republic Day"],
  "13-02-2025": ["Ratha Saptami"],
  "28-02-2025": ["Maha Shivaratri"],
  "17-03-2025": ["Ugadi"],
  "25-03-2025": ["Sri Rama Navami"],
  "12-04-2025": ["Hanuman Jayanti"],
  "08-05-2025": ["Akshaya Tritiya"],
  "05-06-2025": ["Narasimha Jayanti"],
  "15-08-2025": ["Independence Day"],
  "16-09-2025": ["Vinayaka Chavithi"],
  "02-10-2025": ["Gandhi Jayanti"],
  "21-10-2025": ["Mahalaya Amavasya"],
  "30-10-2025": ["Diwali"],
  "31-10-2025": ["Balipadyami"],
  "20-11-2025": ["Kartika Purnima"],
  "25-12-2025": ["Subh Christmas"],
  "31-12-2025": ["Vaikunta Ekadasi"]
};

let selectedCity = "Hyderabad";
let currentYear = DEFAULT_YEAR;
let currentMonth = 0;
const localPanchangamCache = {};
const localDataRequests = {};

const today = new Date();
if (today.getFullYear() === DEFAULT_YEAR) {
  currentMonth = today.getMonth();
}

const citySelectEl = document.getElementById("citySelect");
const calendarEl = document.getElementById("calendar");
const detailsEl = document.getElementById("details");
const festivalListEl = document.getElementById("festivalList");
const monthLabelEl = document.getElementById("monthLabel");
const timezoneLabelEl = document.getElementById("timezoneLabel");
const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const prevYearBtn = document.getElementById("prevYear");
const nextYearBtn = document.getElementById("nextYear");
const yearLabelEl = document.getElementById("yearLabel");
const todayBtn = document.getElementById("todayBtn");

function init() {
  populateCities();
  attachEventHandlers();
  renderCalendar(currentYear, currentMonth);
  ensureLocalData(DEFAULT_YEAR);
  if (currentYear !== DEFAULT_YEAR) {
    ensureLocalData(currentYear);
  }
  if (today.getFullYear() === currentYear) {
    showDetails(today.getDate(), today.getMonth() + 1, currentYear);
  }
}

function populateCities() {
  for (const city of Object.keys(cities)) {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelectEl.appendChild(option);
  }
  citySelectEl.value = selectedCity;
  updateTimezoneLabel();
}

function attachEventHandlers() {
  citySelectEl.addEventListener("change", () => {
    selectedCity = citySelectEl.value;
    updateTimezoneLabel();
    renderCalendar(currentYear, currentMonth);
  });

  prevMonthBtn.addEventListener("click", () => changeMonth(-1));
  nextMonthBtn.addEventListener("click", () => changeMonth(1));
  prevYearBtn.addEventListener("click", () => changeYear(-1));
  nextYearBtn.addEventListener("click", () => changeYear(1));
  todayBtn.addEventListener("click", () => {
    currentYear = clampYear(today.getFullYear());
    currentMonth = today.getMonth();
    renderCalendar(currentYear, currentMonth);
    ensureLocalData(currentYear);
    showDetails(today.getDate(), today.getMonth() + 1, currentYear);
  });
}

function changeMonth(delta) {
  let newMonth = currentMonth + delta;
  let newYear = currentYear;

  while (newMonth < 0) {
    newMonth += 12;
    newYear -= 1;
  }

  while (newMonth > 11) {
    newMonth -= 12;
    newYear += 1;
  }

  if (newYear < MIN_YEAR || newYear > MAX_YEAR) {
    return;
  }

  currentYear = newYear;
  currentMonth = newMonth;
  renderCalendar(currentYear, currentMonth);
  ensureLocalData(currentYear);
}

function changeYear(delta) {
  const desiredYear = currentYear + delta;
  const clampedYear = clampYear(desiredYear);

  if (clampedYear === currentYear) {
    return;
  }

  currentYear = clampedYear;
  renderCalendar(currentYear, currentMonth);
  ensureLocalData(currentYear);
}

function ensureLocalData(year) {
  const dataUrl = LOCAL_DATA_FILES[year];
  if (!dataUrl || localPanchangamCache[year]) {
    return Promise.resolve();
  }

  if (localDataRequests[year]) {
    return localDataRequests[year];
  }

  const request = fetch(dataUrl)
    .then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText);
      }
      return res.json();
    })
    .then((json) => {
      localPanchangamCache[year] = json;
      if (currentYear === year) {
        renderCalendar(currentYear, currentMonth);
      }
    })
    .catch((err) => {
      console.warn(`Failed to load local Panchangam cache for ${year}`, err);
    })
    .finally(() => {
      delete localDataRequests[year];
    });

  localDataRequests[year] = request;
  return request;
}

function renderCalendar(year, month) {
  calendarEl.innerHTML = "";
  monthLabelEl.textContent = MONTHS[month];
  updateYearLabel();
  updateTimezoneLabel();

  WEEKDAYS.forEach((day) => {
    const header = document.createElement("div");
    header.className = "calendar__weekday";
    header.textContent = day;
    calendarEl.appendChild(header);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const yearCache = localPanchangamCache[year] || {};

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day day--empty";
    empty.setAttribute("aria-hidden", "true");
    calendarEl.appendChild(empty);
  }

  const festivalHighlights = [];
  for (let date = 1; date <= daysInMonth; date++) {
    const key = formatKey(date, month + 1, year);
    const local = yearCache[key];
    const festivals = festivalData[key];

    const cell = document.createElement("button");
    cell.className = "day";
    cell.type = "button";
    cell.setAttribute("data-date", key);

    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === date;
    if (isToday) {
      cell.classList.add("day--today");
    }
    if (festivals) {
      cell.classList.add("day--festival");
      festivals.forEach((fest) => {
        festivalHighlights.push({ day: date, name: fest });
      });
    }

    const meta = [];
    if (local?.tithi) {
      meta.push(local.tithi);
    }
    if (local?.nakshatra || local?.nakshatram) {
      meta.push(local.nakshatra || local.nakshatram);
    }

    cell.innerHTML = `
      <span class="day__date">${date}</span>
      <span class="day__meta">${meta.join(" · ")}</span>
      ${festivals ? `<span class="day__festival">${festivals[0]}</span>` : ""}
    `;

    cell.addEventListener("click", () => showDetails(date, month + 1, year));
    calendarEl.appendChild(cell);
  }

  updateFestivalHighlights(festivalHighlights);
}

function updateFestivalHighlights(highlights) {
  festivalListEl.innerHTML = "";
  if (!highlights.length) {
    const li = document.createElement("li");
    li.textContent = "No major festivals recorded for this month.";
    festivalListEl.appendChild(li);
    return;
  }
  highlights
    .sort((a, b) => a.day - b.day)
    .forEach((fest) => {
      const li = document.createElement("li");
      li.textContent = `${fest.day} ${MONTHS[currentMonth].slice(0, 3)} — ${fest.name}`;
      festivalListEl.appendChild(li);
    });
}

function formatKey(day, month, year) {
  return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
}

function updateTimezoneLabel() {
  const { tz } = cities[selectedCity];
  timezoneLabelEl.textContent = `UTC ${formatTimezoneOffset(tz)}`;
}

function updateYearLabel() {
  yearLabelEl.textContent = currentYear;
  prevYearBtn.disabled = currentYear <= MIN_YEAR;
  nextYearBtn.disabled = currentYear >= MAX_YEAR;
}

function formatTimezoneOffset(offset) {
  const sign = offset >= 0 ? "+" : "-";
  const absolute = Math.abs(offset);
  const hours = Math.floor(absolute);
  const minutes = Math.round((absolute - hours) * 60);
  return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function renderPanchangam(data, day, month, year) {
  const key = formatKey(day, month, year);
  const festivals = festivalData[key];
  const title = `${MONTHS[month - 1]} ${day}, ${year}`;

  const fields = [
    { label: "Tithi", value: data.tithi },
    { label: "Nakshatram", value: data.nakshatra || data.nakshatram },
    { label: "Yoga", value: data.yoga },
    { label: "Karana", value: data.karana },
    { label: "Sunrise", value: data.sunrise },
    { label: "Sunset", value: data.sunset },
    { label: "Rahu Kalam", value: data.rahu_kalam || data.rahukalam },
    { label: "Yamagandam", value: data.yamagandam },
    { label: "Durmuhurtham", value: data.durmuhurtham || data.durmuhurtam }
  ].filter((item) => Boolean(item.value));

  const fieldMarkup = fields
    .map(
      (field) => `
        <dt>${field.label}</dt>
        <dd>${field.value}</dd>
      `
    )
    .join("");
  const fallbackMarkup = "<dt>Info</dt><dd>No Panchangam data available.</dd>";

  detailsEl.innerHTML = `
    <h3>${selectedCity}</h3>
    <h4>${title}</h4>
    ${festivals ? `<p class="day__festival">${festivals.join(", ")}</p>` : ""}
    <dl>${fieldMarkup || fallbackMarkup}</dl>
  `;
}

async function showDetails(day, month, year) {
  const { lat, lon, tz } = cities[selectedCity];
  detailsEl.innerHTML = `<h3>${selectedCity}</h3><p>Loading Panchangam…</p>`;

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
    if (data && data.tithi) {
      renderPanchangam(data, day, month, year);
      return;
    }
    throw new Error("No Panchangam data returned from API");
  } catch (err) {
    console.warn("API fetch failed", err);
    fallbackToLocalData(day, month, year);
  }
}

function fallbackToLocalData(day, month, year) {
  const key = formatKey(day, month, year);
  ensureLocalData(year).finally(() => {
    const cache = localPanchangamCache[year];
    if (cache && cache[key]) {
      renderPanchangam(cache[key], day, month, year);
    } else {
      detailsEl.innerHTML = `
        <h3>${selectedCity}</h3>
        <h4>${MONTHS[month - 1]} ${day}, ${year}</h4>
        <p>No Panchangam data found for this date.</p>
      `;
    }
  });
}

document.addEventListener("DOMContentLoaded", init);

function clampYear(year) {
  return Math.min(Math.max(year, MIN_YEAR), MAX_YEAR);
}
