import "./App.css";
import React from "react";
import AttendanceTracker from "./AttendanceTracker";

function App() {
  const students = [
    { id: "s1", name: "Aisha Verma", roll: "01" },
    { id: "s2", name: "Rahul Sharma", roll: "02" },
    { id: "s3", name: "Meera Patel", roll: "03" },
    { id: "s4", name: "Karan Singh", roll: "04" },
    { id: "s5", name: "Sneha Rao", roll: "05" },
    { id: "s6", name: "Aditya Gupta", roll: "06" },
    { id: "s7", name: "Nisha Jain", roll: "07" },
    { id: "s8", name: "Vikram Desai", roll: "08" },
  ];  

  const handleAttendanceChange = (attendanceMap) => {
    // attendanceMap is { id: status } - you can submit it to your API here
    console.log("Attendance updated", attendanceMap);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <AttendanceTracker
          students={students}
          date={new Date()}
          onAttendanceChange={handleAttendanceChange}
        />
      </div>
    </div>
  );
}

export default App;
