// import { useState } from "react";
// import { FileEdit, Plus, Bell, AlertCircle } from "lucide-react";
// import { Button } from "../components/ui/button";
// import DashboardHeader from "../components/DashboardHeader";
// import RoomCard from "../components/RoomCard";
// import ExamCard from "../components/ExamCard";
// import CreateRoomDialog from "../components/CreateRoomDialog";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState<"room" | "exam">("room");
//   const navigate = useNavigate();

//   const rooms = [
//     { id: 1, name: "Physics Final Exam", dateCreated: "Jan 15, 2025", participants: 45 },
   
//   ];

//   const exams = [
//     {
//       id: 1,
//       title: "Mathematics Final",
//       subject: "Advanced Calculus",
//       date: "Jan 20, 2025",
//       time: "2:00 PM",
//       status: "online" as const,
//     },
//     {
//       id: 2,
//       title: "Physics Midterm",
//       subject: "Quantum Mechanics",
//       date: "Jan 25, 2025",
//       time: "10:00 AM",
//       status: "scheduled" as const,
//     },
//     {
//       id: 3,
//       title: "Chemistry Quiz",
//       subject: "Organic Chemistry",
//       date: "Jan 30, 2025",
//       time: "3:00 PM",
//       status: "scheduled" as const,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30">
//       <div className="min-h-screen">
//         <DashboardHeader />

//         <main className="container mx-auto px-4 py-2 space-y-4">
          
//           {/* GIF and Toggle Button Combined Section */}
//           <div className="flex flex-col items-center">
//             {/* GIF Animation - No margin bottom */}
//             <div className="mb-[-5px] z-1">
//               <img 
//                 src="/e274568d-d4df-4a61-814e-cb87d8-unscreen.gif" 
//                 alt="Animation" 
//                 className="w-48 h-48 object-contain drop-shadow-2x1"
//               />
//             </div>

