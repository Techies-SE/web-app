import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  X,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  Clock,
  UserCheck,
  UserX,
} from "lucide-react";
import { createPortal } from "react-dom";

const LabDataUploadPopup = ({ show, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [singleLabData, setSingleLabData] = useState({
    hn_number: "",
    gender: "",
    blood_type: "",
    age: "",
    date_of_birth: "",
    weight: "",
    height: "",
    bmi: "",
    systolic: "",
    diastolic: "",
    order_date: "",
  });

  // Reset all fields when popup is shown
  useEffect(() => {
    if (show) {
      // Reset file
      setFile(null);
      setUploadError("");
      setIsUploading(false);
      const fileInput = document.getElementById("labFileUpload");
      if (fileInput) fileInput.value = "";

      // Reset form fields
      setSingleLabData({
        hn_number: "",
        gender: "",
        blood_type: "",
        age: "",
        date_of_birth: "",
        weight: "",
        height: "",
        bmi: "",
        systolic: "",
        diastolic: "",
        order_date: "",
      });
    }
  }, [show]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        setUploadError("Only CSV files are supported.");
        return;
      }
      setFile(selectedFile);
      setUploadError("");
      setSingleLabData({
        hn_number: "",
        gender: "",
        blood_type: "",
        age: "",
        date_of_birth: "",
        weight: "",
        height: "",
        bmi: "",
        systolic: "",
        diastolic: "",
        order_date: "",
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadError("");
    const fileInput = document.getElementById("labFileUpload");
    if (fileInput) fileInput.value = "";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv") {
      setFile(droppedFile);
      setUploadError("");
      setSingleLabData({
        hn_number: "",
        gender: "",
        blood_type: "",
        age: "",
        date_of_birth: "",
        weight: "",
        height: "",
        bmi: "",
        systolic: "",
        diastolic: "",
        order_date: "",
      });
    } else {
      setUploadError("Only CSV files are supported.");
    }
  };

  const handleSingleLabDataChange = (e) => {
    const { name, value } = e.target;
    if (file) setFile(null);

    // Calculate BMI if weight or height changes
    if (name === "weight" || name === "height") {
      const weight =
        name === "weight"
          ? parseFloat(value)
          : parseFloat(singleLabData.weight);
      const height =
        name === "height"
          ? parseFloat(value)
          : parseFloat(singleLabData.height);

      if (weight && height) {
        const heightInMeters = height / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
        setSingleLabData((prev) => ({
          ...prev,
          [name]: value,
          bmi: bmi,
        }));
      } else {
        setSingleLabData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setSingleLabData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBulkUpload = async () => {
    if (!file) {
      setUploadError("Please select a file first.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file); // Changed from "csvFile" to "file"

    try {
      const response = await fetch(
        "http://localhost:3000/bulk/upload-lab-results",
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Upload failed");
      }

      alert(result.message || "Upload successful!");
      onUpload(result);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadError(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSingleLabDataSubmit = async () => {
    // Validate HN number format
    if (!/^\d{9}$/.test(singleLabData.hn_number)) {
      alert("HN Number must be exactly 9 digits.");
      return;
    }

    // Validate required fields
    const requiredFields = [
      "hn_number",
      "gender",
      "blood_type",
      "age",
      "date_of_birth",
      "weight",
      "height",
      "systolic",
      "diastolic",
      "order_date",
    ];
    const missingFields = requiredFields.filter(
      (field) => !singleLabData[field]
    );

    if (missingFields.length > 0) {
      alert(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    setIsUploading(true);
    try {
      const response = await fetch("http://localhost:3000/lab-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(singleLabData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to create lab data");
      }

      alert("Lab data created successfully!");
      onUpload(result);
      onClose();
    } catch (error) {
      console.error("Error creating lab data:", error);
      alert("Failed to create lab data: " + (error.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  if (!show) return null;

  const isFormFilled = Object.values(singleLabData).some(
    (value) => value !== ""
  );

  return (
    <div className="modal-container1">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add Lab Data</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Bulk Upload Section */}
          <div className="container1">
            <h3 className="text-lg font-semibold mb-3 text-[#242222]">
              Bulk Upload
            </h3>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } ${file || isFormFilled ? "opacity-50 cursor-not-allowed" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="mb-2 text-[#969696]">
                📁 Drop your CSV file here or
              </p>
              <button
                className="browse-button"
                onClick={() => document.getElementById("labFileUpload").click()}
                disabled={isFormFilled}
              >
                Browse Files
              </button>
              <input
                id="labFileUpload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={isFormFilled}
              />
              {file && (
                <div className="mt-2">
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-green-600 text-sm">{file.name}</p>
                    <button
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: CSV with columns for hn_number, lab_item_name,
              and lab_item_value
            </p>

            {uploadError && (
              <div className="mt-2 text-red-500 text-sm">{uploadError}</div>
            )}
          </div>

          {/* <div className="text-center mb-4">
            <span className="text-sm text-gray-500">OR</span>
          </div> */}

          {/* Single Lab Data Form - unchanged from your original code */}
          {/* <div className="container1">
            <h3 className="text-lg font-semibold mb-3 text-[#242222]">
              Add Single Lab Data
            </h3>
            <div
              className={`space-y-3 ${
                file ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HN Number
                </label>
                <input
                  type="text"
                  name="hn_number"
                  placeholder="Enter HN Number"
                  value={singleLabData.hn_number}
                  onChange={handleSingleLabDataChange}
                  className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                  disabled={!!file}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={singleLabData.gender}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm text-[#969696]"
                    disabled={!!file}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Type
                  </label>
                  <select
                    name="blood_type"
                    value={singleLabData.blood_type}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm text-[#969696]"
                    disabled={!!file}
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    placeholder="Enter Age"
                    value={singleLabData.age}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                    disabled={!!file}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={singleLabData.date_of_birth}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm text-[#969696]"
                    disabled={!!file}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    name="weight"
                    placeholder="Enter Weight"
                    value={singleLabData.weight}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                    disabled={!!file}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    name="height"
                    placeholder="Enter Height"
                    value={singleLabData.height}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                    disabled={!!file}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    BMI
                  </label>
                  <input
                    type="text"
                    name="bmi"
                    placeholder="Auto-calculated"
                    value={singleLabData.bmi}
                    className="w-full p-2 border rounded-md text-sm bg-gray-100 placeholder-[#969696] text-[#969696]"
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Systolic Pressure
                  </label>
                  <input
                    type="number"
                    name="systolic"
                    placeholder="Enter Systolic"
                    value={singleLabData.systolic}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                    disabled={!!file}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diastolic Pressure
                  </label>
                  <input
                    type="number"
                    name="diastolic"
                    placeholder="Enter Diastolic"
                    value={singleLabData.diastolic}
                    onChange={handleSingleLabDataChange}
                    className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                    disabled={!!file}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Date
                </label>
                <input
                  type="date"
                  name="order_date"
                  value={singleLabData.order_date}
                  onChange={handleSingleLabDataChange}
                  className="w-full p-2 border rounded-md text-sm text-[#969696]"
                  disabled={!!file}
                />
              </div>
            </div>
          </div> */}
        </div>

        {/* Footer */}
        {/*border-t*/}
        <div className="p-4 flex justify-end space-x-3">
          {file ? (
            <button
              onClick={handleBulkUpload}
              className={`bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-600 ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload CSV"}
            </button>
          ) : isFormFilled ? (
            <button
              onClick={handleSingleLabDataSubmit}
              className={`bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-600 ${
                isUploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Add Lab Data"}
            </button>
          ) : null}
          <button
            onClick={onClose}
            className="cancel-button"
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const PatientUploadPopup = ({ show, onClose, onUpload }) => {
  const [file, setFile] = useState(null);
  const [singlePatient, setSinglePatient] = useState({
    hn_number: "",
    name: "",
    citizen_id: "",
    phone_no: "",
    doctor_id: "",
    lab_test_master_id: "",
  });
  const [doctors, setDoctors] = useState([]);
  const [labTests, setLabTests] = useState([]);
  const [isDragActive, setIsDragActive] = useState(false);

  // Fetch doctors when the component mounts
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("http://localhost:3000/doctors"); // Fetching doctors from the API
        if (!response.ok) throw new Error("Failed to fetch doctors"); // Error handling for failed fetch
        const data = await response.json(); // Parsing the response to JSON
        setDoctors(data); // Setting the fetched doctors to state
      } catch (error) {
        console.error("Error fetching doctors:", error); // Logging any errors
      }
    };

    const fetchLabTests = async () => {
      try {
        const response = await fetch("http://localhost:3000/lab-tests");
        if (!response.ok) throw new Error("Failed to fetch lab tests");
        const data = await response.json();
        setLabTests(data);
      } catch (error) {
        console.error("Error fetching lab tests:", error);
      }
    };

    fetchDoctors(); // Call the fetch function when the component mounts
    fetchLabTests();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Reset all fields when popup is shown
  useEffect(() => {
    if (show) {
      // Reset file
      setFile(null);
      const fileInput = document.getElementById("fileUpload");
      if (fileInput) fileInput.value = "";

      // Reset form fields
      setSinglePatient({
        hn_number: "",
        name: "",
        citizen_id: "",
        phone_no: "",
        doctor_id: "",
        lab_test_master_id: "",
      });
    }
  }, [show]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSinglePatient({
        hn_number: "",
        name: "",
        citizen_id: "",
        phone_no: "",
        doctor_id: "",
        lab_test_master_id: "",
      });
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    // Reset the file input value so the same file can be selected again
    const fileInput = document.getElementById("fileUpload");
    if (fileInput) fileInput.value = "";
  };

  // ... [Previous drag and drop handlers remain the same]
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "text/csv") {
      setFile(droppedFile);
      setSinglePatient({
        hn_number: "",
        name: "",
        citizen_id: "",
        phone_no: "",
        doctor_id: "",
        lab_test_master_id: "",
      });
    }
  };

  const handleSinglePatientChange = (e) => {
    const { name, value } = e.target;
    if (file) setFile(null);
    setSinglePatient((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ... [Previous upload handlers remain the same]
  const handleBulkUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    try {
      const response = await fetch("http://localhost:3000/upload/patients", {
        method: "POST",
        body: formData,
      });

      const result = await response.text();
      alert(result || "Upload successful!");
      onUpload(result);
      onClose();
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
    }
  };

  const handleSinglePatientSubmit = async () => {
    if (
      !singlePatient.hn_number ||
      !singlePatient.name ||
      !singlePatient.citizen_id ||
      !singlePatient.phone_no ||
      !singlePatient.doctor_id || // Add this line
      !singlePatient.lab_test_master_id
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(singlePatient),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Get the error message from the response
        throw new Error(errorData.error || "Failed to create patient");
      }

      const result = await response.json();
      alert("Patient created successfully!");
      onUpload(result);
      onClose();
    } catch (error) {
      console.error("Error creating patient:", error);
      alert("Failed to create patient: " + error.message); // Show the error message
    }
  };

  if (!show) return null;

  const isFormFilled = Object.values(singlePatient).some(
    (value) => value !== ""
  );

  return (
    <div className="modal-container1">
      <div className="bg-white rounded-lg w-full max-w-lg max-h-[80vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="p-4 flex justify-between items-center text-[#242222]">
          <h2 className="text-xl font-bold">Add New Patients</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Bulk Upload Section */}
          <div className="container1">
            <h3 className="text-lg font-semibold mb-3 text-[#242222]">
              Bulk Upload
            </h3>
            <div
              className={`border-2 border-dashed rounded-lg p-4 text-center ${
                isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
              } ${file || isFormFilled ? "opacity-50 cursor-not-allowed" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="mb-2 text-[#242222]">
                📁 Drop your CSV file here or
              </p>
              <button
                className="browse-button"
                onClick={() => document.getElementById("fileUpload").click()}
                disabled={isFormFilled}
              >
                Browse Files
              </button>
              <input
                id="fileUpload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                disabled={isFormFilled}
              />
              {file && (
                <div className="mt-2">
                  <div className="flex items-center justify-center space-x-2">
                    <p className="text-green-600 text-sm">{file.name}</p>
                    <button
                      onClick={handleRemoveFile}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">Supported formats: CSV</p>
          </div>

          <div className="text-center mb-4">
            <span className="text-sm text-gray-500">OR</span>
          </div>

          {/* Single Patient Form */}
          <div className="container1">
            <h3 className="text-lg font-semibold mb-3 text-[#242222]">
              Add A Single Patient
            </h3>
            <div
              className={`space-y-3 ${
                file ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HN Number
                </label>
                <input
                  type="text"
                  name="hn_number"
                  placeholder="Enter HN Number"
                  value={singlePatient.hn_number}
                  onChange={handleSinglePatientChange}
                  className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                  disabled={!!file}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  value={singlePatient.name}
                  onChange={handleSinglePatientChange}
                  className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                  disabled={!!file}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Citizen ID
                </label>
                <input
                  type="text"
                  name="citizen_id"
                  placeholder="Enter Citizen ID"
                  value={singlePatient.citizen_id}
                  onChange={handleSinglePatientChange}
                  className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                  disabled={!!file}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_no"
                  placeholder="Enter Phone Number"
                  value={singlePatient.phone_no}
                  onChange={handleSinglePatientChange}
                  className="w-full p-2 border rounded-md text-sm placeholder-[#969696] text-[#969696]"
                  disabled={!!file}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor
                </label>
                <select
                  name="doctor_id"
                  value={singlePatient.doctor_id}
                  onChange={handleSinglePatientChange}
                  className="w-full p-2 border rounded-md text-sm text-[#969696]"
                  disabled={!!file}
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option> // Display doctor name instead of ID
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lab Test
                </label>
                <select
                  name="lab_test_master_id"
                  value={singlePatient.lab_test_master_id}
                  onChange={handleSinglePatientChange}
                  className="w-full p-2 border rounded-md text-sm text-[#969696]"
                  disabled={!!file}
                >
                  <option value="">Select Lab Test</option>
                  {labTests.map((test) => (
                    <option key={test.id} value={test.id}>
                      {test.test_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed */}
        <div className="p-4 flex justify-end space-x-3">
          {file ? (
            <button
              onClick={handleBulkUpload}
              className="bg-green-600 text-white px-4 py-2 rounded text-sm"
            >
              Upload CSV
            </button>
          ) : isFormFilled ? (
            <button
              onClick={handleSinglePatientSubmit}
              className="add-patient-button"
            >
              Add Patient
            </button>
          ) : null}
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Patients = ({ onNavigateToDetails = () => {} }) => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  //const [showUploadPopup, setShowUploadPopup] = useState(false);
  // const [uploadType, setUploadType] = useState("");
  //const [file, setFile] = useState(null);
  const [showLabUploadPopup, setShowLabUploadPopup] = useState(false);
  const [showPatientUploadPopup, setShowPatientUploadPopup] = useState(false);
  const [popupIndex, setPopupIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({
    key: "hn_number",
    direction: "ascending",
  });
  const [buttonPosition, setButtonPosition] = useState({ top: 0, left: 0 });

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
  const currentPatients = filteredPatients.slice(
    indexOfFirstPatient,
    indexOfLastPatient
  );
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

  const handleLabUploadSuccess = (result) => {
    if (result.patientId) {
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === result.patientId
            ? { ...patient, lab_data_status: true }
            : patient
        )
      );
    }
  };

  const handlePatientUploadSuccess = () => {
    // Refresh the patients list after successful upload
    fetch("http://localhost:3000/patients")
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((error) => console.error("Error fetching patients:", error));
  };

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
    if (type === "lab") {
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
    <div className="table-container font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-black">Patient Info</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setShowLabUploadPopup(true)}
            // className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            className="uButton"
          >
            + Lab Data
          </button>
          <button
            onClick={() => setShowPatientUploadPopup(true)}
            // className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            className="uButton"
          >
            + New Patient
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
                { key: "hn_number", label: "HN", width: "20%" },
                { key: "name", label: "Name", width: "20%" },
                { key: "phone_no", label: "Phone No", width: "20%" },
                {
                  key: "lab_data_status",
                  label: "Lab Data Status",
                  width: "15%",
                },
                {
                  key: "account_status",
                  label: "Account Status",
                  width: "15%",
                },
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
            {currentPatients.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  There's no patient yet.
                </td>
              </tr>
            ) : (
              currentPatients.map((patient, index) => (
                <tr
                  key={patient.id}
                  className={`
                  
                  hover:bg-gray-50 transition-colors duration-150
                   border-b border-gray-300
                `}
                >
                  <td className="p-4 text-start text-[#595959]">
                    {patient.hn_number}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {patient.name}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    {patient.phone_no}
                  </td>
                  <td className="p-4 text-start text-[#595959]">
                    <StatusIcon type="lab" status={patient.lab_data_status} />
                  </td>
                  <td className="p-4 text-start">
                    <StatusIcon
                      type="account"
                      status={patient.account_status}
                    />
                  </td>
                  <td className="p-4 relative">
                    <MoreVertical
                      size={25}
                      data-action-icon
                      className="cursor-pointer text-[#595959]"
                      onClick={(e) => {
                        e.stopPropagation();
                        const rect = e.currentTarget.getBoundingClientRect();
                        setButtonPosition({
                          top: rect.bottom + window.scrollY,
                          left: rect.right - 110, // Adjust popup position from right edge
                        });
                        setPopupIndex(popupIndex === index ? null : index);
                      }}
                    />
                    {popupIndex === index &&
                      createPortal(
                        <div
                          data-action-popup
                          className="fixed bg-white rounded-md shadow-lg z-[9999]"
                          style={{
                            top: `${buttonPosition.top}px`,
                            left: `${buttonPosition.left}px`,
                            width: "12rem",
                          }}
                        >
                          <button
                            onClick={() => handleViewDetails(patient)}
                            className="w-full text-left px-4 py-2 text-black hover:bg-gray-100"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDeletePatient(patient.id)}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                          >
                            Delete Data
                          </button>
                        </div>,
                        document.body
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
          className="pButton"
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
      <LabDataUploadPopup
        show={showLabUploadPopup}
        onClose={() => setShowLabUploadPopup(false)}
        onUpload={handleLabUploadSuccess}
      />

      <PatientUploadPopup
        show={showPatientUploadPopup}
        onClose={() => setShowPatientUploadPopup(false)}
        onUpload={handlePatientUploadSuccess}
      />
    </div>
  );
};

export default Patients;
