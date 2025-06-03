import React, { useState } from 'react';
import './App.css';
// PUBLIC_INTERFACE
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import './components/MapView.css';
import FlightList from './components/FlightList';
import HotelList from './components/HotelList';
// Import OpenAI itinerary helper
import { fetchOpenAIItinerary } from './openai';

// PUBLIC_INTERFACE
function App() {
  const [activeTab, setActiveTab] = useState("plan");

  // Trip form state lives in parent so it's available for itinerary/gen components
  const [tripForm, setTripForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    interests: [],
    budget: "",
  });

  // Itinerary AI state
  const [itinerary, setItinerary] = useState("");
  const [itineraryLoading, setItineraryLoading] = useState(false);
  const [itineraryError, setItineraryError] = useState("");

  // Handles itinerary generation via OpenAI
  const handleGenerateItinerary = async () => {
    setItinerary("");
    setItineraryError("");
    setItineraryLoading(true);
    try {
      const result = await fetchOpenAIItinerary(tripForm);
      setItinerary(result);
    } catch (err) {
      setItineraryError(err?.message || "An error occurred while generating itinerary.");
    }
    setItineraryLoading(false);
  };

  // Future use: handle trip form submit, trigger itinerary etc.
  const handleTripFormSubmit = (formValues) => {
    // eslint-disable-next-line no-console
    console.log("Trip planned:", formValues);
  };

  return (
    <div className="tf-app">
      {/* Header */}
      <header className="tf-header">
        <div className="tf-header-left">
          <span className="tf-logo">&#128747; TripFusion</span>
        </div>
        <div className="tf-header-center">
          <input
            type="text"
            placeholder="Where to?"
            className="tf-search-input"
            aria-label="Search destinations"
          />
        </div>
        <div className="tf-header-right">
          {/* Placeholder for user profile or other actions */}
        </div>
      </header>

      {/* Tabs */}
      <nav className="tf-tabs">
        <button
          className={`tf-tab${activeTab === "plan" ? " active" : ""}`}
          onClick={() => setActiveTab("plan")}
        >
          Plan Trip
        </button>
        <button
          className={`tf-tab${activeTab === "itinerary" ? " active" : ""}`}
          onClick={() => setActiveTab("itinerary")}
        >
          Itinerary
        </button>
        <button
          className={`tf-tab${activeTab === "flights" ? " active" : ""}`}
          onClick={() => setActiveTab("flights")}
        >
          Flights
        </button>
        <button
          className={`tf-tab${activeTab === "hotels" ? " active" : ""}`}
          onClick={() => setActiveTab("hotels")}
        >
          Hotels
        </button>
      </nav>

      {/* Main Container */}
      <div className="tf-main-container">
        {/* Main Map Area */}
        <main className="tf-main-map">
          {activeTab === "plan" ? (
            <div style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}>
              <MapView
                destination={tripForm.destination}
                interests={tripForm.interests}
                className="tf-mapview"
              />
              <div style={{ height: "32px" }} /> {/* Gap */}
              <TripForm
                formData={tripForm}
                onFormChange={setTripForm}
                onSubmit={handleTripFormSubmit}
              />
            </div>
          ) : (
            <div className="tf-map-placeholder">
              {activeTab === "itinerary" && <span>Day-by-day itinerary will appear here.</span>}
              {activeTab === "flights" && (
                // FlightList displays available flights for chosen destination/dates, styled for TripFusion
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <FlightList
                    destination={tripForm.destination}
                    startDate={tripForm.startDate}
                    endDate={tripForm.endDate}
                  />
                </div>
              )}
              {activeTab === "hotels" && (
                // HotelList displays hotel options for chosen destination/dates, styled for TripFusion
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                  <HotelList
                    destination={tripForm.destination}
                    startDate={tripForm.startDate}
                    endDate={tripForm.endDate}
                  />
                </div>
              )}
            </div>
          )}
        </main>
        {/* Sidebar for Itinerary or trip quick details */}
        <aside className="tf-sidebar">
          <div className="tf-sidebar-placeholder">
            <strong>Itinerary Sidebar</strong>
            <div>
              <em>
                {itinerary
                  ? "Your custom itinerary:"
                  : "Planned itinerary or day summary will display here."
                }
              </em>
            </div>
            {/* Loading, error, or itinerary */}
            <div style={{ minHeight: "140px", width: "100%", marginTop: "10px" }}>
              {itineraryLoading && (
                <div style={{ color: "var(--secondary)", fontWeight: 500 }}>Generating itinerary…</div>
              )}
              {itineraryError && (
                <div style={{ color: "#e57373", fontWeight: 500 }}>
                  <span role="img" aria-label="error">⚠️</span> {itineraryError}
                </div>
              )}
              {itinerary && !itineraryLoading && !itineraryError && (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    fontSize: "1.05em",
                    color: "var(--primary)",
                    background: "#f3f7fa",
                    padding: "8px 14px",
                    borderRadius: 7,
                    margin: "0 -4px"
                  }}
                >{itinerary}</pre>
              )}
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button
                className="tf-accent-btn"
                onClick={handleGenerateItinerary}
                disabled={itineraryLoading || !tripForm.destination || !tripForm.startDate || !tripForm.endDate}
                style={{
                  opacity: itineraryLoading || !tripForm.destination || !tripForm.startDate || !tripForm.endDate ? 0.6 : 1,
                  pointerEvents: itineraryLoading || !tripForm.destination || !tripForm.startDate || !tripForm.endDate ? "none" : "auto"
                }}
              >
                {itineraryLoading ? "Generating..." : "Generate Itinerary"}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
