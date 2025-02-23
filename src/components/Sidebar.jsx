import React from 'react';
import { LayoutDashboard, Users, Calendar, Stethoscope, Users2, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ currentRoute, setCurrentRoute }) => {
  const menuItems = [
    { icon: LayoutDashboard, text: 'Dashboard', path: 'dashboard' },
    { icon: Users, text: 'Patients', path: 'patients' },
    { icon: Calendar, text: 'Appointments', path: 'appointments' },
    { icon: Stethoscope, text: 'Doctors', path: 'doctors' },
    { icon: Users2, text: 'Staffs', path: 'staffs' },
    { icon: Settings, text: 'Settings', path: 'settings' },
  ];

  return (
    <div className="h-screen w-64 bg-white border-r fixed left-0 top-0">
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full"></div>
          <span className="font-semibold text-lg">MFU Wellness Centre</span>
        </div>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setCurrentRoute(item.path)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer mb-2 w-full text-left ${
              currentRoute === item.path ? 'bg-green-50 text-green-600' : 'hover:bg-gray-50'
            }`}
          >
            <item.icon size={20} />
            <span>{item.text}</span>
          </button>
        ))}
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t">
        <button
          onClick={() => setCurrentRoute('logout')}
          className="flex items-center gap-3 p-3 rounded-lg cursor-pointer w-full text-left hover:bg-gray-50"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;