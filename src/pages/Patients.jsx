import React, { useEffect, useState } from "react";
import { Search, Filter, MoreVertical, X, ChevronUp, ChevronDown, CheckCircle2, Clock, UserCheck, UserX } from "lucide-react";

const Patients = ({ onNavigateToDetails = () => {} }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [uploadType, setUploadType] = useState("");
  const [file, setFile] = useState(null);
  const [popupIndex, setPopupIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "hn_number",
    direction: "ascending",
  });

  useEffect(() => {
    fetch("http://localhost:3000/patients")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched patients:", data);
        setPatients(data);
      })
      .catch((error) => console.error("Error fetching patients:", error));
  }, []);

  const sortedPatients = React.useMemo(() => {
    let sortablePatients = [...patients];
    sortablePatients.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sortablePatients;
  }, [patients, sortConfig]);

  const filteredPatients = sortedPatients.filter(
    (patient) =>
      patient.hn_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

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
        pages = [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
      }
    }

    return pages.map((page, index) =>
      page === "..." ? (
        <span key={index} className="px-2 text-gray-500">...</span>
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

  const handleOpenPopUp = (type) => {
    setUploadType(type);
    setShowUploadPopup(true);
    setFile(null);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    const endpoint =
      uploadType === "lab"
        ? "http://localhost:3000/upload/lab-data"
        : "http://localhost:3000/upload/patients";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      alert(result || "Upload successful!");

      if (uploadType === "lab" && result.patientId) {
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient.id === result.patientId
              ? { ...patient, lab_data_status: true }
              : patient
          )
        );
      }

      setShowUploadPopup(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
    }
  };

  const handleClickOutside = (event) => {
    if (
      !event.target.closest("[data-action-popup]") &&
      !event.target.closest("[data-action-icon]")
    ) {
      setPopupIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleViewDetails = (patient) => {
    onNavigateToDetails(patient.id);
  };

  const handleDeletePatient = (patientId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?\nYOU CANNOT UNDO THIS ACTION"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/patients/${patientId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setPatients(patients.filter((patient) => patient.id !== patientId));
        alert("Patient deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient.");
      });
  };

  const StatusIcon = ({ type, status }) => {
    if (type === 'lab') {
      return status ? (
        <div className="flex justify-center" title="Lab Data Uploaded">
          <CheckCircle2 size={20} className="text-green-600" />
        </div>
      ) : (
        <div className="flex justify-center" title="Lab Data Pending">
          <Clock size={20} className="text-amber-600" />
        </div>
      );
    } else {
      return status ? (
        <div className="flex justify-center" title="Account Activated">
          <UserCheck size={20} className="text-green-600" />
        </div>
      ) : (
        <div className="flex justify-center" title="Account Not Activated">
          <UserX size={20} className="text-red-600" />
        </div>
      );
    }
  };

  return (
    <div className="table-container p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patient Info</h1>
        <div className="flex gap-4">
          <button
            onClick={() => handleOpenPopUp("lab")}
            // className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            className="uButton"
          >
            + Lab Data
          </button>
          <button
            onClick={() => handleOpenPopUp("patient")}
            // className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            className="uButton"
          >
            + New Patient
          </button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="flex items-center border border-gray-300 rounded px-3 py-2 mr-4">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-2 outline-none"
          />
        </div>
        <button className="flex items-center bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
          <Filter size={18} className="mr-2" /> Filter by Date
        </button>
      </div>

      <div className="table-wrapper">
        <table className="table-content">
          <thead>
            <tr className="hover:bg-gray-50 bg-gray-100">
              {["hn_number", "name", "phone_no", "lab_data_status", "account_status"].map(
                (column) => (
                  <th
                    key={column}
                    onClick={() => handleSort(column)}
                    className="p-4 text-center border-b cursor-pointer hover:bg-gray-200"
                  >
                    <div className="flex items-center justify-center">
                      {column.replace(/_/g, " ")}
                      {sortConfig.key === column && (
                        sortConfig.direction === "ascending" ? (
                          <ChevronUp size={16} className="ml-1" />
                        ) : (
                          <ChevronDown size={16} className="ml-1" />
                        )
                      )}
                    </div>
                  </th>
                )
              )}
              <th className="p-4 text-left border-b">action</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-8 text-gray-500"
                >
                  There's no patient yet.
                </td>
              </tr>
            ) : (
              currentPatients.map((patient, index) => (
                <tr key={patient.id} className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                  hover:bg-blue-50 transition-colors duration-150
                `}>
                  <td className="p-4 text-center">{patient.hn_number}</td>
                  <td className="p-4 text-center">{patient.name}</td>
                  <td className="p-4 text-center">{patient.phone_no}</td>
                  <td className="p-4 text-center">
                  <StatusIcon type="lab" status={patient.lab_data_status} />
                  </td>
                  <td className="p-4 text-center">
                  <StatusIcon type="account" status={patient.account_status} />
                  </td>
                  <td className="p-4 relative">
                 
                      <MoreVertical
                        size={18}
                        data-action-icon
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopupIndex(popupIndex === index ? null : index);
                        }}
                      />
                 
                    {popupIndex === index && (
                      <div
                        data-action-popup
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                      >
                        <button
                          onClick={() => handleViewDetails(patient)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete Data
                        </button>
                      </div>
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
        //   className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        className="pButton"
        >
          First
        </button>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        //   className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        className = "pButton"
        >
          Previous
        </button>
        {renderPagination()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        //   className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        className="pButton"
        >
          Next
        </button>
        <button
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        //   className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        className="pButton"
        >
          Last
        </button>
      </div>

      {showUploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {uploadType === "lab" ? "Upload Lab Records" : "Upload Patient Data"}
              </h2>
              <button
                onClick={() => setShowUploadPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                {uploadType === "lab"
                  ? "Select a CSV file to upload lab records. Ensure the format is correct before proceeding."
                  : "Select a CSV file to upload patient records. Ensure the format is correct before proceeding."}
              </p>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="w-full border p-2 rounded"
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleUpload}
                className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
              >
                Upload
              </button>
              <button
                onClick={() => setShowUploadPopup(false)}
                className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

