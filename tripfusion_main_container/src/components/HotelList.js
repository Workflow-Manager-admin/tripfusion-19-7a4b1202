import React from "react";

// PUBLIC_INTERFACE
/**
 * HotelList component: Displays a list of hotels for the given destination and dates.
 * Meant to be API-integrated (Booking.com), currently uses mock data.
 *
 * @param {Object} props
 * @param {string} props.destination - Destination city.
 * @param {string} props.startDate - Trip start date (YYYY-MM-DD).
 * @param {string} props.endDate - Trip end date (YYYY-MM-DD).
 */
function HotelList({ destination, startDate, endDate }) {
  // Mock hotel data (replace with Booking.com API data)
  const mockHotels = [
    {
      id: "H001",
      name: "Grand Destination Hotel",
      location: destination || "Paris",
      rating: 4.5,
      price: "$182/night",
      reviewCount: 215,
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=facearea&w=400&q=80",
    },
    {
      id: "H002",
      name: "Central City Inn",
      location: destination || "Paris",
      rating: 4.2,
      price: "$139/night",
      reviewCount: 149,
      image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=facearea&w=400&q=80",
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
        🏨 Hotels{destination ? ` in ${destination}` : ""} {startDate ? `: ${startDate} → ${endDate}` : ""}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {mockHotels.map((hotel) => (
          <li key={hotel.id}
            style={{
              border: "1.5px solid var(--border-color)",
              borderRadius: 8,
              marginBottom: 17,
              padding: "18px 12px",
              display: "flex",
              gap: 20,
              background: "#f8fafd"
            }}
          >
            <img
              src={hotel.image}
              alt={hotel.name}
              style={{
                width: 94,
                height: 80,
                borderRadius: 8,
                objectFit: "cover",
                boxShadow: "0 1px 6px #1976d226"
              }}
            />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
              <div style={{ fontWeight: 600, color: "var(--secondary)", fontSize: "1.08em" }}>{hotel.name}</div>
              <div style={{ color: "#666", fontSize: "0.99em", marginBottom: 4 }}>{hotel.location}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.97em", color: "#555" }}>
                <span style={{ color: "#FFC107", fontWeight: 700 }}>
                  {"★".repeat(Math.floor(hotel.rating))}<span style={{ opacity: 0.6 }}>{hotel.rating % 1 ? "½" : ""}</span>
                </span>
                <span style={{ color: "#4373b3" }}>{hotel.rating.toFixed(1)}</span>
                <span>({hotel.reviewCount} reviews)</span>
              </div>
              <div style={{ fontWeight: 600, color: "var(--primary)", fontSize: "1.07em", marginTop: 3 }}>
                {hotel.price}
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 16, fontSize: "0.97em", color: "#999" }}>
        <span role="img" aria-label="info">ℹ️</span> Results are for demo – Booking.com integration coming soon!
      </div>
    </div>
  );
}

export default HotelList;
