import React, { useEffect, useState } from "react";

/**
 * HotelList component: Fetches and displays real hotel options using Booking.com (via RapidAPI)
 * for the given destination and dates.
 *
 * API Docs: https://rapidapi.com/apidojo/api/booking
 * You must provide your RapidAPI key via .env file in tripfusion_main_container root:
 * 
 *   REACT_APP_RAPIDAPI_KEY=your-rapidapi-key
 *
 * @param {Object} props
 * @param {string} props.destination - Destination city
 * @param {string} props.startDate - Trip start date (YYYY-MM-DD)
 * @param {string} props.endDate - Trip end date (YYYY-MM-DD)
 *
 * API KEY NOTE:
 *   - You must register at RapidAPI for a key, add it to tripfusion_main_container/.env as shown above.
 *   - DO NOT commit your API key to any public repo.
 */
// PUBLIC_INTERFACE
function HotelList({ destination, startDate, endDate }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helpers for date conversion and params
  function yyyymmdd(str) {
    // Expecting str to be YYYY-MM-DD
    if (!str) return "";
    return str.replace(/-/g, "");
  }

  // Map common city names to Booking.com dest_id and dest_type as an MVP
  // In production, you'd call Booking.com's autocomplete API or maintain a mapping
  const cityMap = {
    "paris": { dest_id: "-1456928", dest_type: "city", display: "Paris" },   // Paris, France dest_id per Booking API
    "tokyo": { dest_id: "-246227", dest_type: "city", display: "Tokyo" },
    "london": { dest_id: "-2601889", dest_type: "city", display: "London" }
    // Add more city mappings here as needed.
  };

  useEffect(() => {
    const fetchHotels = async () => {
      if (!destination || !startDate || !endDate) {
        setHotels([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // API key should be set in process.env
        const RAPID_API_KEY = process.env.REACT_APP_RAPIDAPI_KEY;
        if (!RAPID_API_KEY) {
          throw new Error(
            "Booking.com API key not set. Add REACT_APP_RAPIDAPI_KEY to your .env file."
          );
        }

        // Map destination city input to Booking.com location IDs (for production: do proper search)
        const cityKey = (destination || "").toLowerCase().trim();
        const cityInfo = cityMap[cityKey];

        if (!cityInfo) {
          setHotels([]);
          setError("Sorry, live hotel search not supported for this city. Try Paris, Tokyo, or London.");
          setLoading(false);
          return;
        }

        // Build API endpoint
        // Docs: /properties/list endpoint
        // Use default: 1 room, 2 adults, 0 children for MVP. Booking.com expects checkin/checkout as YYYY-MM-DD
        const url = `https://booking-com.p.rapidapi.com/v1/hotels/search?dest_id=${encodeURIComponent(
          cityInfo.dest_id
        )}&dest_type=${encodeURIComponent(cityInfo.dest_type)}&checkin_date=${startDate}&checkout_date=${endDate}&adults_number=2&room_number=1&locale=en-us&order_by=popularity&units=metric&filter_by_currency=USD`;

        const options = {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": RAPID_API_KEY,
            "X-RapidAPI-Host": "booking-com.p.rapidapi.com"
          }
        };

        const response = await fetch(url, options);

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Results may be in data.result (Array)
        if (!Array.isArray(data.result) || data.result.length === 0) {
          setHotels([]);
          setError("No hotels found for your search.");
        } else {
          // Map API results to required display object
          const hotelsParsed = data.result.map(hotel => ({
            id: hotel.hotel_id,
            name: hotel.hotel_name,
            location: hotel.city || hotel.address,
            rating: hotel.review_score || 0,
            price:
              hotel.price_breakdown && hotel.price_breakdown.gross_price
                ? `$${Number(hotel.price_breakdown.gross_price).toFixed(0)}${hotel.price_breakdown.currency || ""}/night`
                : hotel.min_total_price
                  ? `$${Number(hotel.min_total_price).toFixed(0)}/night`
                  : "–",
            reviewCount: hotel.review_nr || 0,
            image:
              (hotel.max_1440_photo_url || hotel.main_photo_url) ||
              "https://source.unsplash.com/random/400x320/?hotel",
            url: hotel.url
          }));

          setHotels(hotelsParsed);
        }
      } catch (err) {
        setHotels([]);
        setError(
          err.message ||
            "An error occurred while fetching hotels. Please check your network and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, startDate, endDate]);

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
      {loading && (
        <div style={{ color: "var(--secondary)", marginBottom: 8 }}>
          Loading hotels…
        </div>
      )}
      {error && (
        <div style={{ color: "#e57373", marginBottom: 10 }}>
          <span role="img" aria-label="error">⚠️</span> {error}
        </div>
      )}
      {!loading && !error && hotels.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {hotels.map((hotel) => (
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
                loading="lazy"
              />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: "var(--secondary)", fontSize: "1.08em" }}>
                  <a
                    href={hotel.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "var(--secondary)",
                      textDecoration: "none"
                    }}
                    title={"View on Booking.com"}
                  >
                    {hotel.name}
                  </a>
                </div>
                <div style={{ color: "#666", fontSize: "0.99em", marginBottom: 4 }}>
                  {hotel.location}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.97em", color: "#555" }}>
                  <span style={{ color: "#FFC107", fontWeight: 700 }}>
                    {"★".repeat(Math.floor(hotel.rating))}
                    <span style={{ opacity: 0.6 }}>
                      {hotel.rating % 1 >= 0.5 ? "½" : ""}
                    </span>
                  </span>
                  <span style={{ color: "#4373b3" }}>
                    {hotel.rating ? Number(hotel.rating).toFixed(1) : "–"}
                  </span>
                  <span>({hotel.reviewCount} reviews)</span>
                </div>
                <div style={{ fontWeight: 600, color: "var(--primary)", fontSize: "1.07em", marginTop: 3 }}>
                  {hotel.price}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && hotels.length === 0 && (
        <div style={{ marginTop: 16, fontSize: "0.97em", color: "#999" }}>
          <span role="img" aria-label="info">ℹ️</span>{" "}
          {destination && startDate && endDate
            ? "No hotels found for your selection."
            : "Enter a destination and dates to find hotels."}
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: "0.97em", color: "#888" }}>
        <span role="img" aria-label="key">🔑</span> To enable live hotel results, set <span style={{fontFamily:"monospace"}}>REACT_APP_RAPIDAPI_KEY</span> in your <span style={{fontFamily:"monospace"}}>.env</span> file. Supported cities: Paris, Tokyo, London.<br/>
        <a href="https://rapidapi.com/apidojo/api/booking" target="_blank" rel="noopener noreferrer" style={{ color: "var(--primary)", textDecoration: "underline", fontSize: "0.94em" }}>
          Booking.com API info
        </a>
      </div>
    </div>
  );
}

export default HotelList;
