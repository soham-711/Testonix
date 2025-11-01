// src/pages/JoinRoomPage.jsx
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "../components/ui/use-toast";
import { AuthContext } from "../context/AuthContext";

export default function JoinRoomPage() {
  const { inviteCode } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({});
  console.log(user);

  // STEP 1: Fetch room info
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/rooms/by-invite/${inviteCode}`
        );

        // ✅ Backend sends the room directly, not wrapped in { room: ... }
        setRoom(data.room || data);
        console.log("Fetched room:", data);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: err.response?.data?.error || "Invalid invite link",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [inviteCode]);

  // STEP 2: If not logged in, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        variant: "destructive",
        title: "Login Required",
        description: "Please login to join this room.",
      });
      navigate(`/login?redirect=/join-room/${inviteCode}`);
    }
  }, [authLoading, user, inviteCode, navigate]);

  // STEP 3: Handle join room
  const handleJoin = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please login first",
      });
      navigate(`/login?redirect=/join-room/${inviteCode}`);
      return;
    }

    try {
      const payload = {
        inviteCode,
        email: user.email,
        uid: user.uid,
        name: user.displayName,
        customData: formData,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/rooms/join",
        payload
      );

      toast({
        variant: "default",
        title: "Success",
        description: "You’ve joined the room successfully!",
      });

      navigate(`/dashboard`);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error joining room",
        description: err.response?.data?.error || err.message,
      });
    }
  };

  // STEP 4: Handle loading states
  if (loading || authLoading) return <p>Loading...</p>;
  if (!room) return <p>Invalid or expired room link.</p>;

  // STEP 5: Render the customized form
  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">
        Join Room: {room.roomName}
      </h2>
      <p className="text-gray-600 mb-4">
        Fill in the required details to join this room.
      </p>

      {room.customFields?.length > 0 ? (
        <div className="space-y-4 mb-4">
          {room.customFields.map((field) => (
            <div key={field}>
              <label className="block mb-1 font-medium">{field}</label>
              <input
                className="w-full border p-2 rounded focus:ring focus:ring-blue-200"
                value={formData[field] || ""}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
                placeholder={`Enter your ${field}`}
                required
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4">
          No additional information required.
        </p>
      )}

      <button
        onClick={handleJoin}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Join Room
      </button>
    </div>
  );
}
