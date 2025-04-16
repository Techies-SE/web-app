import React from "react";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  Dashboard,
  Patients,
  Appointments,
  Doctors,
  Staffs,
  Settings,
  DoctorDetails,
} from "../pages";
import Recommendations from "../pages/Staffs";

const Layout = ({ currentRoute, setCurrentRoute }) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const renderContent = () => {
    switch (currentRoute) {
      case "dashboard":
        return <Dashboard />;
      case "patients":
        return <Patients />;
      case "appointments":
        return <Appointments />;
      case "doctors":
        return selectedDoctorId ? (
          <DoctorDetails
            doctorId={selectedDoctorId}
            setCurrentRoute={setCurrentRoute}
            setSelectedDoctorId={setSelectedDoctorId}
          />
        ) : (
          <Doctors setSelectedDoctorId={setSelectedDoctorId} />
        );
      case "recommendations":
        return <Recommendations />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex">
      <Sidebar currentRoute={currentRoute} setCurrentRoute={setCurrentRoute} />
      <div className="ml-64 flex-1">
        <Navbar currentRoute={currentRoute} />
        <main className="mt-16">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Layout;
