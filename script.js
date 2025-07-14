async function showDetails(day, month, year) {
  const { lat, lon, tz } = cities[selectedCity];
  const details = document.getElementById("details");
  details.innerHTML = "Loading…";
  try {
    const response = await fetch("https://telugu-calendar-backend.onrender.com/panchang", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        day: day,
        month: month,
        year: year,
        lat: lat,
        lon: lon,
        tzone: tz
      })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
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
    console.error("Fetch error:", err);
    details.innerHTML = "Error fetching Panchangam.";
  }
}
