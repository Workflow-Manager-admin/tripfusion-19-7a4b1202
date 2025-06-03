import React, { useState } from 'react';
import './App.css';
// PUBLIC_INTERFACE
import TripForm from './components/TripForm';
import MapView from './components/MapView';
import './components/MapView.css';
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

  // Future use: handle trip form submit, trigger itinerary etc.
  const handleTripFormSubmit = (formValues) => {
    // Placeholder: would later pass this data onward to backend, AI, etc.
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
            <TripForm
              formData={tripForm}
              onFormChange={setTripForm}
              onSubmit={handleTripFormSubmit}
            />
          ) : (
            <div className="tf-map-placeholder">
              {activeTab === "itinerary" && <span>Day-by-day itinerary will appear here.</span>}
              {activeTab === "flights" && <span>Flight search results area.</span>}
              {activeTab === "hotels" && <span>Hotel search and booking area.</span>}
            </div>
          )}
        </main>
        {/* Sidebar for Itinerary or trip quick details */}
        <aside className="tf-sidebar">
          <div className="tf-sidebar-placeholder">
            <strong>Itinerary Sidebar</strong>
            <div>
              <em>Planned itinerary or day summary will display here.</em>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <button className="tf-accent-btn">Generate Itinerary</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;
