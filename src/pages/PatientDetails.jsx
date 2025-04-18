// import React from "react";
// import { ChevronLeft, Printer, Download } from "lucide-react";

// const PatientDetails = ({ patientId, onBack }) => {
//   // Hardcoded patient data - in a real app, you'd fetch this based on patientId
//   const patient = {
//     id: "123456789",
//     hn_number: "HN1234567",
//     name: "John Doe",
//     citizen_id: "1234567890123",
//     phone_no: "0812345678",
//     gender: "Male",
//     blood_type: "A+",
//     age: "35",
// date_of_birth: "1988-05-15",
// weight: "70",
// height: "175",
// bmi: "22.86",
//     systolic: "120",
//     diastolic: "80",
//     doctor: "Dr. Smith",
//     lab_test: "Complete Blood Count",
//     lab_data_status: true,
//     account_status: true,
//     lab_results: [
//       {
//         test_name: "Hemoglobin",
//         result: "14.2 g/dL",
//         normal_range: "13.5-17.5 g/dL",
//         status: "normal"
//       },
//       {
//         test_name: "White Blood Cells",
//         result: "6.5 x10³/μL",
//         normal_range: "4.5-11.0 x10³/μL",
//         status: "normal"
//       },
//       {
//         test_name: "Platelets",
//         result: "210 x10³/μL",
//         normal_range: "150-450 x10³/μL",
//         status: "normal"
//       },
//       {
//         test_name: "Glucose",
//         result: "98 mg/dL",
//         normal_range: "70-99 mg/dL",
//         status: "normal"
//       }
//     ]
//   };

