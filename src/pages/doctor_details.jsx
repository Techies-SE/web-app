import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';

const DoctorProfile = () => {
  const schedules = [
    { day: 'Monday', times: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'] },
    { day: 'Wednesday', times: ['10:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'] },
    { day: 'Friday', times: ['9:00 AM - 2:00 PM'] }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center mb-6">
        <img 
          src="/api/placeholder/120/120" 
          alt="Doctor profile" 
          className="w-24 h-24 rounded-lg mr-6"
        />
        <div>
          <h1 className="text-2xl font-bold">Dr. John Smith</h1>
          <p className="text-gray-600">Cardiologist</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Email: john.smith@hospital.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="ml-auto">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Active
          </span>
        </div>
      </div>

      {/* Schedule Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Current Schedule Overview</CardTitle>
          <Button className="ml-auto">+ Add New Schedule</Button>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <tbody>
              {schedules.map((schedule, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 font-medium">{schedule.day}</td>
                  <td className="py-3">
                    {schedule.times.map((time, timeIndex) => (
                      <div key={timeIndex}>{time}</div>
                    ))}
                  </td>
                  <td className="py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorProfile;