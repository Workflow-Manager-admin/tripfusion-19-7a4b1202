import React, { useState } from "react";
import "./TripForm.css";

// The available interest categories
const INTEREST_OPTIONS = [
  "Nature",
  "Food",
  "History",
  "Culture",
  "Shopping",
  "Adventure",
];

// PUBLIC_INTERFACE
/**
 * TripForm Component for collecting trip planning inputs.
 * @param {Object} props
 * @param {Object} props.formData - Current form state from parent.
 * @param {Function} props.onFormChange - Callback: called with new form data on any change.
 * @param {Function} [props.onSubmit] - Callback: when the user submits the form.
 */
function TripForm({ formData, onFormChange, onSubmit }) {
  // Internal handlers update parent state via onFormChange
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange({ ...formData, [name]: value });
  };

  const handleDatesChange = (e) => {
    // e.target.name = "startDate" or "endDate"
    onFormChange({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestToggle = (interest) => {
    const current = formData.interests || [];
    let updated;
    if (current.includes(interest)) {
      updated = current.filter((i) => i !== interest);
    } else {
      updated = [...current, interest];
    }
    onFormChange({ ...formData, interests: updated });
  };

  const handleBudgetChange = (e) => {
    onFormChange({
      ...formData,
      budget: e.target.value ? parseInt(e.target.value, 10) : "",
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
  };

  return (
    <form className="tf-trip-form" onSubmit={handleFormSubmit} aria-label="Trip Planning Form">
      <div className="tf-trip-form-group">
        <label htmlFor="destination" className="tf-trip-form-label">Destination</label>
        <input
          type="text"
          id="destination"
          name="destination"
          value={formData.destination || ""}
          onChange={handleInputChange}
          className="tf-trip-form-input"
          placeholder="Enter destination (e.g., Paris)"
          required
          autoComplete="off"
        />
      </div>
      <div className="tf-trip-form-row">
        <div className="tf-trip-form-group">
          <label htmlFor="startDate" className="tf-trip-form-label">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={formData.startDate || ""}
            onChange={handleDatesChange}
            className="tf-trip-form-input"
            required
          />
        </div>
        <div className="tf-trip-form-group">
          <label htmlFor="endDate" className="tf-trip-form-label">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={formData.endDate || ""}
            onChange={handleDatesChange}
            className="tf-trip-form-input"
            required
          />
        </div>
      </div>
      <div className="tf-trip-form-group">
        <span className="tf-trip-form-label">Interests</span>
        <div className="tf-trip-form-interests">
          {INTEREST_OPTIONS.map((interest) => (
            <label
              className="tf-trip-form-checkbox"
              key={interest}
              style={{
                background: formData.interests?.includes(interest)
                  ? "var(--primary)"
                  : "transparent",
                color: formData.interests?.includes(interest)
                  ? "#fff"
                  : "var(--text-color)",
                borderColor: formData.interests?.includes(interest)
                  ? "var(--primary)"
                  : "var(--border-color)",
              }}
            >
              <input
                type="checkbox"
                name="interests"
                value={interest}
                checked={formData.interests?.includes(interest) || false}
                onChange={() => handleInterestToggle(interest)}
              />
              {interest}
            </label>
          ))}
        </div>
      </div>
      <div className="tf-trip-form-group">
        <label htmlFor="budget" className="tf-trip-form-label">Budget (optional, USD)</label>
        <input
          type="number"
          id="budget"
          name="budget"
          value={formData.budget || ""}
          onChange={handleBudgetChange}
          min="0"
          className="tf-trip-form-input"
          placeholder="Enter budget"
        />
      </div>
      {/* This button is styled as accent, but can be hidden if submit is not needed */}
      <button
        className="tf-accent-btn"
        type={onSubmit ? "submit" : "button"}
        style={{ marginTop: "12px" }}
      >
        Plan Trip
      </button>
    </form>
  );
}

export default TripForm;
