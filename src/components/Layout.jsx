import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Dashboard, Patients, Appointments, Doctors, Staffs, Settings } from '../pages';

const Layout = ({ currentRoute, setCurrentRoute }) => {
  const renderContent = () => {
    switch (currentRoute) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <Patients />;
      case 'appointments':
        return <Appointments />;
      case 'doctors':
        return <Doctors />;
      case 'staffs':
        return <Staffs />;
      case 'settings':
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
        <main className="mt-16">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Layout;