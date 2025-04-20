// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { ArrowLeft, Send, Clock, CheckCircle2 } from 'lucide-react';

// const RecommendationDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [recommendation, setRecommendation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSending, setIsSending] = useState(false);

//   useEffect(() => {
//     const fetchRecommendationDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/recommendations/${id}`);
//         const result = await response.json();
        
//         if (response.ok) {
//           setRecommendation(result);
//         } else {
//           setError(result.error || 'Recommendation not found');
//         }
//       } catch (err) {
//         setError('Failed to fetch recommendation details');
//         console.error('Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecommendationDetails();
//   }, [id]);

//   const handleSendRecommendation = async () => {
//     setIsSending(true);
//     try {
//       const response = await fetch('http://localhost:3000/recommendations/send-recommendation', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           recommendationId: id
//         }),
//       });
      
//       const result = await response.json();
      
//       if (result.success) {
//         // Update status locally
//         setRecommendation(prev => ({
//           ...prev,
//           status: "sent"
//         }));
//         alert('Recommendation sent successfully');
//       } else {
//         alert(`Failed to send: ${result.message}`);
//       }
//     } catch (err) {
//       console.error('Error sending recommendation:', err);
//       alert('Network error when sending recommendation');
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const StatusIcon = ({ status }) => {
//     switch (status) {
//       case "sent":
//         return (
//           <span className="flex items-center text-blue-600">
//             <Send size={16} className="mr-1" /> Sent
//           </span>
//         );
//       case "approved":
//         return (
//           <span className="flex items-center text-green-600">
//             <CheckCircle2 size={16} className="mr-1" /> Approved
//           </span>
//         );
//       default:
//         return (
//           <span className="flex items-center text-amber-600">
//             <Clock size={16} className="mr-1" /> Pending
//           </span>
//         );
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return <div className="p-6 font-sans flex justify-center items-center h-64">Loading recommendation details...</div>;
//   }

//   if (error) {
//     return <div className="p-6 font-sans flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
//   }

//   if (!recommendation) {
//     return <div className="p-6 font-sans flex justify-center items-center h-64">Recommendation not found</div>;
//   }

//   return (
//     <div className="p-6 font-sans max-w-6xl mx-auto">
//       <button 
//         onClick={() => navigate(-1)}
//         className="flex items-center text-[#3BA092] mb-6 hover:text-[#2A7E6C]"
//       >
//         <ArrowLeft size={20} className="mr-2" /> Back to Recommendations
//       </button>

//       <div className="bg-white rounded-lg shadow-md p-6">
//         <div className="flex justify-between items-start mb-6">
//           <h1 className="text-2xl font-bold text-[#242222]">Recommendation Details</h1>
//           <div className="flex items-center">
//             <span className="mr-2 font-medium">Status:</span>
//             <StatusIcon status={recommendation.status} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//           {/* Patient Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h2 className="text-lg font-semibold text-[#242222] mb-4 border-b pb-2">Patient Information</h2>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">HN Number</p>
//                 <p className="text-[#595959]">{recommendation.patient.hn_number}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Name</p>
//                 <p className="text-[#595959]">{recommendation.patient.name}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Phone</p>
//                 <p className="text-[#595959]">{recommendation.patient.phone_no}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Citizen ID</p>
//                 <p className="text-[#595959]">{recommendation.patient.citizen_id}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Account Status</p>
//                 <p className="text-[#595959]">
//                   {recommendation.patient.account_status ? 'Active' : 'Inactive'}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Doctor Information */}
//           <div className="bg-gray-50 p-4 rounded-lg">
//             <h2 className="text-lg font-semibold text-[#242222] mb-4 border-b pb-2">Doctor Information</h2>
//             <div className="space-y-3">
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Name</p>
//                 <p className="text-[#595959]">{recommendation.doctor.name}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Specialization</p>
//                 <p className="text-[#595959]">{recommendation.doctor.specialization}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Department</p>
//                 <p className="text-[#595959]">{recommendation.doctor.department_name}</p>
//               </div>
//               <div>
//                 <p className="text-sm font-medium text-gray-500">Contact</p>
//                 <p className="text-[#595959]">{recommendation.doctor.phone_no} | {recommendation.doctor.email}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Lab Test Results */}
//         <div className="bg-gray-50 p-4 rounded-lg mb-8">
//           <h2 className="text-lg font-semibold text-[#242222] mb-4 border-b pb-2">Lab Test Results</h2>
//           <div className="mb-4">
//             <p className="text-sm font-medium text-gray-500">Test Name</p>
//             <p className="text-[#595959] mb-2">{recommendation.lab_test.test_name}</p>
//             <p className="text-sm font-medium text-gray-500">Test Date</p>
//             <p className="text-[#595959]">{formatDate(recommendation.lab_test.lab_test_date)}</p>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-100">
//                 <tr>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Test Item</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Normal Range</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recommendation.lab_results.map((result, index) => (
//                   <tr key={index}>
//                     <td className="px-4 py-2 text-sm text-[#595959]">{result.lab_item_name}</td>
//                     <td className="px-4 py-2 text-sm text-[#595959]">{result.lab_item_value}</td>
//                     <td className="px-4 py-2 text-sm text-[#595959]">{result.unit}</td>
//                     <td className="px-4 py-2 text-sm text-[#595959]">{result.normal_range}</td>
//                     <td className="px-4 py-2 text-sm">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                         result.lab_item_status === 'normal' 
//                           ? 'bg-green-100 text-green-800' 
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {result.lab_item_status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recommendations */}
//         <div className="bg-gray-50 p-4 rounded-lg mb-8">
//           <h2 className="text-lg font-semibold text-[#242222] mb-4 border-b pb-2">AI Generated Recommendations</h2>
//           <div className="prose max-w-none" dangerouslySetInnerHTML={{ 
//             __html: recommendation.generated_recommendation.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
//                                                           .replace(/\*(.*?)\*/g, '<li>$1</li>')
//                                                           .replace(/\n/g, '<br />') 
//           }} />
//         </div>

//         {recommendation.doctor_recommendation && (
//           <div className="bg-gray-50 p-4 rounded-lg mb-8">
//             <h2 className="text-lg font-semibold text-[#242222] mb-4 border-b pb-2">Doctor's Additional Recommendations</h2>
//             <p className="text-[#595959]">{recommendation.doctor_recommendation}</p>
//           </div>
//         )}

//         {/* Action Buttons */}
//         {recommendation.status === 'pending' && (
//           <div className="flex justify-end mt-6">
//             <button 
//               onClick={handleSendRecommendation}
//               disabled={isSending}
//               className="bg-[#3BA092] hover:bg-[#2A7E6C] text-white font-medium py-2 px-4 rounded-md flex items-center"
//             >
//               {isSending ? (
//                 'Sending...'
//               ) : (
//                 <>
//                   <Send size={16} className="mr-2" /> Send Recommendation
//                 </>
//               )}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RecommendationDetails;

// import React, { useState, useEffect } from 'react';
// import { ArrowLeft, Send, Clock, CheckCircle2 } from 'lucide-react';

// const RecommendationDetails = ({ recommendationId, onBack }) => {
//   const [recommendation, setRecommendation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSending, setIsSending] = useState(false);

//   useEffect(() => {
//     const fetchRecommendationDetails = async () => {
//       try {
//         const response = await fetch(`http://localhost:3000/recommendations/${recommendationId}`);
//         const result = await response.json();
        
//         if (response.ok) {
//           setRecommendation(result);
//         } else {
//           setError(result.error || 'Recommendation not found');
//         }
//       } catch (err) {
//         setError('Failed to fetch recommendation details');
//         console.error('Error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRecommendationDetails();
//   }, [recommendationId]);

//   const handleSendRecommendation = async () => {
//     setIsSending(true);
//     try {
//       const response = await fetch('http://localhost:3000/recommendations/send-recommendation', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           recommendationId: recommendationId
//         }),
//       });
      
//       const result = await response.json();
      
//       if (result.success) {
//         setRecommendation(prev => ({
//           ...prev,
//           status: "sent"
//         }));
//         alert('Recommendation sent successfully');
//       } else {
//         alert(`Failed to send: ${result.message}`);
//       }
//     } catch (err) {
//       console.error('Error sending recommendation:', err);
//       alert('Network error when sending recommendation');
//     } finally {
//       setIsSending(false);
//     }
//   };

//   const StatusIcon = ({ status }) => {
//     switch (status) {
//       case "sent":
//         return (
//           <span className="flex items-center text-blue-600">
//             <Send size={16} className="mr-1" /> Sent
//           </span>
//         );
//       case "approved":
//         return (
//           <span className="flex items-center text-green-600">
//             <CheckCircle2 size={16} className="mr-1" /> Approved
//           </span>
//         );
//       default:
//         return (
//           <span className="flex items-center text-amber-600">
//             <Clock size={16} className="mr-1" /> Pending
//           </span>
//         );
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return <div className="table-container font-sans flex justify-center items-center h-64">Loading recommendation details...</div>;
//   }

//   if (error) {
//     return <div className="table-container font-sans flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
//   }

//   if (!recommendation) {
//     return <div className="table-container font-sans flex justify-center items-center h-64">Recommendation not found</div>;
//   }

//   return (
//     <div className="table-container font-sans">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-black">Recommendation Details</h1>
//         <button onClick={onBack} className="cancel-button">
//           Back to List
//         </button>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm p-6">
//         {/* Patient Information */}
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
//             Patient Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="font-medium text-sm text-[#595959]">HN Number</p>
//               <p className="text-[#242222]">{recommendation.patient.hn_number}</p>
//             </div>
//             <div>
//               <p className="font-medium text-sm text-[#595959]">Name</p>
//               <p className="text-[#242222]">{recommendation.patient.name}</p>
//             </div>
//             <div>
//               <p className="font-medium text-sm text-[#595959]">Gender</p>
//               <p className="text-[#242222]">{recommendation.patient.data.gender}</p>
//             </div>
//             <div>
//               <p className="font-medium text-sm text-[#595959]">Age</p>
//               <p className="text-[#242222]">{recommendation.patient.data.age}</p>
//             </div>
//             <div>
//               <p className="font-medium text-sm text-[#595959]">Blood Type</p>
//               <p className="text-[#242222]">{recommendation.patient.data.blood_type}</p>
//             </div>
//             <div>
//               <p className="font-medium text-sm text-[#595959]">BMI</p>
//               <p className="text-[#242222]">{recommendation.patient.data.bmi}</p>
//             </div>
//           </div>
//         </div>

//         {/* Doctor Information */}
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
//             Doctor Information
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="font-medium text-sm text-[#595959]">Doctor</p>
//               <p className="text-[#242222]">{recommendation.doctor.name}</p>
//             </div>
//             <div>
//               <p className="font-medium text-sm text-[#595959]">Specialization</p>
//               <p className="text-[#242222]">{recommendation.doctor.specialization}</p>
//             </div>
//             <div>
//               <p className="font-medium text-sm text-[#595959]">Department</p>
//               <p className="text-[#242222]">{recommendation.doctor.department}</p>
//             </div>
//           </div>
//         </div>

//         {/* Lab Test Information */}
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
//             Lab Test Information
//           </h2>
//           <div className="mb-4">
//             <p className="font-medium text-sm text-[#595959]">Test Name</p>
//             <p className="text-[#242222]">{recommendation.lab_test.test_name}</p>
//           </div>
          
//           <h3 className="font-medium text-sm text-[#595959] mb-2">Lab Results</h3>
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white">
//               <thead>
//                 <tr className="bg-gray-100 text-[#242222]">
//                   <th className="py-2 px-4 text-left">Test Item</th>
//                   <th className="py-2 px-4 text-left">Value</th>
//                   <th className="py-2 px-4 text-left">Normal Range</th>
//                   <th className="py-2 px-4 text-left">Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {recommendation.lab_results.map((result, index) => (
//                   <tr key={index} className="border-b border-gray-200">
//                     <td className="py-2 px-4">{result.lab_item_name}</td>
//                     <td className="py-2 px-4">{result.lab_item_value} {result.unit}</td>
//                     <td className="py-2 px-4">{result.normal_range}</td>
//                     <td className="py-2 px-4">{result.lab_item_status}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Recommendation */}
//         <div className="mb-8">
//           <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
//             Recommendation
//           </h2>
//           <div className="mb-4">
//             <p className="font-medium text-sm text-[#595959]">Status</p>
//             <div className="mt-1">
//               <StatusIcon status={recommendation.status} />
//             </div>
//           </div>
//           <div className="mb-4">
//             <p className="font-medium text-sm text-[#595959]">AI Recommendation</p>
//             <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 text-[#242222]">
//               {recommendation.generated_recommendation}
//             </div>
//           </div>
//           {recommendation.doctor_recommendation && (
//             <div className="mb-4">
//               <p className="font-medium text-sm text-[#595959]">Doctor's Notes</p>
//               <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 text-[#242222]">
//                 {recommendation.doctor_recommendation}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Actions */}
//         <div className="flex justify-end space-x-3">
//           {recommendation.status === 'pending' && (
//             <button
//               onClick={handleSendRecommendation}
//               className={`bg-[#3BA092] hover:bg-[#2A7E6C] text-white font-medium py-2 px-4 rounded-md flex items-center ${
//                 isSending ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               disabled={isSending}
//             >
//               {isSending ? (
//                 'Sending...'
//               ) : (
//                 <>
//                   <Send size={16} className="mr-2" /> Send Recommendation
//                 </>
//               )}
//             </button>
//           )}
//           <button onClick={onBack} className="cancel-button">
//             Back to List
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RecommendationDetails;

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Clock, CheckCircle2 } from 'lucide-react';

