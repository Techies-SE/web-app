import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, Send, Clock, CheckCircle2 } from 'lucide-react';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const response = await fetch('http://localhost:3000/recommendations/pending-recommendations');
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

  const sortedData = React.useMemo(() => {
    let sortableItems = [...recommendations];
    sortableItems.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortableItems;
  }, [recommendations, sortConfig]);

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
          className={`px-3 py-1 mx-1 rounded ${
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
        // Update status in state
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

  const StatusIcon = ({ status }) => {
    return status === "sent" ? (
      <div className="flex justify-center" title="Recommendation Sent">
        <CheckCircle2 size={20} className="text-green-600" />
      </div>
    ) : (
      <div className="flex justify-center" title="Pending">
        <Clock size={20} className="text-amber-600" />
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="table-container font-sans p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black text-2xl font-semibold">Patient Recommendations</h1>
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

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
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
                  className="p-4 text-left cursor-pointer hover:bg-gray-200"
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
              <th className="p-4 text-center" style={{ width: "10%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  No recommendations available.
                </td>
              </tr>
            ) : (
              currentItems.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300"
                >
                  <td className="p-4 text-[#595959]">{item.hn_number}</td>
                  <td className="p-4 text-[#595959]">{item.patient_name}</td>
                  <td className="p-4 text-[#595959]">{item.doctor_name}</td>
                  <td className="p-4 text-[#595959]">{item.lab_test_name}</td>
                  <td className="p-4 text-[#595959]">
                    <div className="tooltip-container relative group cursor-pointer">
                      <div>{truncateText(item.generated_recommendation)}</div>
                      <div className="tooltip-text absolute hidden group-hover:block bg-gray-800 text-white p-2 rounded shadow-lg z-10 w-64 left-0 top-full">
                        {item.generated_recommendation}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <StatusIcon status={item.status} />
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleSendRecommendation(item.recommendation_id)}
                      disabled={item.status === "sent"}
                      className={`p-2 rounded-full ${
                        item.status === "sent" 
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                      title={item.status === "sent" ? "Already sent" : "Send recommendation"}
                    >
                      <Send size={18} />
                    </button>
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
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        {renderPagination()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Last
        </button>
      </div>
    </div>
  );
};

export default Recommendations;