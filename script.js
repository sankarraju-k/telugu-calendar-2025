async function showDetails(day, month, year) {
  const { lat, lon, tz } = cities[selectedCity];
  details.innerHTML = "Loading…";
  try {
    const res = await fetch("https://telugu-calendar-api-xyz.onrender.com/panchang", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ day, month, year, lat, lon, tzone: tz })
    });
    const data = await res.json();
    if (data.tithi) {
      details.innerHTML = `
        <h3>${selectedCity} — ${day}-${month}-${year}</h3>
        <p><strong>Tithi:</strong> ${data.tithi}</p>
        <p><strong>Nakshatra:</strong> ${data.nakshatra}</p>
        <p><strong>Rahu Kalam:</strong> ${data.rahu_kalam}</p>`;
    } else {
      details.innerHTML = "No Panchangam data found.";
    }
  } catch (err) {
    console.error(err);
    details.innerHTML = "Error fetching Panchangam.";
  }
}