//   return (
//     <div className="patient-details-container font-sans">
//       <div className="flex items-center mb-6">
//         <button
//           onClick={onBack}
//           className="flex items-center text-[#3BA092] hover:text-[#2A7E6C] mr-4"
//         >
//           <ChevronLeft size={20} className="mr-1" />
//           Back to Patients
//         </button>
//         <h1 className="text-2xl font-bold text-[#242222]">Patient Details</h1>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h2 className="text-xl font-semibold text-[#242222]">{patient.name}</h2>
//             <p className="text-[#595959]">HN: {patient.hn_number}</p>
//           </div>
//           <div className="flex space-x-3">
//             <button className="flex items-center px-4 py-2 bg-white border border-[#3BA092] text-[#3BA092] rounded hover:bg-[#E8F9F1]">
//               <Printer size={16} className="mr-2" />
//               Print
//             </button>
//             <button className="flex items-center px-4 py-2 bg-[#3BA092] text-white rounded hover:bg-[#2A7E6C]">
//               <Download size={16} className="mr-2" />
//               Download
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-[#242222]">Personal Information</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-[#969696]">Citizen ID</p>
//                 <p className="text-[#595959]">{patient.citizen_id}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Phone Number</p>
//                 <p className="text-[#595959]">{patient.phone_no}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Gender</p>
//                 <p className="text-[#595959]">{patient.gender}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Blood Type</p>
//                 <p className="text-[#595959]">{patient.blood_type}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Age</p>
//                 <p className="text-[#595959]">{patient.age} years</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Date of Birth</p>
//                 <p className="text-[#595959]">{patient.date_of_birth}</p>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-[#242222]">Health Information</h3>
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-[#969696]">Weight</p>
//                 <p className="text-[#595959]">{patient.weight} kg</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Height</p>
//                 <p className="text-[#595959]">{patient.height} cm</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">BMI</p>
//                 <p className="text-[#595959]">{patient.bmi}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Blood Pressure</p>
//                 <p className="text-[#595959]">{patient.systolic}/{patient.diastolic} mmHg</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Doctor</p>
//                 <p className="text-[#595959]">{patient.doctor}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-[#969696]">Lab Test</p>
//                 <p className="text-[#595959]">{patient.lab_test}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-[#242222]">Lab Results</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                     Test Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                     Result
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                     Normal Range
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {patient.lab_results.map((test, index) => (
//                   <tr key={index}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
//                       {test.test_name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
//                       {test.result}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
//                       {test.normal_range}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                         ${test.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                         {test.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientDetails;

// import React from "react";
// import { ChevronLeft, Printer, Download } from "lucide-react";

// const PatientDetails = ({ patientId, onBack }) => {
//   // Hardcoded patient data with detailed lab results
//   const patient = {
//     id: "123456789",
//     hn_number: "HN1234567",
//     name: "John Doe",
//     gender: "Male",
//     age: "35",
//     date_of_birth: "1988-05-15",
//     weight: "70",
//     height: "175",
//     bmi: "22.86",
//     systolic: "120",
//     diastolic: "80",
//     doctor: "Dr. Smith",
//     lab_test: "Complete Blood Count",
//     lab_data_status: true,
//     account_status: true,
//     lab_results: [
//       {
//         test_name: "Complete Blood Count (CBC)",
//         order_date: "2023-05-15",
//         items: [
//           { name: "WBC", result: "6.5", unit: "x10³/μL", normal_range: "4.5-11.0", status: "normal" },
//           { name: "RBC", result: "4.7", unit: "x10⁶/μL", normal_range: "4.5-5.9", status: "normal" },
//           { name: "HGB", result: "14.2", unit: "g/dL", normal_range: "13.5-17.5", status: "normal" },
//           { name: "HCT", result: "42.1", unit: "%", normal_range: "40-52", status: "normal" },
//           { name: "MCV", result: "89", unit: "fL", normal_range: "80-100", status: "normal" },
//           { name: "MCH", result: "30", unit: "pg", normal_range: "27-33", status: "normal" },
//           { name: "MCHC", result: "33", unit: "g/dL", normal_range: "31-37", status: "normal" },
//           { name: "PLT", result: "210", unit: "x10³/μL", normal_range: "150-450", status: "normal" },
//           { name: "Neutrophils", result: "55", unit: "%", normal_range: "40-70", status: "normal" },
//           { name: "Lymphocytes", result: "35", unit: "%", normal_range: "20-45", status: "normal" },
//           { name: "Monocytes", result: "6", unit: "%", normal_range: "2-10", status: "normal" },
//           { name: "Eosinophils", result: "3", unit: "%", normal_range: "1-6", status: "normal" },
//           { name: "Basophils", result: "1", unit: "%", normal_range: "0-2", status: "normal" }
//         ]
//       },
//       {
//         test_name: "Basic Metabolic Panel",
//         order_date: "2023-05-15",
//         items: [
//           { name: "Glucose", result: "98", unit: "mg/dL", normal_range: "70-99", status: "normal" },
//           { name: "Calcium", result: "9.2", unit: "mg/dL", normal_range: "8.6-10.2", status: "normal" },
//           { name: "Sodium", result: "140", unit: "mEq/L", normal_range: "135-145", status: "normal" },
//           { name: "Potassium", result: "4.0", unit: "mEq/L", normal_range: "3.5-5.1", status: "normal" },
//           { name: "CO2", result: "26", unit: "mEq/L", normal_range: "23-29", status: "normal" },
//           { name: "Chloride", result: "102", unit: "mEq/L", normal_range: "98-107", status: "normal" },
//           { name: "BUN", result: "14", unit: "mg/dL", normal_range: "7-20", status: "normal" },
//           { name: "Creatinine", result: "0.9", unit: "mg/dL", normal_range: "0.7-1.3", status: "normal" }
//         ]
//       }
//     ]
//   };

//   return (
//     <div className="patient-details-container font-sans">
//       <div className="flex items-center mb-6">
//         <button
//           onClick={onBack}
//           className="flex items-center text-[#3BA092] hover:text-[#2A7E6C] mr-4"
//         >
//           <ChevronLeft size={20} className="mr-1" />
//           Back to Patients
//         </button>
//         <h1 className="text-2xl font-bold text-[#242222]">Patient Details</h1>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h2 className="text-xl font-semibold text-[#242222]">{patient.name}</h2>
//             <p className="text-[#595959]">HN: {patient.hn_number} | Gender: {patient.gender} | Age: {patient.age}</p>
//           </div>
//           <div className="flex space-x-3">
//             <button className="flex items-center px-4 py-2 bg-white border border-[#3BA092] text-[#3BA092] rounded hover:bg-[#E8F9F1]">
//               <Printer size={16} className="mr-2" />
//               Print
//             </button>
//             <button className="flex items-center px-4 py-2 bg-[#3BA092] text-white rounded hover:bg-[#2A7E6C]">
//               <Download size={16} className="mr-2" />
//               Download
//             </button>
//           </div>
//         </div>

//         <div className="space-y-8">
//           {patient.lab_results.map((test, testIndex) => (
//             <div key={testIndex} className="border border-gray-200 rounded-lg p-4">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold text-[#242222]">
//                   {test.test_name}
//                 </h3>
//                 <span className="text-sm text-[#595959]">
//                   Ordered: {test.order_date}
//                 </span>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                         Test Item
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                         Result
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                         Unit
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                         Reference Range
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {test.items.map((item, itemIndex) => (
//                       <tr key={itemIndex}>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
//                           {item.name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#242222]">
//                           {item.result}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
//                           {item.unit}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
//                           {item.normal_range}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
//                             ${item.status === 'normal' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                             {item.status}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PatientDetails;

import React, { useState } from "react";
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

const PatientDetails = ({ patientId, onBack }) => {
  const [expandedTests, setExpandedTests] = useState({});
  const [expandedAppointments, setExpandedAppointments] = useState({
    pending: true,
    completed: true,
    cancelled: true,
  });

  // Toggle lab test expansion
  const toggleTestExpansion = (testIndex) => {
    setExpandedTests((prev) => ({
      ...prev,
      [testIndex]: !prev[testIndex],
    }));
  };

  // Toggle appointment section expansion
  const toggleAppointmentSection = (section) => {
    setExpandedAppointments((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Hardcoded patient data with detailed lab results and appointments
  const patient = {
    id: "123456789",
    hn_number: "HN1234567",
    name: "John Doe",
    gender: "Male",
    age: "35",
    phone_no: "0812345678",
    email: "john.doe@example.com",
    blood_type: "A+",
    date_of_birth: "1988-05-15",
    weight: "70",
    height: "175",
    bmi: "22.86",
    lab_results: [
      {
        test_name: "Complete Blood Count (CBC)",
        order_date: "2023-05-15",
        status: "completed",
        items: [
          {
            name: "WBC",
            result: "6.5",
            unit: "x10³/μL",
            normal_range: "4.5-11.0",
            status: "normal",
          },
          {
            name: "RBC",
            result: "4.7",
            unit: "x10⁶/μL",
            normal_range: "4.5-5.9",
            status: "normal",
          },
          {
            name: "HGB",
            result: "14.2",
            unit: "g/dL",
            normal_range: "13.5-17.5",
            status: "normal",
          },
          {
            name: "HCT",
            result: "42.1",
            unit: "%",
            normal_range: "40-52",
            status: "normal",
          },
          {
            name: "MCV",
            result: "89",
            unit: "fL",
            normal_range: "80-100",
            status: "normal",
          },
          {
            name: "MCH",
            result: "30",
            unit: "pg",
            normal_range: "27-33",
            status: "normal",
          },
          {
            name: "MCHC",
            result: "33",
            unit: "g/dL",
            normal_range: "31-37",
            status: "normal",
          },
          {
            name: "PLT",
            result: "210",
            unit: "x10³/μL",
            normal_range: "150-450",
            status: "normal",
          },
          {
            name: "Neutrophils",
            result: "55",
            unit: "%",
            normal_range: "40-70",
            status: "normal",
          },
          {
            name: "Lymphocytes",
            result: "35",
            unit: "%",
            normal_range: "20-45",
            status: "normal",
          },
          {
            name: "Monocytes",
            result: "6",
            unit: "%",
            normal_range: "2-10",
            status: "normal",
          },
          {
            name: "Eosinophils",
            result: "3",
            unit: "%",
            normal_range: "1-6",
            status: "normal",
          },
          {
            name: "Basophils",
            result: "1",
            unit: "%",
            normal_range: "0-2",
            status: "normal",
          },
        ],
      },
      {
        test_name: "Basic Metabolic Panel",
        order_date: "2023-05-10",
        status: "completed",
        items: [
          {
            name: "Glucose",
            result: "98",
            unit: "mg/dL",
            normal_range: "70-99",
            status: "normal",
          },
          {
            name: "Calcium",
            result: "9.2",
            unit: "mg/dL",
            normal_range: "8.6-10.2",
            status: "normal",
          },
          {
            name: "Sodium",
            result: "140",
            unit: "mEq/L",
            normal_range: "135-145",
            status: "normal",
          },
          {
            name: "Potassium",
            result: "4.0",
            unit: "mEq/L",
            normal_range: "3.5-5.1",
            status: "normal",
          },
          {
            name: "CO2",
            result: "26",
            unit: "mEq/L",
            normal_range: "23-29",
            status: "normal",
          },
          {
            name: "Chloride",
            result: "102",
            unit: "mEq/L",
            normal_range: "98-107",
            status: "normal",
          },
          {
            name: "BUN",
            result: "14",
            unit: "mg/dL",
            normal_range: "7-20",
            status: "normal",
          },
          {
            name: "Creatinine",
            result: "0.9",
            unit: "mg/dL",
            normal_range: "0.7-1.3",
            status: "normal",
          },
        ],
      },
    ],
    appointments: {
      pending: [
        {
          id: "app001",
          date: "2023-06-20",
          time: "10:00 AM",
          doctor: "Dr. Smith",
          department: "Cardiology",
          reason: "Follow-up consultation",
        },
        {
          id: "app002",
          date: "2023-06-25",
          time: "02:30 PM",
          doctor: "Dr. Johnson",
          department: "Radiology",
          reason: "MRI Scan",
        },
      ],
      completed: [
        {
          id: "app003",
          date: "2023-05-15",
          time: "09:15 AM",
          doctor: "Dr. Smith",
          department: "Cardiology",
          reason: "Initial consultation",
          notes: "Prescribed medication, follow-up in 4 weeks",
        },
        {
          id: "app004",
          date: "2023-04-10",
          time: "11:00 AM",
          doctor: "Dr. Lee",
          department: "General Medicine",
          reason: "Annual checkup",
          notes: "All vitals normal, recommended lifestyle changes",
        },
      ],
      cancelled: [
        {
          id: "app005",
          date: "2023-03-05",
          time: "03:45 PM",
          doctor: "Dr. Garcia",
          department: "Dermatology",
          reason: "Skin allergy consultation",
          cancelled_by: "Patient",
          cancellation_reason: "Rescheduled",
        },
      ],
    },
  };

  // Appointment status badge component
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
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: <XCircle size={14} className="mr-1" />,
      },
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig[status].color}`}
      >
        {statusConfig[status].icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

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
        {/* <h1 className="text-2xl font-bold text-[#242222]">Patient Details</h1> */}
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
        {/* Patient Information Section - Added above the Lab Results section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#242222] mb-4 flex items-center">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#969696]">HN Number</p>
                <p className="text-[#595959] font-medium">
                  {patient.hn_number}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Full Name</p>
                <p className="text-[#595959] font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Gender</p>
                <p className="text-[#595959] font-medium">{patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Date of Birth</p>
                <p className="text-[#595959] font-medium">
                  {patient.date_of_birth}
                </p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#969696]">Age</p>
                <p className="text-[#595959] font-medium">
                  {patient.age} years
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Blood Type</p>
                <p className="text-[#595959] font-medium">
                  {patient.blood_type}
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Phone Number</p>
                <p className="text-[#595959] font-medium">{patient.phone_no}</p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Email</p>
                <p className="text-[#595959] font-medium">{patient.email}</p>
              </div>
            </div>

            {/* Column 3 - Health Metrics */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#969696]">Weight</p>
                <p className="text-[#595959] font-medium">
                  {patient.weight} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">Height</p>
                <p className="text-[#595959] font-medium">
                  {patient.height} cm
                </p>
              </div>
              <div>
                <p className="text-sm text-[#969696]">BMI</p>
                <p className="text-[#595959] font-medium">{patient.bmi}</p>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-[#969696] mr-2">BMI Status:</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    parseFloat(patient.bmi) < 18.5
                      ? "bg-blue-100 text-blue-800"
                      : parseFloat(patient.bmi) < 25
                      ? "bg-green-100 text-green-800"
                      : parseFloat(patient.bmi) < 30
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {parseFloat(patient.bmi) < 18.5
                    ? "Underweight"
                    : parseFloat(patient.bmi) < 25
                    ? "Normal"
                    : parseFloat(patient.bmi) < 30
                    ? "Overweight"
                    : "Obese"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lab Results Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-[#242222] mb-4 flex items-center">
            <Calendar size={20} className="mr-2 text-[#3BA092]" />
            Lab Results
          </h2>

          {patient.lab_results.length === 0 ? (
            <p className="text-gray-500">No lab results available</p>
          ) : (
            <div className="space-y-4">
              {patient.lab_results.map((test, testIndex) => (
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
                        {test.test_name}
                      </span>
                      <StatusBadge status={test.status} />
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-[#595959] mr-3">
                        Ordered: {test.order_date}
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
                            {test.items.map((item, itemIndex) => (
                              <tr key={itemIndex}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                                  {item.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#242222]">
                                  {item.result}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                                  {item.unit}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                                  {item.normal_range}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${
                                      item.status === "normal"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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

          {/* Pending Appointments */}
          <div className="mb-6">
            <button
              className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleAppointmentSection("pending")}
            >
              <div className="flex items-center">
                <span className="font-medium text-[#242222]">
                  Pending ({patient.appointments.pending.length})
                </span>
              </div>
              {expandedAppointments.pending ? (
                <ChevronUp size={18} className="text-[#595959]" />
              ) : (
                <ChevronDown size={18} className="text-[#595959]" />
              )}
            </button>

            {expandedAppointments.pending && (
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                {patient.appointments.pending.length === 0 ? (
                  <p className="p-4 text-gray-500">No pending appointments</p>
                ) : (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                          Reason
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.appointments.pending.map(
                        (appointment, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.date} at {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.doctor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.department}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#595959]">
                              {appointment.reason}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* Completed Appointments */}
          <div className="mb-6">
            <button
              className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleAppointmentSection("completed")}
            >
              <div className="flex items-center">
                <span className="font-medium text-[#242222]">
                  Completed ({patient.appointments.completed.length})
                </span>
              </div>
              {expandedAppointments.completed ? (
                <ChevronUp size={18} className="text-[#595959]" />
              ) : (
                <ChevronDown size={18} className="text-[#595959]" />
              )}
            </button>

            {expandedAppointments.completed && (
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                {patient.appointments.completed.length === 0 ? (
                  <p className="p-4 text-gray-500">No completed appointments</p>
                ) : (
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
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                          Notes
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.appointments.completed.map(
                        (appointment, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.date} at {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.doctor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.department}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#595959]">
                              {appointment.notes}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>

          {/* Cancelled Appointments */}
          <div>
            <button
              className="w-full flex justify-between items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-t-lg"
              onClick={() => toggleAppointmentSection("cancelled")}
            >
              <div className="flex items-center">
                <span className="font-medium text-[#242222]">
                  Cancelled ({patient.appointments.cancelled.length})
                </span>
              </div>
              {expandedAppointments.cancelled ? (
                <ChevronUp size={18} className="text-[#595959]" />
              ) : (
                <ChevronDown size={18} className="text-[#595959]" />
              )}
            </button>

            {expandedAppointments.cancelled && (
              <div className="border border-gray-200 rounded-b-lg overflow-hidden">
                {patient.appointments.cancelled.length === 0 ? (
                  <p className="p-4 text-gray-500">No cancelled appointments</p>
                ) : (
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
                          Reason
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-[#595959] uppercase tracking-wider">
                          Cancellation Details
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patient.appointments.cancelled.map(
                        (appointment, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.date} at {appointment.time}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.doctor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[#595959]">
                              {appointment.reason}
                            </td>
                            <td className="px-6 py-4 text-sm text-[#595959]">
                              <p>Cancelled by: {appointment.cancelled_by}</p>
                              <p>Reason: {appointment.cancellation_reason}</p>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
