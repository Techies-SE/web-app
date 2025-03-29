import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Calendar } from "lucide-react";

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

  useEffect(() => {

    const fetchCompleteCount = async () => {
      try {
        const countResponse = await fetch('http://localhost:3000/appointments/complete/count');
        if (!countResponse.ok) {
          throw new Error('Failed to fetch pending appointments count');
        }
        const countData = await countResponse.json();
        setCompleteCount(countData.total_completed_appointments);
      } catch (err) {
        console.error('Error fetching completed count:', err);
      }
    };

    const fetchCancelCount = async () => {
      try {
        const countResponse = await fetch('http://localhost:3000/appointments/cancel/count');
        if (!countResponse.ok) {
          throw new Error('Failed to fetch pending appointments count');
        }
        const countData = await countResponse.json();
        setCancelCount(countData.total_canceled_appointments);
      } catch (err) {
        console.error('Error fetching cancel count:', err);
      }
    };

    const fetchRescheduleCount = async () => {
      try {
        const countResponse = await fetch('http://localhost:3000/appointments/reschedule/count');
        if (!countResponse.ok) {
          throw new Error('Failed to fetch pending appointments count');
        }
        const countData = await countResponse.json();
        setRescheduleCount(countData.total_reschedule_appointments);
      } catch (err) {
        console.error('Error fetching reschedule count:', err);
      }
    };
    

    const fetchPendingCount = async () => {
      try {
        const countResponse = await fetch('http://localhost:3000/appointments/pending/count');
        if (!countResponse.ok) {
          throw new Error('Failed to fetch pending appointments count');
        }
        const countData = await countResponse.json();
        setPendingCount(countData.total_pending_appointments);
      } catch (err) {
        console.error('Error fetching pending count:', err);
      }
    };

    const fetchConfirmCount = async () => {
      try {
        const countResponse = await fetch('http://localhost:3000/appointments/confirm/count');
        if (!countResponse.ok) {
          throw new Error('Failed to fetch confirm appointments count');
        }
        const countData = await countResponse.json();
        setConfirmCount(countData.total_confirm_appointments);
      } catch (err) {
        console.error('Error fetching confirm count:', err);
      }
    };

    const fetchAppointmentCount = async () => {
      try {
        const countResponse = await fetch('http://localhost:3000/appointments/count');
        if (!countResponse.ok) {
          throw new Error('Failed to fetch confirm appointments count');
        }
        const countData = await countResponse.json();
        setAppointmentCount(countData.total_appointments);
      } catch (err) {
        console.error('Error fetching appointment count:', err);
      }
    };
    

    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3000/appointments/pending');
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        
        // Transform API data to match existing component structure
        const transformedAppointments = data.pending_appointments.map(appointment => ({
          id: `APP-${appointment.appointment_id}`, // Used for React key
          appointmentId: appointment.appointment_id, // Actual backend ID for approval
          patientName: appointment.patient_name,
          date: new Date(appointment.appointment_date).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          time: appointment.appointment_time.slice(0, 5), // Keep HH:MM format
          doctor: appointment.doctor_name,
          specialty: appointment.specialization,
          status: appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
        }));

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
    console.log("Approving appointment with ID:", appointmentId); // Debug log
    
    try {
      const response = await fetch(`http://localhost:3000/appointments/approve/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve appointment');
      }

      // Update local state
      const updatedAppointments = appointments.filter(
        appointment => appointment.appointmentId !== appointmentId
      );
      setAppointments(updatedAppointments);
      
      // Decrease pending count
      setPendingCount(prevCount => prevCount - 1);

      // Show a success message
      alert('Appointment approved successfully!');

    } catch (error) {
      console.error('Error approving appointment:', error);
      alert(`Failed to approve appointment: ${error.message}`);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3000/appointments/cancel/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel appointment');
      }

      // Update local state
      const updatedAppointments = appointments.filter(
        appointment => appointment.appointmentId !== appointmentId
      );
      setAppointments(updatedAppointments);
      
      // Decrease pending count
      setPendingCount(prevCount => prevCount - 1);

      // Show a success message
      alert('Appointment canceled successfully!');

    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert(`Failed to cancel appointment: ${error.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-orange-500';
      case 'Approved': return 'text-green-500';
      case 'Rescheduled': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  if (loading) {
    return <div className="w-full h-screen p-8 bg-white">Loading...</div>;
  }

  if (error) {
    return <div className="w-full h-screen p-8 bg-white text-red-500">Error: {error}</div>;
  }

  return (
    <div className="w-full h-screen p-8 bg-white">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">{appointmentCount}</div>
            <div className="text-sm text-gray-500">Total Bookings</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">{pendingCount}</div>
            <div className="text-sm text-gray-500">Pending Approval</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">{confirmCount}</div>
            <div className="text-sm text-gray-500">Confrimed Appointments</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">{rescheduleCount}</div>
            <div className="text-sm text-gray-500">Rescheduled Appointment</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">{completeCount}</div>
            <div className="text-sm text-gray-500">Completed Appointment</div>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-700">{cancelCount}</div>
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
                <th className="text-left p-2 text-sm font-medium text-gray-600">Patient Name</th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">Date & Time</th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">Doctor</th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left p-2 text-sm font-medium text-gray-600">Actions</th>
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
                    <span className={`font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleApproveAppointment(appointment.appointmentId)}
                        className="border rounded p-1 hover:bg-gray-100"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button className="border rounded p-1 hover:bg-gray-100"onClick={()=>handleCancelAppointment(appointment.appointmentId)}>
                        <X className="h-4 w-4" />
                      </button>
                      <button className="border rounded p-1 hover:bg-gray-100">
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
              <button className="border rounded px-3 py-1 hover:bg-gray-100">1</button>
              <button className="border rounded px-3 py-1 hover:bg-gray-100">2</button>
              <button className="border rounded px-3 py-1 hover:bg-gray-100">3</button>
              <button className="border rounded p-1 hover:bg-gray-100">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;