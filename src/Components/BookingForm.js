import "../styles/BookingForm.css";
import { useState } from "react";

function BookingForm() {
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");

  const isValidTrip =
    startDateTime &&
    endDateTime &&
    new Date(endDateTime) > new Date(startDateTime);

  return (
    <div className="booking-form">

      {/* Pickup */}
      <div className="input-group">
        <label>Pickup Location</label>
        <input type="text" placeholder="Enter pickup location" />
      </div>

      {/* Destination */}
      <div className="input-group">
        <label>Destination Location</label>
        <input type="text" placeholder="Enter destination location" />
      </div>

      {/* Start */}
      <div className="input-group">
        <label>Trip Start</label>
        <input
          type="datetime-local"
          value={startDateTime}
          min={new Date().toISOString().slice(0, 16)}
          onChange={(e) => setStartDateTime(e.target.value)}
        />
      </div>

      {/* End */}
      <div className="input-group">
        <label>Trip End</label>
        <input
          type="datetime-local"
          value={endDateTime}
          min={startDateTime || new Date().toISOString().slice(0, 16)}
          onChange={(e) => setEndDateTime(e.target.value)}
        />
      </div>

      {/* Error message */}
      {startDateTime &&
        endDateTime &&
        new Date(endDateTime) <= new Date(startDateTime) && (
          <p className="error-text">
            End time must be after start time
          </p>
        )}

      {/* Button (optional but recommended) */}
      <button disabled={!isValidTrip}>
        Find Drivers
      </button>

    </div>
  );
}

export default BookingForm;