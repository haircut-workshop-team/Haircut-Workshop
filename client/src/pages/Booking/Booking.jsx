import api from "../../services/api";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Swal from "sweetalert2";
import "react-calendar/dist/Calendar.css";
import "./Booking.css";

export default function Booking() {
  const [step, setStep] = useState(1);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSlots, setShowSlots] = useState(false);

  const steps = ["Select Services", "Choose Barber", "Pick Time", "Confirm"];

  //  Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.request("/services");
        setServices(response.data || []);
      } catch (err) {
        console.error(err);
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  //  Fetch barbers when step 2
  useEffect(() => {
    if (step === 2) {
      const fetchBarbers = async () => {
        try {
          const response = await api.request("/barber/list");
          setBarbers(response.data || []);
        } catch (err) {
          console.error(err);
          setBarbers([]);
        }
      };
      fetchBarbers();
    }
  }, [step]);

  // Fetch available times when barber, date, or service changes
  useEffect(() => {
    if (!selectedBarber || selectedServices.length === 0 || !selectedDate)
      return;

    const fetchSlots = async () => {
      try {
        // Fix timezone issue: format date as YYYY-MM-DD without timezone conversion
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const day = String(selectedDate.getDate()).padStart(2, "0");
        const dateStr = `${year}-${month}-${day}`;
        const serviceId = selectedServices[0].id;
        const barberId = selectedBarber.id || selectedBarber.barber_id;
        const response = await api.request(
          `/appointments/${barberId}/availability?date=${dateStr}&service_id=${serviceId}`
        );
        setAvailableTimes(response.data || []);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setAvailableTimes([]);
      }
    };
    fetchSlots();
  }, [selectedBarber, selectedDate, selectedServices]);

  // Toggle selected services
  const toggleService = (service) => {
    let updated;
    if (selectedServices.includes(service)) {
      updated = selectedServices.filter((s) => s !== service);
    } else {
      updated = [...selectedServices, service];
    }
    setSelectedServices(updated);
    setTotalPrice(updated.reduce((sum, s) => sum + parseFloat(s.price), 0));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleConfirmBooking = async () => {
    try {
      if (
        !selectedBarber ||
        selectedServices.length === 0 ||
        !selectedDate ||
        !selectedTime
      ) {
        Swal.fire({
          icon: "warning",
          title: "Please complete all booking details.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
        return;
      }

      const barber_id = selectedBarber.id || selectedBarber.barber_id;
      // Fix timezone issue: format date as YYYY-MM-DD without timezone conversion
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
      const day = String(selectedDate.getDate()).padStart(2, "0");
      const appointment_date = `${year}-${month}-${day}`;
      const appointment_time = selectedTime;
      const notes = "";

      const token = localStorage.getItem("token");

      // Create appointments for ALL selected services
      const bookingPromises = selectedServices.map((service) =>
        api.request("/appointments", {
          method: "POST",
          body: {
            service_id: service.id,
            barber_id,
            appointment_date,
            appointment_time,
            notes,
          },
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      // Wait for all appointments to be created
      const results = await Promise.all(bookingPromises);

      // Check if all bookings were successful
      const allSuccessful = results.every(
        (res) => res.data?.success || res.success
      );

      if (allSuccessful) {
        Swal.fire({
          icon: "success",
          title: `Successfully booked ${selectedServices.length} service${
            selectedServices.length > 1 ? "s" : ""
          }!`,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });

        // Reset booking state
        setStep(1);
        setSelectedServices([]);
        setSelectedBarber(null);
        setSelectedDate(new Date());
        setSelectedTime("");
        setTotalPrice(0);
      } else {
        Swal.fire({
          icon: "error",
          title: "Some bookings failed. Please try again.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
        });
      }
    } catch (err) {
      console.error("Booking Error:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Server error while booking";

      Swal.fire({
        icon: "error",
        title: errorMessage,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 5000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="booking-container">
      <h2 className="booking-title">Book Your Appointment</h2>

      <div className="booking-progress-bar">
        <div className="booking-progress-bg"></div>
        <div
          className="booking-progress-fg"
          style={{
            width: `${((step - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>

      {/* Stepper */}
      <div className="booking-stepper">
        {steps.map((label, index) => (
          <div
            key={index}
            className={`booking-step ${
              step === index + 1 ? "active" : step > index + 1 ? "done" : ""
            }`}
          >
            <span className="booking-step-number">{index + 1}</span>
            <p>{label}</p>
          </div>
        ))}
      </div>

      <div
        className={`booking-step1-wrapper ${step === 4 ? "single-column" : ""}`}
      >
        <div className="booking-main-content">
          {/* Step 1: Select Services */}
          {step === 1 && (
            <>
              <h3 className="booking-step-title">
                Select the services you want
              </h3>
              <div className="booking-service-grid">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className={`booking-service-card ${
                      selectedServices.includes(service) ? "selected" : ""
                    }`}
                    onClick={() => toggleService(service)}
                  >
                    {service.image_url && (
                      <div className="booking-service-image">
                        <img src={service.image_url} alt={service.name} />
                      </div>
                    )}
                    <h4>{service.name}</h4>
                    <p>{service.duration} min</p>
                    <p>{service.price} JOD</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Choose Barber */}
          {step === 2 && (
            <>
              <h3 className="booking-step-title">Choose Your Barber</h3>
              <div className="booking-barber-grid">
                {barbers.map((barber) => (
                  <div
                    key={barber.id}
                    className={`booking-barber-card ${
                      selectedBarber?.id === barber.id ? "selected" : ""
                    }`}
                    onClick={() => setSelectedBarber(barber)}
                  >
                    {barber.profile_image && (
                      <div className="barber-image-wrapper">
                        <img
                          src={`http://localhost:5000${barber.profile_image}`}
                          alt={barber.barber_name}
                        />
                      </div>
                    )}
                    <p className="barber-name">{barber.name}</p>
                    <p>{barber.specialties}</p>
                    <p>⭐ {barber.rating}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <div className="booking-step3-wrapper">
              <h3 className="booking-step-title">Pick a Date & Time</h3>

              {/* Date Picker */}
              <div className="date-picker-wrapper">
                <button
                  className="date-picker-btn"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  📅{" "}
                  {selectedDate ? selectedDate.toDateString() : "Select Date"}
                </button>

                <div
                  className={`calendar-popup ${showCalendar ? "active" : ""}`}
                >
                  <Calendar
                    onChange={(date) => {
                      setSelectedDate(date);
                      setShowCalendar(false); // Close after selection
                    }}
                    value={selectedDate}
                    minDate={new Date()}
                  />
                </div>
              </div>

              {/* Time Slots Toggle Button */}
              <div className="time-slot-toggle">
                <button
                  className="open-slots-btn"
                  onClick={() => setShowSlots(!showSlots)}
                >
                  {showSlots ? "Hide Times" : "Choose Time"}
                </button>
              </div>

              {/* Time Slots */}
              <div
                className={`booking-time-grid-wrapper ${
                  showSlots ? "active" : ""
                }`}
              >
                {availableTimes.length > 0 ? (
                  <div className="booking-time-grid">
                    {availableTimes.map((slot, index) => (
                      <button
                        key={slot || index}
                        className={`time-slot-btn ${
                          selectedTime === slot ? "selected" : ""
                        }`}
                        onClick={() => setSelectedTime(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="no-times-msg">
                    The barber is not available on this date.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Confirm Booking */}
          {step === 4 && (
            <div>
              <h3 className="booking-step-title">Confirm Your Booking</h3>
              <div className="booking-confirmation">
                <p>
                  <strong>Services:</strong>{" "}
                  {selectedServices.map((s) => s.name).join(", ")}
                </p>
                <p>
                  <strong>Barber:</strong> {selectedBarber.barber_name}
                </p>
                <p>
                  <strong>Date:</strong> {selectedDate.toDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
                <p>
                  <strong>Total:</strong> {totalPrice.toFixed(2)} JOD
                </p>

                <button
                  className="booking-btn-primary"
                  onClick={handleConfirmBooking}
                  disabled={!selectedTime}
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          )}
        </div>

        {/* === Summary Card === */}
        {step < 4 && (
          <div className="booking-summary-card">
            <div className="summary-header">
              <h4>Booking Summary 💈</h4>
            </div>
            <div className="summary-body">
              {step >= 1 && (
                <p>
                  <strong>Services:</strong>{" "}
                  {selectedServices.map((s) => s.name).join(", ")}
                </p>
              )}
              {step >= 2 && selectedBarber && (
                <p>
                  <strong>Barber:</strong> {selectedBarber.barber_name}
                </p>
              )}
              {step >= 1 && (
                <p>
                  <strong>Total:</strong> {totalPrice.toFixed(2)} JOD
                </p>
              )}
              {step >= 3 && (
                <p>
                  <strong>Date:</strong> {selectedDate.toDateString()}
                </p>
              )}
              {step >= 3 && (
                <p>
                  <strong>Time:</strong> {selectedTime}
                </p>
              )}
            </div>

            <button
              className="booking-btn-primary"
              onClick={() => {
                nextStep();
                window.scrollTo(0, 0);
              }}
              disabled={
                (step === 1 && selectedServices.length === 0) ||
                (step === 2 && !selectedBarber) ||
                (step === 3 && !selectedTime)
              }
            >
              Continue
            </button>
          </div>
        )}
      </div>

      {/* Back button */}
      {step > 1 && (
        <button
          className="booking-btn-back"
          onClick={() => {
            prevStep();
            window.scrollTo(0, 0);
          }}
        >
          Back
        </button>
      )}
    </div>
  );
}
