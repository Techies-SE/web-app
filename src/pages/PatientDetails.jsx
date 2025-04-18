import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  Printer,
  Download,
  ChevronDown,
  ChevronUp,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const PatientDetails = ({ hn_number, onBack }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedTests, setExpandedTests] = useState({});
  const [expandedAppointments, setExpandedAppointments] = useState({
    scheduled: true,
    pending: true,
    completed: true,
    canceled: true,
    rescheduled: true,
  });

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/details/${hn_number}`);
        if (!response.ok) {
          throw new Error("Failed to fetch patient details");
        }
        const data = await response.json();
        setPatient(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (hn_number) {
      fetchPatientDetails();
    }
  }, [hn_number]);

  const toggleTestExpansion = (testIndex) => {
    setExpandedTests((prev) => ({
      ...prev,
      [testIndex]: !prev[testIndex],
    }));
  };

  const toggleAppointmentSection = (section) => {
    setExpandedAppointments((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: {
        color: "bg-amber-100 text-amber-800",
        icon: <Clock size={14} className="mr-1" />,
      },
      completed: {
        color: "bg-green-100 text-green-800",
        icon: <CheckCircle size={14} className="mr-1" />,
      },
      canceled: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={14} className="mr-1" />,
      },
      scheduled: {
        color: "bg-blue-100 text-blue-800",
        icon: <Calendar size={14} className="mr-1" />,
      },
      rescheduled: {
        color: "bg-purple-100 text-purple-800",
        icon: <Calendar size={14} className="mr-1" />,
      },
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          statusConfig[status]?.color || "bg-gray-100 text-gray-800"
        }`}
      >
        {statusConfig[status]?.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
  };

  if (loading) {
    return (
      <div className="patient-details-container font-sans p-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#3BA092] hover:text-[#2A7E6C] mb-6"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Patients
        </button>
        <div className="text-center py-10">Loading patient details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="patient-details-container font-sans p-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#3BA092] hover:text-[#2A7E6C] mb-6"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Patients
        </button>
        <div className="text-center py-10 text-red-500">
          Error: {error}. Please try again later.
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="patient-details-container font-sans p-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#3BA092] hover:text-[#2A7E6C] mb-6"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Patients
        </button>
        <div className="text-center py-10">No patient data found.</div>
      </div>
    );
  }

  return (
    <div className="patient-details-container font-sans">
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-[#3BA092] hover:text-[#2A7E6C] mr-4"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Patients
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex space-x-3">
            <button className="flex items-center px-4 py-2 bg-white border border-[#3BA092] text-[#3BA092] rounded hover:bg-[#E8F9F1]">
              <Printer size={16} className="mr-2" />
              Print
            </button>
            <button className="flex items-center px-4 py-2 bg-[#3BA092] text-white rounded hover:bg-[#2A7E6C]">
              <Download size={16} className="mr-2" />
              Download
            </button>
          </div>
        </div>

        {/* Patient Information Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#242222] mb-4">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#969696]">HN Number</p>
                <p className="text-[#595959] font-medium">
                  {patient.hn_number || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Full Name</p>
                <p className="text-[#595959] font-medium">
                  {patient.name || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Citizen ID</p>
                <p className="text-[#595959] font-medium">
                  {patient.citizen_id || "-"}
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#969696]">Phone Number</p>
                <p className="text-[#595959] font-medium">
                  {patient.phone_no || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Registered At</p>
                <p className="text-[#595959] font-medium">
                  {formatDate(patient.registered_at) || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Last Updated</p>
                <p className="text-[#595959] font-medium">
                  {formatDate(patient.updated_at) || "-"}
                </p>
              </div>
            </div>

            {/* Column 3 - Health Metrics */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#969696]">Gender</p>
                <p className="text-[#595959] font-medium">
                  {patient.patient_data?.gender || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Blood Type</p>
                <p className="text-[#595959] font-medium">
                  {patient.patient_data?.blood_type || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Age</p>
                <p className="text-[#595959] font-medium">
                  {patient.patient_data?.age || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Date of Birth</p>
                <p className="text-[#595959] font-medium">
                  {formatDate(patient.patient_data?.date_of_birth) || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Results Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#242222] mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-[#3BA092]" />
            Lab Tests
          </h2>

          {patient.lab_tests?.length === 0 ? (
            <p className="text-gray-500">No lab tests available</p>
          ) : (
            <div className="space-y-4">
              {patient.lab_tests?.map((test, testIndex) => (
                <div
                  key={testIndex}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100"
                    onClick={() => toggleTestExpansion(testIndex)}
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-medium text-[#242222] mr-3">
                        {test.test_name || "Unnamed Test"}
                      </span>
                      <StatusBadge status={test.status} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-[#595959] mr-3">
                        Test Date: {formatDate(test.lab_test_date)}
                      </span>
                      {expandedTests[testIndex] ? (
                        <ChevronUp size={18} className="text-[#595959]" />
                      ) : (
                        <ChevronDown size={18} className="text-[#595959]" />
                      )}
                    </div>
                  </button>

                  {expandedTests[testIndex] && (
                    <div className="p-4">
                      {test.results?.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                                  Test Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                                  Result
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                                  Unit
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                                  Reference Range
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {test.results.map((item, itemIndex) => (
                                <tr key={itemIndex}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                                    {item.lab_item_name || "-"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#242222]">
                                    {item.value || "-"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                                    {item.unit || "-"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                                    {item.normal_range || "-"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        item.lab_item_status === "normal"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                      }`}
                                    >
                                      {item.lab_item_status || "-"}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-500">No results available for this test</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments Section */}
        <div>
          <h2 className="text-xl font-semibold text-[#242222] mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-[#3BA092]" />
            Appointments
          </h2>

          {/* Group appointments by status */}
          {['scheduled', 'pending', 'completed', 'canceled', 'rescheduled'].map((status) => {
            const filteredAppointments = patient.appointments?.filter(
              (appt) => appt.status === status
            ) || [];

            if (filteredAppointments.length === 0) return null;

            return (
              <div className="mb-6" key={status}>
                <button
                  className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
                  onClick={() => toggleAppointmentSection(status)}
                >
                  <div className="flex items-center">
                    <span className="font-medium text-[#242222]">
                      {status.charAt(0).toUpperCase() + status.slice(1)} (
                      {filteredAppointments.length})
                    </span>
                  </div>
                  {expandedAppointments[status] ? (
                    <ChevronUp size={18} className="text-[#595959]" />
                  ) : (
                    <ChevronDown size={18} className="text-[#595959]" />
                  )}
                </button>

                {expandedAppointments[status] && (
                  <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                            Doctor
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                            Department
                          </th>
                          {status === 'canceled' && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                              Status
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAppointments.map((appointment, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {formatDateTime(appointment.appointment_date, appointment.appointment_time)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.doctor?.name || "-"}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.doctor?.department || "-"}
                            </td>
                            {status === 'canceled' && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                                <StatusBadge status={appointment.status} />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;