// import { Toaster } from "./components/ui/toaster";
// import { Toaster as Sonner } from "./components/ui/sonner";
// import { TooltipProvider } from "./components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import Login from "./pages/Login";
// import Dashboard from "./pages/Dashboard";
// import QuestionPaper from "./pages/QuestionPaper";
// import QuestionResults from "./pages/QuestionPaper";
// import NotFound from "./pages/NotFound";
// import Footer from "./components/Footer";

// const queryClient = new QueryClient();

// const AppContent = () => {
//   const location = useLocation();

//   // Hide footer on QuestionPaper route
//   const showFooter = location.pathname !== "/question-paper";

//   return (
//     <div className="flex flex-col min-h-screen">
//       <div className="flex-grow">
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/question-paper" element={<QuestionPaper />} />
//           <Route path="/question-results" element={<QuestionResults />} />
//           {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </div>
//       {showFooter && <Footer />}
//     </div>
//   );
// };

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <Toaster />
//       <Sonner />
//       <BrowserRouter>
//         <AppContent />
//       </BrowserRouter>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import QuestionPaper from "./pages/QuestionPaperCreator";
import QuestionResults from "./pages/QuestionPaperCreator"; // fixed import
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AIGenerator from "./pages/AIGenerator";
import RoomDetails from "./pages/RoomDetails";
import InviteLink from "./pages/JoinRoomPage";
import JoinRoomPage from "./pages/JoinRoomPage";
import TermsAndConditions from "./pages/TermsAndConditions";
import ExamInfo from "./pages/ExamInfo";
import TakeExam from "./pages/TakeExam";
import ExamSubmitted from "./pages/ExamSubmitted";

const queryClient = new QueryClient();

// TypeScript interface for room details state
interface RoomDetailsState {
  roomName: string;
  dateCreated: string;
  totalStudents: number;
  roomId?: string;
}

// Wrapper component for RoomDetails to handle routing state
const RoomDetailsWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as RoomDetailsState | null;

  // Redirect to dashboard if no state is provided
  if (!state) {
    navigate("/dashboard");
    return null;
  }

  return (
    <RoomDetails
      roomId={state.roomId ?? ""}
      roomName={state.roomName}
      dateCreated={state.dateCreated}
      totalStudents={state.totalStudents}
      onBack={() => navigate("/dashboard")}
    />
  );
};

// Removed duplicate/incomplete AppContent definition

const AppContent = () => {
  const location = useLocation();

  // Hide footer on QuestionPaper route
  const showFooter = location.pathname !== "/question-paper";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/question-paper"
            element={
              <ProtectedRoute>
                <QuestionPaper />
              </ProtectedRoute>
            }
          />

          <Route
            path="/question-results"
            element={
              <ProtectedRoute>
                <QuestionResults />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-generator"
            element={
              <ProtectedRoute>
                <AIGenerator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/join-room/:inviteCode"
            element={
              <ProtectedRoute>
                <JoinRoomPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/room-details"
            element={
              <ProtectedRoute>
                <RoomDetailsWrapper />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/:examId/terms"
            element={
              <ProtectedRoute>
                <TermsAndConditions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/:examId/info"
            element={
              <ProtectedRoute>
                <ExamInfo />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/:examId/take"
            element={
              <ProtectedRoute>
                <TakeExam/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/exam/:examId/submitted"
            element={
              <ProtectedRoute>
                <ExamSubmitted/>
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {showFooter && <Footer />}
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
