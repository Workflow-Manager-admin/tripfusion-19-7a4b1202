import React, { useEffect, useState } from "react";

// PUBLIC_INTERFACE
/**
 * FlightList component: Fetches and displays real flight options using Skyscanner (via RapidAPI)
 * for the given destination and dates.
 *
 * @param {Object} props
 * @param {string} props.destination - Destination city/airport code.
 * @param {string} props.startDate - Trip start date (YYYY-MM-DD).
 * @param {string} props.endDate - Trip end date (YYYY-MM-DD).
 *
 * Note: You need to create a .env file in the root of 'tripfusion_main_container'
 * and add your RapidAPI key as:
 *   REACT_APP_RAPIDAPI_KEY=your-api-key-here
 * See Skyscanner on RapidAPI: https://rapidapi.com/skyscanner/api/skyscanner44
 */
function FlightList({ destination, startDate, endDate }) {
  // State for fetched flights, loading, and error
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch live flights when destination or dates change
  useEffect(() => {
    // Do not fetch if required fields are missing
    if (!destination || !startDate || !endDate) return;

    // Skyscanner API expects IATA codes. Here, we'll accept city name for demo, but in a full production app,
    // a mapping step or autocomplete for city->airport is recommended.
    setLoading(true);
    setError(null);

    const fetchFlights = async () => {
      try {
        // Get API Key from environment
        const RAPID_API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
        if (!RAPID_API_KEY) {
          throw new Error(
            "Skyscanner API key not set. Add REACT_APP_RAPIDAPI_KEY to your .env file."
          );
        }

        // Example API: Skyscanner - Browse Quotes
        // Docs: https://rapidapi.com/skyscanner/api/skyscanner44
        // Required params: origin, destination, outboundPartialDate, inboundPartialDate, currency, locale.
        // This DEMO uses 'JFK' as a fixed origin for example; production should use user's real location.
        const origin = "JFK";
        const currency = "USD";
        const locale = "en-US";
        // WARNING: Skyscanner API requires airport/city IATA code for 'destination'
        // Minimal fallback for demo (uses 'CDG' for Paris etc.), but you should use autocomplete or a mapping table in a full app!
        let destCode = destination;
        if (destination.toLowerCase() === "paris") destCode = "CDG";
        if (destination.toLowerCase() === "tokyo") destCode = "HND";
        // If not an obvious code, just use the input

        // Compose endpoint
        const url = `https://skyscanner44.p.rapidapi.com/search?adults=1&origin=${origin}&destination=${destCode}&departureDate=${startDate}&returnDate=${endDate}&currency=${currency}`;

        const response = await fetch(url, {
          headers: {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": "skyscanner44.p.rapidapi.com",
          },
        });

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const data = await response.json();

        // Parse flights - response structure: data.itineraries or data.flights etc.
        // Demo assumption: data.itineraries or data.data (API may change, refer to actual docs)
        // We'll support both demo structure and basic fallback.

        const results = [];
        const itineraries = data.itineraries || data.data || [];
        if (Array.isArray(itineraries)) {
          // Each may have: legs (segments), price, airline, etc.
          for (const flight of itineraries) {
            results.push({
              id: flight.id || flight.itineraryId || `${flight.departure}-${flight.arrival}-${flight.price?.raw}`,
              airline: flight.legs?.[0]?.carriers?.[0]?.name || flight.legs?.[0]?.airline || "N/A",
              flightNumber: flight.legs?.[0]?.flightNumber || flight.legs?.[0]?.carrierCode || "N/A",
              depart: flight.legs?.[0]?.departure || flight.departureTime || "",
              arrive: flight.legs?.[0]?.arrival || flight.arrivalTime || "",
              duration: flight.legs?.[0]?.duration || flight.duration || "",
              price: flight.price?.formatted || flight.price || "",
              from: origin,
              to: destCode,
            });
          }
        }
        // If nothing, error if no demo
        if (results.length === 0) {
          setError("No flights found for your search.");
        }
        setFlights(results);
      } catch (err) {
        setFlights([]);
        setError(err.message || "An error occurred fetching flights.");
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [destination, startDate, endDate]);

  // Render UI
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 8px 0 rgb(30 30 60 / 5%)",
        padding: "28px 20px",
        maxWidth: 500,
        margin: "0 auto",
        width: "100%",
        color: "var(--text-color)"
      }}
    >
      <div style={{ fontSize: "1.18rem", color: "var(--primary)", fontWeight: 600, marginBottom: 18 }}>
        ✈️ Flights{destination ? ` to ${destination}` : ""} {startDate ? `: ${startDate} → ${endDate}` : ""}
      </div>
      {loading && (
        <div style={{ color: "var(--secondary)", marginBottom: 8 }}>Loading flights…</div>
      )}
      {error && (
        <div style={{ color: "#e57373", marginBottom: 10 }}>
          <span role="img" aria-label="error">⚠️</span> {error}
        </div>
      )}
      {!loading && !error && flights.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {flights.map((flight) => (
            <li
              key={flight.id}
              style={{
                border: "1.5px solid var(--border-color)",
                borderRadius: 8,
                marginBottom: 17,
                padding: "20px 14px",
                display: "flex",
                flexDirection: "column",
                background: "#f8fafd"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
                <span style={{ color: "var(--secondary)", fontWeight: 600, marginRight: 10 }}>
                  {flight.airline}
                </span>
                <span style={{ color: "#555", fontWeight: 400, fontSize: "0.99em" }}>
                  {flight.flightNumber}
                </span>
              </div>
              <div style={{ display: "flex", gap: 14, fontSize: "1.03em", marginBottom: 7 }}>
                <span style={{ color: "var(--primary)" }}>{flight.from}</span>
                <span>→</span>
                <span style={{ color: "var(--primary)" }}>{flight.to}</span>
              </div>
              <div style={{ display: "flex", gap: 17, fontSize: "1em", color: "var(--text-secondary)", marginBottom: 5 }}>
                <span>Departs: {flight.depart}</span>
                <span>Arrives: {flight.arrive}</span>
                <span>Duration: {flight.duration}</span>
              </div>
              <div style={{ fontWeight: 600, color: "var(--accent)", fontSize: "1.08em", marginTop: 3 }}>
                {flight.price}
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && flights.length === 0 && (
        <div style={{ marginTop: 16, fontSize: "0.97em", color: "#999" }}>
          <span role="img" aria-label="info">ℹ️</span> Enter a destination and dates to find flights.
        </div>
      )}
    </div>
  );
}

export default FlightList;