const RecommendationDetails = ({ recommendationId, onBack }) => {
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchRecommendationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/recommendations/${recommendationId}`);
        const result = await response.json();
        
        if (response.ok) {
          setRecommendation(result);
        } else {
          setError(result.error || 'Recommendation not found');
        }
      } catch (err) {
        setError('Failed to fetch recommendation details');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendationDetails();
  }, [recommendationId]);

  const handleSendRecommendation = async () => {
    setIsSending(true);
    try {
      const response = await fetch('http://localhost:3000/recommendations/send-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recommendationId: recommendationId
        }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setRecommendation(prev => ({
          ...prev,
          status: "sent"
        }));
        alert('Recommendation sent successfully');
      } else {
        alert(`Failed to send: ${result.message}`);
      }
    } catch (err) {
      console.error('Error sending recommendation:', err);
      alert('Network error when sending recommendation');
    } finally {
      setIsSending(false);
    }
  };

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "sent":
        return (
          <span className="flex items-center text-blue-600">
            <Send size={16} className="mr-1" /> Sent
          </span>
        );
      case "approved":
        return (
          <span className="flex items-center text-green-600">
            <CheckCircle2 size={16} className="mr-1" /> Approved
          </span>
        );
      default:
        return (
          <span className="flex items-center text-amber-600">
            <Clock size={16} className="mr-1" /> Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="table-container font-sans flex justify-center items-center h-64">Loading recommendation details...</div>;
  }

  if (error) {
    return <div className="table-container font-sans flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
  }

  if (!recommendation) {
    return <div className="table-container font-sans flex justify-center items-center h-64">Recommendation not found</div>;
  }

  // Safely access nested properties
  const patientData = recommendation.patient?.data || {};
  const labResults = recommendation.lab_results || [];

  return (
    <div className="table-container font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black">Recommendation Details</h1>
        <button onClick={onBack} className="cancel-button">
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Patient Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-sm text-[#595959]">HN Number</p>
              <p className="text-[#242222]">{recommendation.patient?.hn_number || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-[#595959]">Name</p>
              <p className="text-[#242222]">{recommendation.patient?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-[#595959]">Gender</p>
              <p className="text-[#242222]">{patientData.gender || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-[#595959]">Age</p>
              <p className="text-[#242222]">{patientData.age || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-[#595959]">Blood Type</p>
              <p className="text-[#242222]">{patientData.blood_type || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-[#595959]">BMI</p>
              <p className="text-[#242222]">{patientData.bmi || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Doctor Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
            Doctor Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-sm text-[#595959]">Doctor</p>
              <p className="text-[#242222]">{recommendation.doctor?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-[#595959]">Specialization</p>
              <p className="text-[#242222]">{recommendation.doctor?.specialization || 'N/A'}</p>
            </div>
            <div>
              <p className="font-medium text-sm text-[#595959]">Department</p>
              <p className="text-[#242222]">{recommendation.doctor?.department || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Lab Test Information */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
            Lab Test Information
          </h2>
          <div className="mb-4">
            <p className="font-medium text-sm text-[#595959]">Test Name</p>
            <p className="text-[#242222] mb-2">{recommendation.lab_test?.test_name || 'N/A'}</p>
            <p className="font-medium text-sm text-[#595959]">Test Date</p>
            <p className="text-[#242222]">{formatDate(recommendation.lab_test?.lab_test_date)}</p>
          </div>
          
          <h3 className="font-medium text-sm text-[#595959] mb-2">Lab Results</h3>
          {labResults.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100 text-[#242222]">
                    <th className="py-2 px-4 text-left">Test Item</th>
                    <th className="py-2 px-4 text-left">Value</th>
                    <th className="py-2 px-4 text-left">Normal Range</th>
                    <th className="py-2 px-4 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {labResults.map((result, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-4">{result.lab_item_name || 'N/A'}</td>
                      <td className="py-2 px-4">{result.lab_item_value || 'N/A'} {result.unit || ''}</td>
                      <td className="py-2 px-4">{result.normal_range || 'N/A'}</td>
                      <td className="py-2 px-4">{result.lab_item_status || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No lab results available</p>
          )}
        </div>

        {/* Recommendation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-[#242222] border-b pb-2">
            Recommendation
          </h2>
          <div className="mb-4">
            <p className="font-medium text-sm text-[#595959]">Status</p>
            <div className="mt-1">
              <StatusIcon status={recommendation.status} />
            </div>
          </div>
          <div className="mb-4">
            <p className="font-medium text-sm text-[#595959]">AI Recommendation</p>
            <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 text-[#242222]">
              {recommendation.generated_recommendation || 'No recommendation available'}
            </div>
          </div>
          {recommendation.doctor_recommendation && (
            <div className="mb-4">
              <p className="font-medium text-sm text-[#595959]">Doctor's Notes</p>
              <div className="mt-1 p-3 bg-gray-50 rounded border border-gray-200 text-[#242222]">
                {recommendation.doctor_recommendation}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          {recommendation.status === 'pending' && (
            <button
              onClick={handleSendRecommendation}
              className={`bg-[#3BA092] hover:bg-[#2A7E6C] text-white font-medium py-2 px-4 rounded-md flex items-center ${
                isSending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSending}
            >
              {isSending ? (
                'Sending...'
              ) : (
                <>
                  <Send size={16} className="mr-2" /> Send Recommendation
                </>
              )}
            </button>
          )}
          <button onClick={onBack} className="cancel-button">
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDetails;