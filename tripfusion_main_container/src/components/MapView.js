import React, { useEffect, useRef } from "react";

// PUBLIC_INTERFACE
/**
 * MapView component displays a Google Map with Points of Interest (POIs) for selected destination and interests.
 * If Maps API is not enabled, shows demo POIs on a static scaffold.
 *
 * @param {Object} props
 * @param {string} props.destination - User-selected destination city or location.
 * @param {string[]} props.interests - User-selected topic filters (e.g., 'nature', 'food', etc.)
 * @param {string} [props.className] - Optional custom classname for layout.
 */
function MapView({ destination, interests, className = "" }) {
  const mapRef = useRef(null);
  const MAP_STYLE = [
    // Light style, minimal distractions, emphasize POIs by marker color
    {
      featureType: "all",
      elementType: "labels.text.fill",
      stylers: [{ color: "#212121" }]
    },
    {
      featureType: "all",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#fff" }]
    },
    {
      featureType: "landscape",
      elementType: "geometry",
      stylers: [{ color: "#f5f7fa" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#ededed" }]
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [{ color: "#e5f4ec" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#b1e3f4" }]
    }
  ];

  // Fake POI dataset for key cities, with category and coordinates for demo if Maps API is not ready
  const FAKE_POIS = {
    Paris: [
      {
        label: "Eiffel Tower",
        lat: 48.8584,
        lng: 2.2945,
        category: "Culture"
      },
      {
        label: "Louvre Museum",
        lat: 48.8606,
        lng: 2.3376,
        category: "Culture"
      },
      {
        label: "Montmartre",
        lat: 48.8867,
        lng: 2.3431,
        category: "History"
      },
      {
        label: "Le Marais Food Tour",
        lat: 48.8581,
        lng: 2.3629,
        category: "Food"
      },
      {
        label: "Bois de Boulogne",
        lat: 48.8638,
        lng: 2.2495,
        category: "Nature"
      }
    ],
    Tokyo: [
      {
        label: "Senso-ji Temple",
        lat: 35.7148,
        lng: 139.7967,
        category: "History"
      },
      {
        label: "Tsukiji Outer Market",
        lat: 35.6655,
        lng: 139.7708,
        category: "Food"
      },
      {
        label: "Shibuya Crossing",
        lat: 35.6595,
        lng: 139.7005,
        category: "Culture"
      },
      {
        label: "Ueno Park",
        lat: 35.7148,
        lng: 139.7743,
        category: "Nature"
      },
      {
        label: "Don Quijote Akihabara",
        lat: 35.6987,
        lng: 139.7731,
        category: "Shopping"
      }
    ]
    // Extend for more destinations
  };

  // Helper: Pick a subset of POIs by interests; if none, show all for city
  const getDemoPOIs = () => {
    const list = FAKE_POIS[destination] || [];
    if (!interests || !interests.length) return list;
    const filtered = list.filter(poi =>
      interests.includes(poi.category)
    );
    // If none match, fallback to all city POIs
    return filtered.length ? filtered : list;
  };

  // Default center coordinates per city for demo
  const DEMO_CITY_CENTER = {
    Paris: { lat: 48.8566, lng: 2.3522 },
    Tokyo: { lat: 35.6895, lng: 139.6917 }
    // ... other city centers
  };

  // --- Google Maps Integration (scaffold) ---
  // For now, skip live Google Maps JS API - add rendering scaffold, fallback to demo
  useEffect(() => {
    // [Ready for integration:]
    // If Maps JS API key is present:
    //  - Dynamically load Google Maps JS,
    //  - Initialize the map at destination coordinates,
    //  - Plot POIs as Markers (filtered by interests)
    // Otherwise, demo
    // Example code for the integration (commented-out stub):
    /*
    if (window.google && window.google.maps && destination) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: DEMO_CITY_CENTER[destination],
        zoom: 13,
        styles: MAP_STYLE,
        disableDefaultUI: true
      });
      getDemoPOIs().forEach(poi => {
        new window.google.maps.Marker({
          position: { lat: poi.lat, lng: poi.lng },
          map,
          title: poi.label,
          icon: getMarkerIcon(poi.category)
        });
      });
    }
    */
    // No-op for now
  }, [destination, interests]);

  // Color for "markers" by interest/category, matched to palette
  const CATEGORY_COLOR = {
    Nature: "#43A047",   // secondary
    Food: "#FFC107",     // accent
    Shopping: "#1976D2", // primary
    Culture: "#FF90B5",  // soft-pink for demo 
    Adventure: "#7a52c7", // purple
    History: "#1976D2"
  };

  // Render demo map as a styled SVG with markers, for fallback case
  const renderDemoMap = () => {
    const center = DEMO_CITY_CENTER[destination] || { lat: 48.8566, lng: 2.3522 };
    const pois = getDemoPOIs();
    // Helper: Transform geo coords to demo SVG positions
    // For this placeholder: just lay out city POIs in a neat scatter!
    const W = 380, H = 240;
    const markerPositions = [
      [0.72, 0.23], [0.18, 0.52], [0.38, 0.81], [0.62, 0.73], [0.5, 0.34]
    ];

    return (
      <div
        className="tf-mapview-demo"
        style={{
          background: "#e5f5fd",
          border: "2px solid var(--primary)",
          borderRadius: 17,
          width: W,
          height: H,
          margin: "0 auto",
          boxShadow: "0 4px 12px 0 rgba(80,136,221,0.07)"
        }}
        aria-label="Map area (demo)"
      >
        <svg width={W} height={H} style={{ display: "block" }}>
          {/* City oval */}
          <ellipse
            cx={W / 2}
            cy={H / 2}
            rx={W * 0.43}
            ry={H * 0.41}
            fill="#fafcff"
            stroke="#b1e3f4"
            strokeWidth="5"
          />
          {/* Place markers */}
          {pois.map((poi, idx) => {
            const [pX, pY] = markerPositions[idx % markerPositions.length];
            const color = CATEGORY_COLOR[poi.category] || "#1976D2";
            return (
              <g key={poi.label}>
                {/* Pin marker */}
                <circle
                  cx={W * pX}
                  cy={H * pY}
                  r="11"
                  fill={color}
                  stroke="#fff"
                  strokeWidth="2.5"
                  style={{
                    filter: "drop-shadow(0px 2px 6px #2176d254)"
                  }}
                />
                {/* Pin label - on hover (show always here for demo) */}
                <text
                  x={W * pX + 18}
                  y={H * pY + 6}
                  fontSize="1.06em"
                  fill="#18306a"
                  opacity="0.89"
                  style={{
                    fontWeight: 500,
                    textShadow: "0 2px 6px #fff8"
                  }}
                >
                  {poi.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 16,
            background: "#fff",
            color: "#1976D2",
            fontWeight: 600,
            borderRadius: 6,
            boxShadow: "0 0.5px 2.5px #2176d217",
            padding: "6px 16px",
            fontSize: "0.98rem",
            letterSpacing: 0.01
          }}
        >
          {destination ? `Map: Top spots in ${destination}` : "Select a destination"}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`${className} tf-mapview-container`}
      style={{
        width: "100%",
        maxWidth: 480,
        minHeight: 280,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#fff",
        borderRadius: 17
      }}
    >
      {/* Live Map API placeholder */}
      <div ref={mapRef} style={{ display: "none" }} />
      {destination ? (
        renderDemoMap()
      ) : (
        <div
          className="tf-map-placeholder"
          style={{
            color: "var(--primary)",
            background: "#f5f7fa",
            fontSize: "1.14rem",
            width: "100%",
            padding: "44px 0",
            textAlign: "center",
            borderRadius: 16
          }}
        >
          Select a destination to show the map.
        </div>
      )}
      {/* Marker legend */}
      <div
        style={{
          marginTop: 18,
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          gap: 19,
          flexWrap: "wrap",
          fontSize: "0.98em"
        }}
      >
        {["Nature", "Food", "Shopping", "Culture", "Adventure", "History"].map((cat) => (
          <span
            key={cat}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: 0.91
            }}
          >
            <span
              style={{
                width: 13,
                height: 13,
                background: CATEGORY_COLOR[cat] || "#bbb",
                borderRadius: "50%",
                display: "inline-block",
                border: "2px solid #fff",
                boxShadow: `0 0 2px 1px #${CATEGORY_COLOR[cat]?.substring(1)||'bbb'}22`
              }}
            />{" "}
            <span style={{ color: "#1976D2" }}>{cat}</span>
          </span>
        ))}
      </div>
      <div style={{fontSize: "0.92em", color: "#555", marginTop: 10, opacity: 0.7}}>
        <span role="img" aria-label="info">&#8505;</span> Demo map. Google Maps integration coming soon!
      </div>
    </div>
  );
}

export default MapView;
