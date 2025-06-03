import React from "react";

// PUBLIC_INTERFACE
/**
 * FlightList component: Displays a list of available flights for the given destination and dates.
 * Meant to be API-integrated (Skyscanner), currently uses mock data.
 *
 * @param {Object} props
 * @param {string} props.destination - Destination city/airport code.
 * @param {string} props.startDate - Trip start date (YYYY-MM-DD).
 * @param {string} props.endDate - Trip end date (YYYY-MM-DD).
 */
function FlightList({ destination, startDate, endDate }) {
  // Mock flight results (replace with Skyscanner API data)
  const mockFlights = [
    {
      id: "F001",
      airline: "Delta Airlines",
      flightNumber: "DL 104",
      depart: "10:40 AM",
      arrive: "4:35 PM",
      duration: "6h 55m",
      price: "$520",
      from: "JFK",
      to: destination || "CDG",
    },
    {
      id: "F002",
      airline: "Air France",
      flightNumber: "AF 023",
      depart: "2:25 PM",
      arrive: "8:20 PM",
      duration: "6h 55m",
      price: "$498",
      from: "JFK",
      to: destination || "CDG",
    },
  ];

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
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {mockFlights.map((flight) => (
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
      <div style={{ marginTop: 16, fontSize: "0.97em", color: "#999" }}>
        <span role="img" aria-label="info">ℹ️</span> Results are for demo – Skyscanner integration coming soon!
      </div>
    </div>
  );
}

export default FlightList;
