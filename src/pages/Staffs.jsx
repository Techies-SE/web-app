// import React, { useState, useEffect } from 'react';
// import { Search, Filter, ChevronUp, ChevronDown, Send, Clock, CheckCircle2, Eye, X } from 'lucide-react';

// const Recommendations = () => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showDetailModal, setShowDetailModal] = useState(false);
//   const [selectedRecommendation, setSelectedRecommendation] = useState(null);
//   const [activeTab, setActiveTab] = useState('pending');
//   const itemsPerPage = 10;
//   const [sortConfig, setSortConfig] = useState({
//     key: "hn_number",
//     direction: "ascending",
//   });

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const fetchRecommendations = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:3000/recommendations');
//       const result = await response.json();
      
//       if (result.success) {
//         setRecommendations(result.data);
//       } else {
//         setError(result.message || 'Failed to fetch recommendations');
//       }
//     } catch (err) {
//       setError('Network error when fetching recommendations');
//       console.error('Error fetching recommendations:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredByStatus = recommendations.filter(item => {
//     if (activeTab === 'pending') return item.status === 'pending';
//     if (activeTab === 'sent') return item.status === 'sent';
//     if (activeTab === 'approved') return item.status === 'approved';
//     return true;
//   });

//   const sortedData = React.useMemo(() => {
//     let sortableItems = [...filteredByStatus];
//     sortableItems.sort((a, b) => {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];
//       if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
//       return 0;
//     });
//     return sortableItems;
//   }, [filteredByStatus, sortConfig]);

