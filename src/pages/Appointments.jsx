import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check, X, Calendar, CalendarIcon } from "lucide-react";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [confirmCount, setConfirmCount] = useState(0);
  const [rescheduleCount, setRescheduleCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [cancelCount, setCancelCount] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  useEffect(() => {
    const fetchCompleteCount = async () => {
      try {
        const countResponse = await fetch(
          "http://localhost:3000/appointments/complete/count"
        );
        if (!countResponse.ok) {
          throw new Error("Failed to fetch pending appointments count");
        }
        const countData = await countResponse.json();
        setCompleteCount(countData.total_completed_appointments);
      } catch (err) {
        console.error("Error fetching completed count:", err);
      }
    };

    const fetchCancelCount = async () => {
      try {
        const countResponse = await fetch(
          "http://localhost:3000/appointments/cancel/count"
        );
        if (!countResponse.ok) {
          throw new Error("Failed to fetch pending appointments count");
        }
        const countData = await countResponse.json();
        setCancelCount(countData.total_canceled_appointments);
      } catch (err) {
        console.error("Error fetching cancel count:", err);
      }
    };

    const fetchRescheduleCount = async () => {
      try {
        const countResponse = await fetch(
          "http://localhost:3000/appointments/reschedule/count"
        );
        if (!countResponse.ok) {
          throw new Error("Failed to fetch pending appointments count");
        }
        const countData = await countResponse.json();
        setRescheduleCount(countData.total_reschedule_appointments);
      } catch (err) {
        console.error("Error fetching reschedule count:", err);
      }
    };

    const fetchPendingCount = async () => {
      try {
        const countResponse = await fetch(
          "http://localhost:3000/appointments/pending/count"
        );
        if (!countResponse.ok) {
          throw new Error("Failed to fetch pending appointments count");
        }
        const countData = await countResponse.json();
        setPendingCount(countData.total_pending_appointments);
      } catch (err) {
        console.error("Error fetching pending count:", err);
      }
    };

    const fetchConfirmCount = async () => {
      try {
        const countResponse = await fetch(
          "http://localhost:3000/appointments/confirm/count"
        );
        if (!countResponse.ok) {
          throw new Error("Failed to fetch confirm appointments count");
        }
        const countData = await countResponse.json();
        setConfirmCount(countData.total_confirm_appointments);
      } catch (err) {
        console.error("Error fetching confirm count:", err);
      }
    };

    const fetchAppointmentCount = async () => {
      try {
        const countResponse = await fetch(
          "http://localhost:3000/appointments/count"
        );
        if (!countResponse.ok) {
          throw new Error("Failed to fetch confirm appointments count");
        }
        const countData = await countResponse.json();
        setAppointmentCount(countData.total_appointments);
      } catch (err) {
        console.error("Error fetching appointment count:", err);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/appointments/pending"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();

        // Transform API data to match existing component structure
        const transformedAppointments = data.pending_appointments.map(
          (appointment) => ({
            id: `APP-${appointment.appointment_id}`, // Used for React key
            appointmentId: appointment.appointment_id, // Actual backend ID for approval
            patientName: appointment.patient_name,
            date: new Date(appointment.appointment_date).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              }
            ),
            rawDate: appointment.appointment_date, // Keep the raw date for rescheduling
            time: appointment.appointment_time.slice(0, 5), // Keep HH:MM format
            doctor: appointment.doctor_name,
            specialty: appointment.specialization,
            status:
              appointment.status.charAt(0).toUpperCase() +
              appointment.status.slice(1),
            doctorId: appointment.doctor_id,
          })
        );

        setAppointments(transformedAppointments);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCompleteCount();
    fetchCancelCount();
    fetchRescheduleCount();
    fetchAppointmentCount();
    fetchConfirmCount();
    fetchPendingCount();
    fetchAppointments();
  }, []);

  const handleApproveAppointment = async (appointmentId) => {
    console.log("Approving appointment with ID:", appointmentId);

    try {
      const response = await fetch(
        `http://localhost:3000/appointments/approve/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to approve appointment");
      }

      // Update local state
      const updatedAppointments = appointments.filter(
        (appointment) => appointment.appointmentId !== appointmentId
      );
      setAppointments(updatedAppointments);

      // Decrease pending count
      setPendingCount((prevCount) => prevCount - 1);

      // Increase confirm count
      setConfirmCount((prevCount) => prevCount + 1);

      // Show a success message
      alert("Appointment approved successfully!");
    } catch (error) {
      console.error("Error approving appointment:", error);
      alert(`Failed to approve appointment: ${error.message}`);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/appointments/cancel/${appointmentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to cancel appointment");
      }

      // Update local state
      const updatedAppointments = appointments.filter(
        (appointment) => appointment.appointmentId !== appointmentId
      );
      setAppointments(updatedAppointments);

      // Decrease pending count
      setPendingCount((prevCount) => prevCount - 1);

      // Increase cancel count
      setCancelCount((prevCount) => prevCount + 1);

      // Show a success message
      alert("Appointment canceled successfully!");
    } catch (error) {
      console.error("Error canceling appointment:", error);
      alert(`Failed to cancel appointment: ${error.message}`);
    }
  };

  const fetchAvailableTimeSlots = async (doctorId, date) => {
    try {
      // Format date to match API requirements if needed (YYYY-MM-DD format)
      const formattedDate = date; // Assuming date is already in YYYY-MM-DD format
      
      const response = await fetch(
        `http://localhost:3000/appointments/available-slots/${doctorId}/${formattedDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch available time slots");
      }

      const data = await response.json();
      setAvailableTimeSlots(data.available_slots);
      
      // Clear selected time slot if previously selected time is no longer available
      if (!data.available_slots.includes(selectedTimeSlot)) {
        setSelectedTimeSlot("");
      }
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      alert(`Failed to load available time slots: ${error.message}`);
      setAvailableTimeSlots([]);
    }
  };

  // Modified function to handle date change
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    
    // Fetch new time slots when date changes
    if (selectedAppointment && newDate) {
      fetchAvailableTimeSlots(selectedAppointment.doctorId, newDate);
    }
  };


  const handleOpenRescheduleModal = async (appointment) => {
    setSelectedAppointment(appointment);

    try {
      // Format the date for input field (YYYY-MM-DD)
      const appointmentDate = new Date(appointment.rawDate);
      const year = appointmentDate.getFullYear();
      const month = String(appointmentDate.getMonth() + 1).padStart(2, "0");
      const day = String(appointmentDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      setSelectedDate(formattedDate);
      setSelectedTimeSlot(appointment.time);
      setShowRescheduleModal(true);
      
      // Fetch available slots for the initial date using the doctor's ID
      await fetchAvailableTimeSlots(appointment.doctorId, formattedDate);
    } catch (error) {
      console.error("Error fetching reschedule data:", error);
      alert(`Failed to load reschedule options: ${error.message}`);
    }
  };

  const handleCloseRescheduleModal = () => {
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
    setSelectedDate("");
    setSelectedTimeSlot("");
    setAvailableTimeSlots([]);
  };

  const handleRescheduleAppointment = async () => {
    if (!selectedAppointment || !selectedDate || !selectedTimeSlot) {
      alert("Please select a date and time");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/appointments/${selectedAppointment.appointmentId}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_date: selectedDate,
            new_time: `${selectedTimeSlot}:00`, // Adding seconds to match the backend format
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to reschedule appointment"
        );
      }

      // Update local state
      const updatedAppointments = appointments.filter(
        (appointment) =>
          appointment.appointmentId !== selectedAppointment.appointmentId
      );
      setAppointments(updatedAppointments);

      // Decrease pending count and increase reschedule count
      setPendingCount((prevCount) => prevCount - 1);
      setRescheduleCount((prevCount) => prevCount + 1);

      // Close modal
      handleCloseRescheduleModal();

      // Show a success message
      alert("Appointment rescheduled successfully!");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert(`Failed to reschedule appointment: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "text-orange-500";
      case "Approved":
        return "text-green-500";
      case "Rescheduled":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return <div className="w-full h-screen p-8 bg-white">Loading...</div>;
  }

  if (error) {
    return (
      <div className="w-full h-screen p-8 bg-white text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full h-screen p-8 bg-white">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">
              {appointmentCount}
            </div>
            <div className="text-sm text-gray-500">Total Bookings</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">
              {pendingCount}
            </div>
            <div className="text-sm text-gray-500">Pending Approval</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">
              {confirmCount}
            </div>
            <div className="text-sm text-gray-500">Confirmed Appointments</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">
              {rescheduleCount}
            </div>
            <div className="text-sm text-gray-500">Rescheduled Appointment</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">
              {completeCount}
            </div>
            <div className="text-sm text-gray-500">Completed Appointment</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">
              {cancelCount}
            </div>
            <div className="text-sm text-gray-500">Canceled Appointment</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="flex mb-4 space-x-2">
            <input
              type="text"
              placeholder="dd/mm/yyyy"
              className="border rounded px-2 py-1 text-sm text-gray-700"
            />
            <select className="border rounded px-2 py-1 text-sm text-gray-700">
              <option>All Status</option>
            </select>
            <input
              type="text"
              placeholder="Search appointments..."
              className="ml-auto border rounded px-2 py-1 text-sm text-gray-700"
            />
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 text-sm font-medium text-gray-600">
                  Patient Name
                </th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">
                  Date & Time
                </th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">
                  Doctor
                </th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="border-b text-gray-500">
                  <td className="p-2">{appointment.patientName}</td>
                  <td className="p-2">
                    {appointment.date} {appointment.time}
                  </td>
                  <td className="p-2">
                    {appointment.doctor}
                    <div className="text-xs text-gray-500">
                      {appointment.specialty}
                    </div>
                  </td>
                  <td className="p-2">
                    <span
                      className={`font-medium ${getStatusColor(
                        appointment.status
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() =>
                          handleApproveAppointment(appointment.appointmentId)
                        }
                        className="border rounded p-1 hover:bg-gray-100"
                        title="Approve"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        className="border rounded p-1 hover:bg-gray-100"
                        onClick={() =>
                          handleCancelAppointment(appointment.appointmentId)
                        }
                        title="Cancel"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <button
                        className="border rounded p-1 hover:bg-gray-100"
                        onClick={() => handleOpenRescheduleModal(appointment)}
                        title="Reschedule"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <div>Showing 1 to {appointments.length} of 248 entries</div>
            <div className="flex space-x-2">
              <button className="border rounded p-1 hover:bg-gray-100">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="border rounded px-3 py-1 hover:bg-gray-100">
                1
              </button>
              <button className="border rounded px-3 py-1 hover:bg-gray-100">
                2
              </button>
              <button className="border rounded px-3 py-1 hover:bg-gray-100">
                3
              </button>
              <button className="border rounded p-1 hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedAppointment && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0"
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          ></div>
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md z-10">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Reschedule Appointment
              </h2>
              <button
                onClick={handleCloseRescheduleModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Doctor Info */}
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {selectedAppointment.doctor}
                  </h3>
                  <p className="text-gray-500">
                    {selectedAppointment.specialty}
                  </p>
                </div>
              </div>

              {/* Patient Info */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-800">Patient</h3>
                <p className="text-gray-600">
                  {selectedAppointment.patientName}
                </p>
              </div>

              {/* Current Appointment */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-800">
                  Current Appointment
                </h3>
                <p className="text-gray-600">
                  {selectedAppointment.date} at {selectedAppointment.time}
                </p>
              </div>

              {/* Date Selection - Now uses handleDateChange instead of direct setState */}
              <div className="mb-6">
                <h3 className="font-medium mb-2 text-gray-800">
                  Select New Date
                </h3>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full p-2 border rounded-md pl-3 text-gray-800 appearance-none"
                  />
                  <CalendarIcon
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                    size={20}
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="font-medium mb-2 text-gray-500">
                  Available Time Slots
                </h3>
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((time) => (
                      <button
                        key={time}
                        className={`p-3 text-center rounded-md border text-sm ${
                          selectedTimeSlot === time
                            ? "bg-blue-100 text-blue-600 border-blue-300"
                            : "hover:bg-gray-50 text-gray-600"
                        }`}
                        onClick={() => setSelectedTimeSlot(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No available time slots for this date</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end p-4 border-t gap-3">
              <button
                onClick={handleCloseRescheduleModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleAppointment}
                disabled={!selectedTimeSlot}
                className={`px-6 py-2 rounded-md ${
                  selectedTimeSlot
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
