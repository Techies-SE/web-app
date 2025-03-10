import React from 'react';

const Navbar = ({ currentRoute }) => {
  const title = currentRoute.charAt(0).toUpperCase() + currentRoute.slice(1);

  return (
    <div className="fixed top-0 left-64 right-0 bg-white border-b shadow-md">
      <div className="flex justify-end items-center p-2.5">
        {/* <h1 className="text-xl font-semibold">{title}</h1> */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div>
            <div className="font-semibold text-black">John Smith</div>
            <div className="text-sm text-black">Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;