//   const filteredData = sortedData.filter(
//     (item) =>
//       item.hn_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.lab_test_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const handleSort = (column) => {
//     let direction = "ascending";
//     if (sortConfig.key === column && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key: column, direction });
//   };

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const truncateText = (text, maxLength = 60) => {
//     if (!text) return '';
//     return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
//   };

//   const renderPagination = () => {
//     const maxPagesToShow = 5;
//     let pages = [];

//     if (totalPages <= maxPagesToShow) {
//       pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//     } else {
//       if (currentPage <= 3) {
//         pages = [1, 2, 3, "...", totalPages];
//       } else if (currentPage >= totalPages - 2) {
//         pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
//       } else {
//         pages = [
//           1,
//           "...",
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           "...",
//           totalPages,
//         ];
//       }
//     }

//     return pages.map((page, index) =>
//       page === "..." ? (
//         <span key={index} className="pagination-dots">
//           ...
//         </span>
//       ) : (
//         <button
//           key={page}
//           onClick={() => handlePageChange(page)}
//           className={`pButton ${currentPage === page ? "active" : ""}`}
//         >
//           {page}
//         </button>
//       )
//     );
//   };
  
//   const handleSendRecommendation = async (recommendationId) => {
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
//         // Update status in state
//         setRecommendations(
//           recommendations.map(item => 
//             item.recommendation_id === recommendationId 
//               ? {...item, status: "sent"} 
//               : item
//           )
//         );
//         alert('Recommendation sent successfully');
//       } else {
//         alert(`Failed to send: ${result.message}`);
//       }
//     } catch (err) {
//       console.error('Error sending recommendation:', err);
//       alert('Network error when sending recommendation');
//     }
//   };

//   const handleViewDetails = (recommendation) => {
//     setSelectedRecommendation(recommendation);
//     setShowDetailModal(true);
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

//   if (loading) {
//     return <div className="table-container p-6 font-sans flex justify-center items-center h-64">Loading recommendations...</div>;
//   }

//   if (error) {
//     return <div className="table-container p-6 font-sans flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
//   }

//   return (
//     <div className="table-container p-6 font-sans">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-black">Patient Recommendations</h1>
//         <div className="flex gap-4">
//           <button className="uButton" onClick={fetchRecommendations}>
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center mb-6">
//         <div className="flex items-center border border-gray-300 rounded-full w-[200px] h-8 px-3 py-2 mr-4 bg-[#E8F9F1]">
//           <Search size={18} className="text-[#3BA092]" />
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="ml-2 outline-none bg-transparent w-full placeholder-[#969696] text-[#969696]"
//           />
//         </div>
//         <button className="flex items-center bg-transparent border rounded-full border-[#3BA092] w-[158px] h-8 px-4 py-2 rounded hover:bg-gray-50 text-xs text-[#969696]">
//           <Filter size={18} className="mr-2 text-[#3BA092]" /> Filter by Date
//         </button>
//       </div>

//       {/* Status Tabs */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'pending' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
//           onClick={() => {
//             setActiveTab('pending');
//             setCurrentPage(1);
//           }}
//         >
//           Pending
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'sent' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
//           onClick={() => {
//             setActiveTab('sent');
//             setCurrentPage(1);
//           }}
//         >
//           Sent
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'approved' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
//           onClick={() => {
//             setActiveTab('approved');
//             setCurrentPage(1);
//           }}
//         >
//           Approved
//         </button>
//       </div>

//       <div className="table-wrapper">
//         <table className="table-content">
//           <thead>
//             <tr className="hover:bg-gray-50 bg-gray-100 text-[#242222]">
//               {[
//                 { key: "hn_number", label: "HN", width: "10%" },
//                 { key: "patient_name", label: "Patient Name", width: "15%" },
//                 { key: "doctor_name", label: "Doctor", width: "15%" },
//                 { key: "lab_test_name", label: "Lab Test", width: "15%" },
//                 { key: "generated_recommendation", label: "Recommendations", width: "25%" },
//                 { key: "status", label: "Status", width: "10%" },
//               ].map((column) => (
//                 <th
//                   key={column.key}
//                   onClick={() => handleSort(column.key)}
//                   className="p-4 text-center cursor-pointer hover:bg-gray-200"
//                   style={{ width: column.width }}
//                 >
//                   <div className="flex items-center justify-between">
//                     {column.label}
//                     {sortConfig.key === column.key &&
//                       (sortConfig.direction === "ascending" ? (
//                         <ChevronUp size={16} className="ml-1 text-[#595959]" />
//                       ) : (
//                         <ChevronDown size={16} className="ml-1 text-[#595959]" />
//                       ))}
//                   </div>
//                 </th>
//               ))}
//               <th className="p-4 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center p-8 text-gray-500">
//                   No {activeTab} recommendations found.
//                 </td>
//               </tr>
//             ) : (
//               currentItems.map((item, index) => (
//                 <tr
//                   key={index}
//                   className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300"
//                 >
//                   <td className="p-4 text-start text-[#595959]">{item.hn_number}</td>
//                   <td className="p-4 text-start text-[#595959]">{item.patient_name}</td>
//                   <td className="p-4 text-start text-[#595959]">{item.doctor_name}</td>
//                   <td className="p-4 text-start text-[#595959]">{item.lab_test_name}</td>
//                   <td className="p-4 text-start text-[#595959]">
//                     {truncateText(item.generated_recommendation)}
//                   </td>
//                   <td className="p-4 text-start">
//                     <StatusIcon status={item.status} />
//                   </td>
//                   <td className="p-4 flex items-center space-x-3">
//                     <Eye
//                       size={20}
//                       className="cursor-pointer text-[#3BA092] hover:text-[#2A7E6C]"
//                       onClick={() => handleViewDetails(item)}
//                       title="View Details"
//                     />
//                     {item.status === 'pending' && (
//                       <Send
//                         size={20}
//                         className="cursor-pointer text-blue-500 hover:text-blue-700"
//                         onClick={() => handleSendRecommendation(item.recommendation_id)}
//                         title="Send Recommendation"
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end mt-6 gap-2">
//         <button
//           onClick={() => handlePageChange(1)}
//           disabled={currentPage === 1}
//           className="pButton"
//         >
//           First
//         </button>
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="pButton"
//         >
//           Previous
//         </button>
//         {renderPagination()}
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="pButton"
//         >
//           Next
//         </button>
//         <button
//           onClick={() => handlePageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           className="pButton"
//         >
//           Last
//         </button>
//       </div>

//       {showDetailModal && selectedRecommendation && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header text-[#242222]">
//               <h2>Recommendation Details</h2>
//               <button onClick={() => setShowDetailModal(false)} className="close-btn">
//                 <X size={16} />
//               </button>
//             </div>
//             <div className="modal-content p-4">
//               <div className="mb-4">
//                 <p className="font-bold text-[#242222]">HN Number</p>
//                 <p className="text-[#595959]">{selectedRecommendation.hn_number}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="font-bold text-[#242222]">Patient Name</p>
//                 <p className="text-[#595959]">{selectedRecommendation.patient_name}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="font-bold text-[#242222]">Doctor</p>
//                 <p className="text-[#595959]">{selectedRecommendation.doctor_name}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="font-bold text-[#242222]">Lab Test</p>
//                 <p className="text-[#595959]">{selectedRecommendation.lab_test_name}</p>
//               </div>
//               <div className="mb-4">
//                 <p className="font-bold text-[#242222]">Status</p>
//                 <p><StatusIcon status={selectedRecommendation.status} /></p>
//               </div>
//               <div className="mb-4">
//                 <p className="font-bold text-[#242222]">Full Recommendation</p>
//                 <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200 text-[#595959]">
//                   {selectedRecommendation.generated_recommendation}
//                 </div>
//               </div>
              
//               {selectedRecommendation.status === 'pending' && (
//                 <div className="mt-6 flex justify-end">
//                   <button 
//                     onClick={() => {
//                       handleSendRecommendation(selectedRecommendation.recommendation_id);
//                       setShowDetailModal(false);
//                     }}
//                     className="submit-btn flex items-center justify-center"
//                   >
//                     <Send size={16} className="mr-2" /> Send Recommendation
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Recommendations;
// import React, { useState, useEffect } from 'react';
// import { Search, Filter, ChevronUp, ChevronDown, Send, Clock, CheckCircle2, Eye } from 'lucide-react';
// import RecommendationDetails from './RecommendationDetails';

// const Recommendations = () => {
//   const [recommendations, setRecommendations] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('pending');
//   const [viewingDetails, setViewingDetails] = useState(false);
//   const [selectedRecommendationId, setSelectedRecommendationId] = useState(null);
  
//   const itemsPerPage = 10;
//   const [sortConfig, setSortConfig] = useState({
//     key: "hn_number",
//     direction: "ascending",
//   });

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const fetchRecommendations = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://localhost:3000/recommendations');
//       const result = await response.json();
      
//       if (result.success) {
//         setRecommendations(result.data);
//       } else {
//         setError(result.message || 'Failed to fetch recommendations');
//       }
//     } catch (err) {
//       setError('Network error when fetching recommendations');
//       console.error('Error fetching recommendations:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredByStatus = recommendations.filter(item => {
//     if (activeTab === 'pending') return item.status === 'pending';
//     if (activeTab === 'sent') return item.status === 'sent';
//     if (activeTab === 'approved') return item.status === 'approved';
//     return true;
//   });

//   const sortedData = React.useMemo(() => {
//     let sortableItems = [...filteredByStatus];
//     sortableItems.sort((a, b) => {
//       const aValue = a[sortConfig.key];
//       const bValue = b[sortConfig.key];
//       if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
//       if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
//       return 0;
//     });
//     return sortableItems;
//   }, [filteredByStatus, sortConfig]);

//   const filteredData = sortedData.filter(
//     (item) =>
//       item.hn_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.lab_test_name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage);

//   const handleSort = (column) => {
//     let direction = "ascending";
//     if (sortConfig.key === column && sortConfig.direction === "ascending") {
//       direction = "descending";
//     }
//     setSortConfig({ key: column, direction });
//   };

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   const truncateText = (text, maxLength = 60) => {
//     if (!text) return '';
//     return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
//   };

//   const renderPagination = () => {
//     const maxPagesToShow = 5;
//     let pages = [];

//     if (totalPages <= maxPagesToShow) {
//       pages = Array.from({ length: totalPages }, (_, i) => i + 1);
//     } else {
//       if (currentPage <= 3) {
//         pages = [1, 2, 3, "...", totalPages];
//       } else if (currentPage >= totalPages - 2) {
//         pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
//       } else {
//         pages = [
//           1,
//           "...",
//           currentPage - 1,
//           currentPage,
//           currentPage + 1,
//           "...",
//           totalPages,
//         ];
//       }
//     }

//     return pages.map((page, index) =>
//       page === "..." ? (
//         <span key={index} className="px-2 text-gray-500">
//           ...
//         </span>
//       ) : (
//         <button
//           key={page}
//           onClick={() => handlePageChange(page)}
//           className={`pButton ${
//             currentPage === page
//               ? "bg-blue-600 text-white"
//               : "bg-blue-500 text-white hover:bg-blue-600"
//           }`}
//         >
//           {page}
//         </button>
//       )
//     );
//   };
  
//   const handleSendRecommendation = async (recommendationId) => {
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
//         // Update status in state
//         setRecommendations(
//           recommendations.map(item => 
//             item.recommendation_id === recommendationId 
//               ? {...item, status: "sent"} 
//               : item
//           )
//         );
//         alert('Recommendation sent successfully');
//       } else {
//         alert(`Failed to send: ${result.message}`);
//       }
//     } catch (err) {
//       console.error('Error sending recommendation:', err);
//       alert('Network error when sending recommendation');
//     }
//   };

//   const handleViewDetails = (recommendation) => {
//     setSelectedRecommendationId(recommendation.recommendation_id);
//     setViewingDetails(true);
//   };

//   const handleBackToList = () => {
//     setViewingDetails(false);
//     setSelectedRecommendationId(null);
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

//   if (loading) {
//     return <div className="table-container p-6 font-sans flex justify-center items-center h-64">Loading recommendations...</div>;
//   }

//   if (error) {
//     return <div className="table-container p-6 font-sans flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
//   }

//   if (viewingDetails) {
//     return (
//       <RecommendationDetails 
//         recommendationId={selectedRecommendationId} 
//         onBack={handleBackToList}
//       />
//     );
//   }

//   return (
//     <div className="table-container p-6 font-sans">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-black">Patient Recommendations</h1>
//         <div className="flex gap-4">
//           <button className="uButton" onClick={fetchRecommendations}>
//             Refresh
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center mb-6">
//         <div className="flex items-center border border-gray-300 rounded-full w-[200px] h-8 px-3 py-2 mr-4 bg-[#E8F9F1]">
//           <Search size={18} className="text-[#3BA092]" />
//           <input
//             type="text"
//             placeholder="Search"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="ml-2 outline-none bg-transparent w-full placeholder-[#969696] text-[#969696]"
//           />
//         </div>
//         <button className="flex items-center bg-transparent border rounded-full border-[#3BA092] w-[158px] h-8 px-4 py-2 rounded hover:bg-gray-50 text-xs text-[#969696]">
//           <Filter size={18} className="mr-2 text-[#3BA092]" /> Filter by Date
//         </button>
//       </div>

//       {/* Status Tabs */}
//       <div className="flex border-b border-gray-200 mb-6">
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'pending' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
//           onClick={() => {
//             setActiveTab('pending');
//             setCurrentPage(1);
//           }}
//         >
//           Pending
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'sent' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
//           onClick={() => {
//             setActiveTab('sent');
//             setCurrentPage(1);
//           }}
//         >
//           Sent
//         </button>
//         <button
//           className={`py-2 px-4 font-medium text-sm ${activeTab === 'approved' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
//           onClick={() => {
//             setActiveTab('approved');
//             setCurrentPage(1);
//           }}
//         >
//           Approved
//         </button>
//       </div>

//       <div className="table-wrapper">
//         <table className="table-content">
//           <thead>
//             <tr className="hover:bg-gray-50 bg-gray-100 text-[#242222]">
//               {[
//                 { key: "hn_number", label: "HN", width: "10%" },
//                 { key: "patient_name", label: "Patient Name", width: "15%" },
//                 { key: "doctor_name", label: "Doctor", width: "15%" },
//                 { key: "lab_test_name", label: "Lab Test", width: "15%" },
//                 { key: "generated_recommendation", label: "Recommendations", width: "25%" },
//                 { key: "status", label: "Status", width: "10%" },
//               ].map((column) => (
//                 <th
//                   key={column.key}
//                   onClick={() => handleSort(column.key)}
//                   className="p-4 text-center cursor-pointer hover:bg-gray-200"
//                   style={{ width: column.width }}
//                 >
//                   <div className="flex items-center justify-between">
//                     {column.label}
//                     {sortConfig.key === column.key &&
//                       (sortConfig.direction === "ascending" ? (
//                         <ChevronUp size={16} className="ml-1 text-[#595959]" />
//                       ) : (
//                         <ChevronDown size={16} className="ml-1 text-[#595959]" />
//                       ))}
//                   </div>
//                 </th>
//               ))}
//               <th className="p-4 text-left">Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.length === 0 ? (
//               <tr>
//                 <td colSpan="7" className="text-center p-8 text-gray-500">
//                   No {activeTab} recommendations found.
//                 </td>
//               </tr>
//             ) : (
//               currentItems.map((item, index) => (
//                 <tr
//                   key={index}
//                   className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300"
//                 >
//                   <td className="p-4 text-start text-[#595959]">{item.hn_number}</td>
//                   <td className="p-4 text-start text-[#595959]">{item.patient_name}</td>
//                   <td className="p-4 text-start text-[#595959]">{item.doctor_name}</td>
//                   <td className="p-4 text-start text-[#595959]">{item.lab_test_name}</td>
//                   <td className="p-4 text-start text-[#595959]">
//                     {truncateText(item.generated_recommendation)}
//                   </td>
//                   <td className="p-4 text-start">
//                     <StatusIcon status={item.status} />
//                   </td>
//                   <td className="p-4 flex items-center space-x-3">
//                     <Eye
//                       size={20}
//                       className="cursor-pointer text-[#3BA092] hover:text-[#2A7E6C]"
//                       onClick={() => handleViewDetails(item)}
//                       title="View Details"
//                     />
//                     {item.status === 'pending' && (
//                       <Send
//                         size={20}
//                         className="cursor-pointer text-blue-500 hover:text-blue-700"
//                         onClick={() => handleSendRecommendation(item.recommendation_id)}
//                         title="Send Recommendation"
//                       />
//                     )}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-end mt-6 gap-2">
//         <button
//           onClick={() => handlePageChange(1)}
//           disabled={currentPage === 1}
//           className="pButton"
//         >
//           First
//         </button>
//         <button
//           onClick={() => handlePageChange(currentPage - 1)}
//           disabled={currentPage === 1}
//           className="pButton"
//         >
//           Previous
//         </button>
//         {renderPagination()}
//         <button
//           onClick={() => handlePageChange(currentPage + 1)}
//           disabled={currentPage === totalPages}
//           className="pButton"
//         >
//           Next
//         </button>
//         <button
//           onClick={() => handlePageChange(totalPages)}
//           disabled={currentPage === totalPages}
//           className="pButton"
//         >
//           Last
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Recommendations;

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Send,
  Clock,
  CheckCircle2,
  Eye
} from 'lucide-react';
import RecommendationDetails from './RecommendationDetails';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [viewingDetails, setViewingDetails] = useState(false);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState(null);
  
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "hn_number",
    direction: "ascending",
  });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/recommendations');
      const result = await response.json();
      
      if (result.success) {
        setRecommendations(result.data);
      } else {
        setError(result.message || 'Failed to fetch recommendations');
      }
    } catch (err) {
      setError('Network error when fetching recommendations');
      console.error('Error fetching recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredByStatus = recommendations.filter(item => {
    if (activeTab === 'pending') return item.status === 'pending';
    if (activeTab === 'sent') return item.status === 'sent';
    if (activeTab === 'approved') return item.status === 'approved';
    return true;
  });

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredByStatus];
    sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [filteredByStatus, sortConfig]);

  const filteredData = sortedData.filter(
    (item) =>
      item.hn_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.lab_test_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleSort = (column) => {
    let direction = "ascending";
    if (sortConfig.key === column && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key: column, direction });
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const truncateText = (text, maxLength = 60) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const renderPagination = () => {
    const maxPagesToShow = 5;
    let pages = [];

    if (totalPages <= maxPagesToShow) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        pages = [1, 2, 3, "...", totalPages];
      } else if (currentPage >= totalPages - 2) {
        pages = [1, "...", totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="px-2 text-gray-500">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`pButton ${
            currentPage === page
              ? "bg-blue-600 text-white"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {page}
        </button>
      )
    );
  };
  
  const handleSendRecommendation = async (recommendationId) => {
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
        setRecommendations(
          recommendations.map(item => 
            item.recommendation_id === recommendationId 
              ? {...item, status: "sent"} 
              : item
          )
        );
        alert('Recommendation sent successfully');
      } else {
        alert(`Failed to send: ${result.message}`);
      }
    } catch (err) {
      console.error('Error sending recommendation:', err);
      alert('Network error when sending recommendation');
    }
  };

  const handleViewDetails = (recommendation) => {
    setSelectedRecommendationId(recommendation.recommendation_id);
    setViewingDetails(true);
  };

  const handleBackToList = () => {
    setViewingDetails(false);
    setSelectedRecommendationId(null);
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

  if (loading) {
    return <div className="table-container p-6 font-sans flex justify-center items-center h-64">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="table-container p-6 font-sans flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
  }

  if (viewingDetails) {
    return (
      <RecommendationDetails 
        recommendationId={selectedRecommendationId} 
        onBack={handleBackToList}
      />
    );
  }

  return (
    <div className="table-container p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black">Patient Recommendations</h1>
        <div className="flex gap-4">
          <button className="uButton" onClick={fetchRecommendations}>
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="flex items-center border border-gray-300 rounded-full w-[200px] h-8 px-3 py-2 mr-4 bg-[#E8F9F1]">
          <Search size={18} className="text-[#3BA092]" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 outline-none bg-transparent w-full placeholder-[#969696] text-[#969696]"
          />
        </div>
        <button className="flex items-center bg-transparent border rounded-full border-[#3BA092] w-[158px] h-8 px-4 py-2 rounded hover:bg-gray-50 text-xs text-[#969696]">
          <Filter size={18} className="mr-2 text-[#3BA092]" /> Filter by Date
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'pending' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('pending');
            setCurrentPage(1);
          }}
        >
          Pending
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'sent' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('sent');
            setCurrentPage(1);
          }}
        >
          Sent
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'approved' ? 'text-[#3BA092] border-b-2 border-[#3BA092]' : 'text-gray-500'}`}
          onClick={() => {
            setActiveTab('approved');
            setCurrentPage(1);
          }}
        >
          Approved
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table-content">
          <thead>
            <tr className="hover:bg-gray-50 bg-gray-100 text-[#242222]">
              {[
                { key: "hn_number", label: "HN", width: "10%" },
                { key: "patient_name", label: "Patient Name", width: "15%" },
                { key: "doctor_name", label: "Doctor", width: "15%" },
                { key: "lab_test_name", label: "Lab Test", width: "15%" },
                { key: "generated_recommendation", label: "Recommendations", width: "25%" },
                { key: "status", label: "Status", width: "10%" },
              ].map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column.key)}
                  className="p-4 text-center cursor-pointer hover:bg-gray-200"
                  style={{ width: column.width }}
                >
                  <div className="flex items-center justify-between">
                    {column.label}
                    {sortConfig.key === column.key &&
                      (sortConfig.direction === "ascending" ? (
                        <ChevronUp size={16} className="ml-1 text-[#595959]" />
                      ) : (
                        <ChevronDown size={16} className="ml-1 text-[#595959]" />
                      ))}
                  </div>
                </th>
              ))}
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  No {activeTab} recommendations found.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300"
                >
                  <td className="p-4 text-start text-[#595959]">{item.hn_number}</td>
                  <td className="p-4 text-start text-[#595959]">{item.patient_name}</td>
                  <td className="p-4 text-start text-[#595959]">{item.doctor_name}</td>
                  <td className="p-4 text-start text-[#595959]">{item.lab_test_name}</td>
                  <td className="p-4 text-start text-[#595959]">
                    {truncateText(item.generated_recommendation)}
                  </td>
                  <td className="p-4 text-start">
                    <StatusIcon status={item.status} />
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    <Eye
                      size={20}
                      className="cursor-pointer text-[#3BA092] hover:text-[#2A7E6C]"
                      onClick={() => handleViewDetails(item)}
                      title="View Details"
                    />
                    {item.status === 'pending' && (
                      <Send
                        size={20}
                        className="cursor-pointer text-blue-500 hover:text-blue-700"
                        onClick={() => handleSendRecommendation(item.recommendation_id)}
                        title="Send Recommendation"
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6 gap-2">
        <button
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          className="pButton"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pButton"
        >
          Previous
        </button>
        {renderPagination()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pButton"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pButton"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Recommendations;