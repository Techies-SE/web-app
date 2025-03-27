import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  X,
  ChevronUp,
  ChevronDown,
  Eye,
  Trash2,
} from "lucide-react";
import { createPortal } from "react-dom";

const Doctors = ({setSelectedDoctorId}) => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    phone_no: "",
    email: "",
    password: "",
    specialization: "",
    status: "",
    department_id: "",
  });
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });
  const [popupIndex, setPopupIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "doctor_name",
    direction: "ascending",
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close popup if click is not within the popup
      if (!event.target.closest(".action-popup")) {
        setPopupIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/doctors-with-departments")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched doctors:", data);
        setDoctors(data);
      })
      .catch((error) => console.error("Error fetching doctors data:", error));
  }, []);

  const handleInputChange = (e) => {
    setNewDoctor({ ...newDoctor, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/doctors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDoctor),
    })
      .then((response) => response.json())
      .then(() => {
        // ✅ Fetch the latest doctors-with-departments data
        return fetch("http://localhost:3000/doctors-with-departments");
      })
      .then((response) => response.json())
      .then((updatedData) => {
        setDoctors(updatedData); // ✅ Update doctors list
        setShowModal(false); // ✅ Close modal
        setNewDoctor({
          name: "",
          phone_no: "",
          email: "",
          password: "",
          specialization: "",
          status: "active",
          department_id: 1,
        });
      })
      .catch((error) => console.error("Error adding doctor:", error));
  };

  // Sorting function
  const sortedDoctors = React.useMemo(() => {
    let sortableDoctors = [...doctors];
    sortableDoctors.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
    return sortableDoctors;
  }, [doctors, sortConfig]);

  const filteredDoctors = sortedDoctors.filter(
    (doctor) =>
      doctor.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.doctor_specialization
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Calculate the current patients to display
  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

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
    const maxPagesToShow = 5; // Number of pages to show at once
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
        <span key={index} className="pagination-dots">
          ...
        </span>
      ) : (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`pButton ${currentPage === page ? "active" : ""}`}
        >
          {page}
        </button>
      )
    );
  };

  // Handle outside click to close the action popup
  const handleClickOutside = (event) => {
    if (
      !event.target.closest(".action-popup") &&
      !event.target.closest(".action-icon")
    ) {
      setPopupIndex(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleViewDetails = (doctor) => {
    //navigate(`/doctors/${doctor.doctor_id}/details`);
    setSelectedDoctorId(doctor.doctor_id);
  };

  // Function to delete a delete by id
  const handleDeleteDoctor = (doctorID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this patient?\nYOU CANNOT UNDO THIS ACTION"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/doctors/${doctorID}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setDoctors(doctors.filter((doctor) => doctor.doctor_id !== doctorID));
        alert("Doctor deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting doctor:", error);
        alert("Failed to delete doctor.");
      });
  };

  return (
    <div className="table-container p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black">Doctor Info</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowModal(true)} className="uButton">
            + New Doctor
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

      <div className="table-wrapper">
        <table className="table-content">
          <thead>
            <tr className="hover:bg-gray-50 bg-gray-100 text-[#242222]">
              {[
                { key: "doctor_name", label: "Doctor Name", width: "15%" },
                {
                  key: "doctor_specialization",
                  label: "Specialization",
                  width: "15%",
                },
                { key: "department", label: "Department", width: "15%" },
                { key: "doctor_phone_no", label: "Phone Number", width: "15%" },
                { key: "doctor_email", label: "Email Address", width: "20%" },
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
                        <ChevronDown
                          size={16}
                          className="ml-1 text-[#595959]"
                        />
                      ))}
                  </div>
                </th>
              ))}
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentDoctors.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-8 text-gray-500">
                  There's no doctor yet.
                </td>
              </tr>
            ) : (
              currentDoctors.map((doctor, index) => (
                <tr
                  key={doctor.doctor_id}
                  className={`
                   hover:bg-gray-50 transition-colors duration-150
                   border-b border-gray-300
                  
                `}
                >
                  <td className="p-4 text-start text-[#595959]">
                    {doctor.doctor_name}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {doctor.doctor_specialization}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {doctor.department}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {doctor.doctor_phone_no}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {doctor.doctor_email}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {doctor.status}
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    <Eye
                      size={20}
                      className="cursor-pointer text-[#3BA092] hover:text-[#2A7E6C]"
                      onClick={() => handleViewDetails(doctor)}
                      title="View Details"
                    />
                    <Trash2
                      size={20}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteDoctor(doctor.doctor_id)}
                      title="Delete Doctor"
                    />
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
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header text-[#242222]">
              <h2>Create New Doctor</h2>
              <button onClick={() => setShowModal(false)} className="close-btn">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="modal-form">
              <div className="form-group text-[#242222]">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newDoctor.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter doctor's name"
                />
              </div>
              <div className="form-group text-[#242222]">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone_no"
                  value={newDoctor.phone_no}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter phone number"
                />
              </div>
              <div className="form-group text-[#242222]">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={newDoctor.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group text-[#242222]">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={newDoctor.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter password"
                />
              </div>
              <div className="form-group text-[#242222]">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={newDoctor.specialization}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter specialization"
                />
              </div>
              <div className="form-group text-[#242222]">
                <label>Status</label>
                <select
                  name="status"
                  value={newDoctor.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
              {/* <div className="form-group">
              <label>Department</label>
              <select
                name="department_id"
                value={newDoctor.department_id}
                onChange={(e) => setNewDoctor({ ...newDoctor, department_id: Number(e.target.value) })}
                required
              >
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    Department {num + 1}
                  </option>
                ))}
              </select>
            </div> */}
              <div className="form-group text-[#242222]">
                <label>Department</label>
                <select
                  name="department_id"
                  value={newDoctor.department_id}
                  onChange={(e) =>
                    setNewDoctor({
                      ...newDoctor,
                      department_id: e.target.value
                        ? Number(e.target.value)
                        : "",
                    })
                  }
                  required
                >
                  <option value="">Select Department</option>
                  {[...Array(10).keys()].map((num) => (
                    <option key={num + 1} value={num + 1}>
                      Department {num + 1}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="submit-btn">
                Create Doctor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