//             {/* Toggle Button Section */}
//             <div
//               className="inline-flex rounded-full p-1 shadow-md"
//               style={{
//                 background: "linear-gradient(135deg, #e8f0fb 0%, #dce8f8 100%)",
//               }}
//             >
//               <button
//                 onClick={() => setActiveTab("room")}
//                 className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
//                   activeTab === "room"
//                     ? "text-white shadow-lg"
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 style={
//                   activeTab === "room"
//                     ? {
//                         background:
//                           "linear-gradient(135deg, #4a5f8f 0%, #5668e8 100%)",
//                       }
//                     : {}
//                 }
//               >
//                 <div className="flex items-center gap-2">
//                   <Plus className="h-4 w-4" />
//                   Created Rooms
//                 </div>
//               </button>

//               <button
//                 onClick={() => setActiveTab("exam")}
//                 className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
//                   activeTab === "exam"
//                     ? "text-white shadow-lg"
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 style={
//                   activeTab === "exam"
//                     ? {
//                         background:
//                           "linear-gradient(135deg, #4a5f8f 0%, #5668e8 100%)",
//                       }
//                     : {}
//                 }
//               >
//                 <div className="flex items-center gap-2">
//                   <Plus className="h-4 w-4" />
//                   Exam Rooms
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Rounded Box Container */}
//           <div 
//             className="rounded-3xl shadow-xl p-8 backdrop-blur-sm"
//             style={{
//               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
//               border: '1px solid rgba(226, 232, 240, 0.5)'
//             }}
//           >
//             {/* Top Right Buttons - Only show when activeTab is "room" */}
//             {activeTab === "room" && (
//               <div className="flex justify-end items-center gap-2 mb-6">
//                 <CreateRoomDialog />
//                 <Button 
//                   variant="outline" 
//                   className="gap-2 hover:bg-blue-50 border-blue-200 hover:border-blue-300 transition-all duration-200"
//                   onClick={() => navigate("/question-paper")}
//                 >
//                   <FileEdit className="h-4 w-4" />
//                   Make Question Paper
//                 </Button>
//               </div>
//             )}

//             {/* Reminder Banner - Only show when activeTab is "exam" */}
//             {activeTab === "exam" && (
//               <div 
//                 className="mb-6 p-4 rounded-2xl backdrop-blur-md border-2 animate-pulse"
//                 style={{
//                   background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
//                   borderColor: 'rgba(16, 185, 129, 0.3)'
//                 }}
//               >
//                 <div className="flex items-center gap-4">
//                   <div 
//                     className="p-3 rounded-xl shadow-lg"
//                     style={{
//                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
//                     }}
//                   >
//                     <Bell className="h-6 w-6 text-white" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-1">
//                       <AlertCircle className="h-5 w-5 text-emerald-600" />
//                       <h3 className="text-lg font-bold text-slate-800">Exam Reminder</h3>
//                     </div>
//                     <p className="text-sm text-slate-600">
//                       <span className="font-semibold text-emerald-700">Mathematics Final</span> is currently live! 
//                       Click "Enter Exam" to join now. Don't miss your scheduled exams.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Content Section */}
//             {activeTab === "room" ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {rooms.map((room) => (
//                   <RoomCard key={room.id} {...room} />
//                 ))}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {exams.map((exam) => (
//                   <ExamCard key={exam.id} {...exam} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



// import { useState } from "react";
// import { FileEdit, Plus, Bell, AlertCircle } from "lucide-react";
// import { Button } from "../components/ui/button";
// import DashboardHeader from "../components/DashboardHeader";
// import RoomCard from "../components/RoomCard";
// import ExamCard from "../components/ExamCard";
// import CreateRoomDialog from "../components/CreateRoomDialog";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState<"room" | "exam">("room");
//   const navigate = useNavigate();

//   const rooms = [
//     { id: 1, name: "Physics Final Exam", dateCreated: "Jan 15, 2025", participants: 45 },
//     { id: 2, name: "Chemistry Midterm", dateCreated: "Jan 10, 2025", participants: 38 },
//     { id: 3, name: "Biology Quiz Room", dateCreated: "Jan 5, 2025", participants: 52 },
//   ];

//   const exams = [
//     {
//       id: "1",
//       title: "Mathematics Final",
//       subject: "Advanced Calculus",
//       date: "Jan 20, 2025",
//       time: "2:00 PM",
//       status: "online" as const,
//     },
//     {
//       id: "2",
//       title: "Physics Midterm",
//       subject: "Quantum Mechanics",
//       date: "Jan 25, 2025",
//       time: "10:00 AM",
//       status: "scheduled" as const,
//     },
//     {
//       id: "3",
//       title: "Chemistry Quiz",
//       subject: "Organic Chemistry",
//       date: "Jan 30, 2025",
//       time: "3:00 PM",
//       status: "scheduled" as const,
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 font-propane select-none">
//       {/* Global Selection Disable */}
//       <style>{`
//         * {
//           user-select: none;
//           -webkit-user-select: none;
//           -moz-user-select: none;
//           -ms-user-select: none;
//         }
//         input, textarea, select, button {
//           user-select: none;
//           -webkit-user-select: none;
//           -moz-user-select: none;
//           -ms-user-select: none;
//         }
//       `}</style>

//       <div className="min-h-screen">
//         <DashboardHeader />

//         <main className="container mx-auto px-4 py-2 space-y-4">
          
//           {/* GIF and Toggle Button Combined Section */}
//           <div className="flex flex-col items-center">
//             {/* GIF Animation - No margin bottom */}
//             <div className="mb-[-5px] z-1">
//               <img 
//                 src="/e274568d-d4df-4a61-814e-cb87d8-unscreen.gif" 
//                 alt="Animation" 
//                 className="w-48 h-48 object-contain drop-shadow-2x1 select-none"
//               />
//             </div>

//             {/* Toggle Button Section */}
//             <div
//               className="inline-flex rounded-full p-1 shadow-md font-propane select-none"
//               style={{
//                 background: "linear-gradient(135deg, #e8f0fb 0%, #dce8f8 100%)",
//               }}
//             >
//               <button
//                 onClick={() => setActiveTab("room")}
//                 className={`px-6 py-3 rounded-full font-medium transition-all duration-300 select-none ${
//                   activeTab === "room"
//                     ? "text-white shadow-lg"
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 style={
//                   activeTab === "room"
//                     ? {
//                         background:
//                           "linear-gradient(135deg, #4a5f8f 0%, #5668e8 100%)",
//                       }
//                     : {}
//                 }
//               >
//                 <div className="flex items-center gap-2 select-none">
//                   Created Rooms
//                 </div>
//               </button>

//               <button
//                 onClick={() => setActiveTab("exam")}
//                 className={`px-6 py-3 rounded-full font-medium transition-all duration-300 select-none ${
//                   activeTab === "exam"
//                     ? "text-white shadow-lg"
//                     : "text-slate-600 hover:text-slate-800"
//                 }`}
//                 style={
//                   activeTab === "exam"
//                     ? {
//                         background:
//                           "linear-gradient(135deg, #4a5f8f 0%, #5668e8 100%)",
//                       }
//                     : {}
//                 }
//               >
//                 <div className="flex items-center gap-2 select-none">
//                   Exam Rooms
//                 </div>
//               </button>
//             </div>
//           </div>

//           {/* Rounded Box Container */}
//           <div 
//             className="rounded-3xl shadow-xl p-8 backdrop-blur-sm font-propane select-none"
//             style={{
//               background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)',
//               border: '1px solid rgba(226, 232, 240, 0.5)'
//             }}
//           >
//             {/* Top Right Buttons - Only show when activeTab is "room" */}
//             {activeTab === "room" && (
//               <div className="flex justify-end items-center gap-2 mb-6 select-none">
//                 <CreateRoomDialog />
//                 <Button 
//                   variant="outline" 
//                   className="gap-2 hover:bg-blue-50 border-blue-200 hover:border-blue-300 hover:text-blue-600 transition-all duration-200 font-propane select-none"
//                   onClick={() => navigate("/question-paper")}
//                 >
//                   <FileEdit className="h-4 w-4" />
//                   Make Question Paper
//                 </Button>
//               </div>
//             )}

//             {/* Reminder Banner - Only show when activeTab is "exam" */}
//             {activeTab === "exam" && (
//               <div 
//                 className="mb-6 p-4 rounded-2xl backdrop-blur-md border-2 animate-pulse font-propane select-none"
//                 style={{
//                   background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
//                   borderColor: 'rgba(16, 185, 129, 0.3)'
//                 }}
//               >
//                 <div className="flex items-center gap-4 select-none">
//                   <div 
//                     className="p-3 rounded-xl shadow-lg select-none"
//                     style={{
//                       background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
//                     }}
//                   >
//                     <Bell className="h-6 w-6 text-white select-none" />
//                   </div>
//                   <div className="flex-1 select-none">
//                     <div className="flex items-center gap-2 mb-1 select-none">
//                       <AlertCircle className="h-5 w-5 text-emerald-600 select-none" />
//                       <h3 className="text-lg font-bold text-slate-800 font-propane select-none">Exam Reminder</h3>
//                     </div>
//                     <p className="text-sm text-slate-600 font-propane select-none">
//                       <span className="font-semibold text-emerald-700 select-none">Mathematics Final</span> is currently live! 
//                       Click "Enter Exam" to join now. Don't miss your scheduled exams.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Content Section */}
//             {activeTab === "room" ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
//                 {rooms.map((room) => (
//                   <RoomCard key={room.id} {...room} />
//                 ))}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
//                 {exams.map((exam) => (
//                   <ExamCard key={exam.id} {...exam} />
//                 ))}
//               </div>
//             )}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import { useState, useEffect } from "react";
import { FileEdit, Plus, Bell, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import DashboardHeader from "../components/DashboardHeader";
import RoomCard from "../components/RoomCard";
import ExamCard from "../components/ExamCard";
import CreateRoomDialog from "../components/CreateRoomDialog";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Room {
  _id: string;
  roomName: string;
  description: string;
  ownerUid: string;
  inviteCode: string;
  createdAt: number;
  _creationTime: number;
  customFields: any[];
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  status: "online" | "scheduled";
}

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<"room" | "exam">("room");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [participants, setParticipants] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch rooms + members
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);

  //       const uid = localStorage.getItem("uid");
  //       if (!uid) {
  //         setError("User not logged in");
  //         setLoading(false);
  //         return;
  //       }

  //       // Fetch rooms owned by user
  //       const roomRes = await axios.get(`http://localhost:5000/api/rooms/owner/${uid}`);
  //       const fetchedRooms = roomRes.data.rooms || [];
        
  //       // Fetch joined members
  //       const membersRes = await axios.get(`http://localhost:5000/api/rooms/members/${uid}`);
  //       const joinedMembers = membersRes.data.members || [];
        
  //       // Count members per room
  //       const participantCount: Record<string, number> = {};
  //       joinedMembers.forEach((member: any) => {
  //         if (member.joined && member.roomId) {
  //           participantCount[member.roomId] = (participantCount[member.roomId] || 0) + 1;
  //         }
  //       });

  //       setRooms(fetchedRooms);
  //       setParticipants(participantCount);

  //       console.log("Fetched Rooms:", fetchedRooms);
  //       console.log("Joined Members:", joinedMembers);
  //     } catch (err: any) {
  //       console.error("Error fetching rooms or members:", err);
  //       setError("Failed to load dashboard data.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);


useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const uid = localStorage.getItem("uid");
        if (!uid) {
          setError("User not logged in");
          setLoading(false);
          return;
        }

        // 1️⃣ Fetch all rooms owned by the user
        const roomRes = await axios.get(`http://localhost:5000/api/rooms/owner/${uid}`);
        const fetchedRooms = roomRes.data.rooms || [];

        // 2️⃣ For each room, fetch its own members using roomId
        const participantCount: Record<string, number> = {};

        await Promise.all(
          fetchedRooms.map(async (room: Room) => {
            try {
              const membersRes = await axios.get(
                `http://localhost:5000/api/rooms/members/${room._id}`
              );
              const members = membersRes.data.members || [];

              // Count only joined members
              const joinedCount = members.filter((m: any) => m.joined).length;
              participantCount[room._id] = joinedCount;
            } catch (memberErr) {
              console.warn(`Error fetching members for room ${room._id}`, memberErr);
              participantCount[room._id] = 0;
            }
          })
        );

        setRooms(fetchedRooms);
        setParticipants(participantCount);

        console.log("Fetched Rooms:", fetchedRooms);
        console.log("Participants by room:", participantCount);
      } catch (err: any) {
        console.error("Error fetching rooms or members:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const exams: Exam[] = [
    {
      id: "3",
      title: "Chemistry Quiz",
      subject: "Organic Chemistry",
      date: "Jan 30, 2025",
      time: "3:00 PM",
      status: "scheduled" as const,
    },
  ];

  // Format date
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 font-propane select-none">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-2 space-y-4">
        {/* Tabs */}
        <div className="flex flex-col items-center">
          <div className="mb-[-5px]">
            <img
              src="/e274568d-d4df-4a61-814e-cb87d8-unscreen.gif"
              alt="Animation"
              className="w-48 h-48 object-contain drop-shadow-2x1"
            />
          </div>

          <div
            className="inline-flex rounded-full p-1 shadow-md"
            style={{
              background: "linear-gradient(135deg, #e8f0fb 0%, #dce8f8 100%)",
            }}
          >
            <button
              onClick={() => setActiveTab("room")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "room"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-800"
              }`}
              style={
                activeTab === "room"
                  ? {
                      background:
                        "linear-gradient(135deg, #4a5f8f 0%, #5668e8 100%)",
                    }
                  : {}
              }
            >
              Created Rooms
            </button>

            <button
              onClick={() => setActiveTab("exam")}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                activeTab === "exam"
                  ? "text-white shadow-lg"
                  : "text-slate-600 hover:text-slate-800"
              }`}
              style={
                activeTab === "exam"
                  ? {
                      background:
                        "linear-gradient(135deg, #4a5f8f 0%, #5668e8 100%)",
                    }
                  : {}
              }
            >
              Exam Rooms
            </button>
          </div>
        </div>

        {/* Main Box */}
        <div
          className="rounded-3xl shadow-xl p-8 backdrop-blur-sm"
          style={{
            background:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%)",
            border: "1px solid rgba(226, 232, 240, 0.5)",
          }}
        >
          {activeTab === "room" && (
            <div className="flex justify-end items-center gap-2 mb-6">
              <CreateRoomDialog />
              <Button
                variant="outline"
                className="gap-2 hover:bg-blue-50 border-blue-200 hover:border-blue-300 hover:text-blue-600"
                onClick={() => navigate("/question-paper")}
              >
                <FileEdit className="h-4 w-4" />
                Make Question Paper
              </Button>
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-slate-600">Loading dashboard...</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-medium">{error}</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Rooms */}
          {!loading && !error && activeTab === "room" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <RoomCard
                    key={room._id}
                    roomId={room._id}
                    name={room.roomName}
                    dateCreated={formatDate(room.createdAt || room._creationTime)}
                    participants={participants[room._id] || 0} // ✅ Show number of joined members
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <FileEdit className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600 mb-2">
                    No rooms created yet
                  </h3>
                  <p className="text-slate-500 mb-4">
                    Create your first room to get started with exams
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Exams */}
          {!loading && !error && activeTab === "exam" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam) => (
                <ExamCard key={exam.id} {...exam} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
