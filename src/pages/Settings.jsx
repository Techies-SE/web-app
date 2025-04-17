import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Eye,
  Trash2,
  X
} from "lucide-react";

const Settings = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    status: "active"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const departmentsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "ascending",
  });

  // Sample staff counts for departments
  const staffCounts = {
    "Cardiology": 15,
    "Neurology": 12,
    "Pulmonology": 8,
    "Gastroenterology": 10,
    "Endocrinology": 7,
    "Nephrology": 9,
    "Hematology": 6,
    "Rheumatology": 8,
    "Dermatology": 11,
    "Psychiatry": 14
  };

  // Sample descriptions for departments
  const descriptions = {
    "Cardiology": "Diagnosis and treatment of heart diseases",
    "Neurology": "Diagnosis and treatment of nervous system disorders",
    "Pulmonology": "Treatment of respiratory tract diseases",
    "Gastroenterology": "Diagnosis of digestive system disorders",
    "Endocrinology": "Treatment of hormone-related conditions",
    "Nephrology": "Diagnosis and treatment of kidney diseases",
    "Hematology": "Study and treatment of blood disorders",
    "Rheumatology": "Treatment of autoimmune diseases",
    "Dermatology": "Diagnosis and treatment of skin conditions",
    "Psychiatry": "Treatment of mental health disorders"
  };

  useEffect(() => {
    // Fetch departments
    fetch("http://localhost:3000/departments")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched departments:", data);
        // Add description and staff count to each department
        const enhancedData = data.map(department => ({
          ...department,
          description: descriptions[department.name] || "Department description",
          staff_count: staffCounts[department.name] || Math.floor(Math.random() * 15) + 5,
          status: "active"
        }));
        setDepartments(enhancedData);
      })
      .catch((error) => console.error("Error fetching departments data:", error));
  }, []);

  const handleInputChange = (e) => {
    setNewDepartment({ ...newDepartment, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/departments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDepartment.name, image: null }),
    })
      .then((response) => response.json())
      .then((createdDepartment) => {
        // Add the new department with enhanced data
        const enhancedDepartment = {
          ...createdDepartment,
          description: newDepartment.description,
          staff_count: Math.floor(Math.random() * 15) + 5,
          status: newDepartment.status
        };
        setDepartments([...departments, enhancedDepartment]);
        setShowModal(false);
        setNewDepartment({
          name: "",
          description: "",
          status: "active"
        });
      })
      .catch((error) => console.error("Error adding department:", error));
  };

  // Sorting function
  const sortedDepartments = React.useMemo(() => {
    let sortableDepartments = [...departments];
    sortableDepartments.sort((a, b) => {
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
    return sortableDepartments;
  }, [departments, sortConfig]);

  const filteredDepartments = sortedDepartments.filter(
    (department) =>
      department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      department.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate the current departments to display
  const indexOfLastDepartment = currentPage * departmentsPerPage;
  const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;
  const currentDepartments = filteredDepartments.slice(
    indexOfFirstDepartment,
    indexOfLastDepartment
  );
  const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

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

  const handleViewDetails = (department) => {
    console.log("View details for department:", department);
    // You would implement navigation or modal to show details
  };

  const handleDeleteDepartment = (departmentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this department?\nYOU CANNOT UNDO THIS ACTION"
    );
    if (!confirmDelete) return;

    fetch(`http://localhost:3000/departments/${departmentId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        setDepartments(departments.filter((dept) => dept.id !== departmentId));
        alert("Department deleted successfully.");
      })
      .catch((error) => {
        console.error("Error deleting department:", error);
        alert("Failed to delete department.");
      });
  };

  return (
    <div className="table-container p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black">Department Info</h1>
        <div className="flex gap-4">
          <button onClick={() => setShowModal(true)} className="uButton">
            + New Department
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
                { key: "name", label: "Department Name", width: "20%" },
                { key: "description", label: "Description", width: "30%" },
                { key: "staff_count", label: "Staff Count", width: "15%" },
                { key: "status", label: "Status", width: "15%" },
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
            {currentDepartments.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-8 text-gray-500">
                  There's no department yet.
                </td>
              </tr>
            ) : (
              currentDepartments.map((department) => (
                <tr
                  key={department.id}
                  className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-300"
                >
                  <td className="p-4 text-start text-[#595959]">
                    {department.name}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {department.description}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {department.staff_count}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {department.status}
                  </td>
                  <td className="p-4 flex items-center space-x-3">
                    <Eye
                      size={20}
                      className="cursor-pointer text-[#3BA092] hover:text-[#2A7E6C]"
                      onClick={() => handleViewDetails(department)}
                      title="View Details"
                    />
                    <Trash2
                      size={20}
                      className="cursor-pointer text-red-500 hover:text-red-700"
                      onClick={() => handleDeleteDepartment(department.id)}
                      title="Delete Department"
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
              <h2>Create New Department</h2>
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
                  value={newDepartment.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter department name"
                />
              </div>
              <div className="form-group text-[#242222]">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={newDepartment.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter department description"
                />
              </div>
              <div className="form-group text-[#242222]">
                <label>Status</label>
                <select
                  name="status"
                  value={newDepartment.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
              </div>
              <button type="submit" className="submit-btn">
                Create Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;