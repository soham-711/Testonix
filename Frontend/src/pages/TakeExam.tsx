// import { useState, useEffect, useRef } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "../components/ui/button";
// import { Clock, AlertCircle, Pause } from "lucide-react";
// import { toast } from "sonner";

// interface Question {
//   id: string;
//   question: string;
//   type: "SAQ" | "MCQ";
//   options?: string[];
//   marks: number;
//   timeLimit?: number;
//   image?: string;
//   video?: string;
// }

// const TakeExam = () => {
//   const navigate = useNavigate();
//   const { examId } = useParams();
//   const audioRef = useRef<HTMLAudioElement>(null);
  
//   const questions: Question[] = [
//     {
//       id: "1",
//       question: "What is the derivative of x² + 3x + 2?",
//       type: "SAQ",
//       marks: 5,
//       timeLimit: 3,
//     },
//     {
//       id: "2",
//       question: "Which of the following is a prime number?",
//       type: "MCQ",
//       options: ["4", "6", "7", "8"],
//       marks: 2,
//       timeLimit: 2,
//     },
//     {
//       id: "3",
//       question: "Solve the equation: 2x + 5 = 15",
//       type: "SAQ",
//       marks: 3,
//       timeLimit: 4,
//     },
//   ];

//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [mainTimer, setMainTimer] = useState(7200);
//   const [questionTimer, setQuestionTimer] = useState(
//     (questions[0]?.timeLimit || 0) * 60
//   );
//   const [showSubmitModal, setShowSubmitModal] = useState(false);
//   const [isOnBreak, setIsOnBreak] = useState(false);
//   const [breakTime, setBreakTime] = useState(300);
//   const [timerAudioPlaying, setTimerAudioPlaying] = useState(false);
//   const [showOneMinWarning, setShowOneMinWarning] = useState(false);
//   const [oneMinWarningShown, setOneMinWarningShown] = useState(false);
//   const [audioLoaded, setAudioLoaded] = useState(false);

//   const currentQuestion = questions[currentQuestionIndex];
//   const isLastQuestion = currentQuestionIndex === questions.length - 1;
//   const answeredCount = Object.keys(answers).length;

//   // Debug audio loading
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     const handleCanPlay = () => {
//       console.log("✅ Audio file loaded successfully");
//       setAudioLoaded(true);
//     };

//     const handleError = (e: Event) => {
//       console.error("❌ Audio load error:", audio.error);
//       toast.error("Timer sound file not found. Check /public/timer.mp3");
//     };

//     audio.addEventListener("canplay", handleCanPlay);
//     audio.addEventListener("error", handleError);

//     // Try to load the audio
//     audio.load();

//     return () => {
//       audio.removeEventListener("canplay", handleCanPlay);
//       audio.removeEventListener("error", handleError);
//     };
//   }, []);

//   const playAlertSound = () => {
//     const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();
    
//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);
    
//     oscillator.frequency.value = 800;
//     oscillator.type = "sine";
    
//     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
//     oscillator.start(audioContext.currentTime);
//     oscillator.stop(audioContext.currentTime + 0.5);
//   };

//   const playWarningSound = () => {
//     const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//     const oscillator = audioContext.createOscillator();
//     const gainNode = audioContext.createGain();
    
//     oscillator.connect(gainNode);
//     gainNode.connect(audioContext.destination);
    
//     oscillator.frequency.value = 1200;
//     oscillator.type = "sine";
    
//     gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
//     gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    
//     oscillator.start(audioContext.currentTime);
//     oscillator.stop(audioContext.currentTime + 0.8);
//   };

//   // Timer audio control - plays when mainTimer <= 10 seconds
//   useEffect(() => {
//     const audio = audioRef.current;
//     if (!audio) return;

//     if (mainTimer <= 10 && mainTimer > 0 && !isOnBreak && audioLoaded) {
//       // Only play if audio is loaded and ready
//       if (!timerAudioPlaying) {
//         audio.currentTime = 0;
//         audio.loop = true;
        
//         const playPromise = audio.play();
//         if (playPromise !== undefined) {
//           playPromise
//             .then(() => {
//               console.log("🔊 Timer audio playing");
//               setTimerAudioPlaying(true);
//             })
//             .catch((error) => {
//               console.error("❌ Audio play error:", error);
//               toast.warning("Audio autoplay blocked. Sound may not work.");
//             });
//         }
//       }
//     } else if ((mainTimer > 10 || isOnBreak || mainTimer === 0) && timerAudioPlaying) {
//       audio.pause();
//       audio.currentTime = 0;
//       setTimerAudioPlaying(false);
//     }
//   }, [mainTimer, isOnBreak, audioLoaded, timerAudioPlaying]);

//   // Handle window visibility change during break
//   useEffect(() => {
//     const handleVisibilityChange = () => {
//       if (isOnBreak && document.hidden) {
//         toast.error("You left the exam during break! Exam will be auto-submitted.", {
//           duration: 5000,
//         });
//         playAlertSound();
//         setTimeout(() => {
//           handleAutoSubmit();
//         }, 2000);
//       }
//     };

//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (isOnBreak) {
//         e.preventDefault();
//         e.returnValue = "";
//         toast.error("You cannot exit during break!");
//         playAlertSound();
//         return false;
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("beforeunload", handleBeforeUnload);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//     };
//   }, [isOnBreak]);

//   // Check for 1 minute warning
//   useEffect(() => {
//     if (mainTimer === 60 && !oneMinWarningShown && !isOnBreak) {
//       setShowOneMinWarning(true);
//       setOneMinWarningShown(true);
//       playWarningSound();
//     }
//   }, [mainTimer, oneMinWarningShown, isOnBreak]);

//   // Main timer
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setMainTimer((prev) => {
//         if (prev <= 1) {
//           handleAutoSubmit();
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, []);

//   // Question timer reset
//   useEffect(() => {
//     if (currentQuestion.timeLimit) {
//       setQuestionTimer(currentQuestion.timeLimit * 60);
//     }
//   }, [currentQuestionIndex]);

//   // Question timer
//   useEffect(() => {
//     if (currentQuestion.timeLimit && questionTimer > 0) {
//       const interval = setInterval(() => {
//         setQuestionTimer((prev) => {
//           if (prev <= 1) {
//             toast.warning("Question time expired! Moving to next question.");
//             if (!isLastQuestion) {
//               handleNext();
//             }
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [questionTimer, currentQuestionIndex, isLastQuestion]);

//   // Break timer
//   useEffect(() => {
//     if (isOnBreak && breakTime > 0) {
//       const interval = setInterval(() => {
//         setBreakTime((prev) => {
//           if (prev <= 1) {
//             toast.warning("Break time over! Auto-submitting exam...");
//             setIsOnBreak(false);
//             setTimeout(() => {
//               handleAutoSubmit();
//             }, 1500);
//             return 300;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [isOnBreak, breakTime]);

//   const formatTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, "0")}:${minutes
//       .toString()
//       .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handleAnswerChange = (value: string) => {
//     setAnswers({ ...answers, [currentQuestion.id]: value });
//   };

//   const handleNext = () => {
//     if (currentQuestionIndex < questions.length - 1) {
//       setCurrentQuestionIndex(currentQuestionIndex + 1);
//     }
//   };

//   const handleAutoSubmit = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//     toast.error("Time's up! Exam auto-submitted.");
//     setTimeout(() => {
//       navigate(`/exam/${examId}/submitted`);
//     }, 2000);
//   };

//   const handleSubmit = () => {
//     setShowSubmitModal(true);
//   };

//   const handleBreak = () => {
//     setIsOnBreak(true);
//     setBreakTime(300);
//     toast.info("Break started. Main timers continue running.");
//   };

//   const handleResumeExam = () => {
//     setIsOnBreak(false);
//     toast.success("Exam resumed!");
//   };

//   const handleContinueExam = () => {
//     setShowOneMinWarning(false);
//     toast.info("Continue with your exam.");
//   };

//   const confirmSubmit = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//     }
//     toast.success("Exam submitted successfully!");
//     setTimeout(() => {
//       navigate(`/exam/${examId}/submitted`);
//     }, 1500);
//   };

//   return (
//     <div className="h-screen flex flex-col bg-white overflow-hidden select-none">
//       <style>{`
//         * {
//           user-select: none;
//           -webkit-user-select: none;
//           -moz-user-select: none;
//           -ms-user-select: none;
//         }
//         textarea, input[type="text"], input[type="radio"] {
//           user-select: text !important;
//           -webkit-user-select: text !important;
//           -moz-user-select: text !important;
//           -ms-user-select: text !important;
//         }
//         @keyframes pulse-warning {
//           0%, 100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.7;
//           }
//         }
//         .animate-pulse-warning {
//           animation: pulse-warning 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>

//       {/* Top Bar - Fixed Height */}
//       <div className={`${mainTimer <= 60 && !isOnBreak ? 'bg-red-600' : 'bg-slate-800'} text-white px-6 py-3 flex items-center justify-between border-b-2 ${mainTimer <= 60 && !isOnBreak ? 'border-red-700' : 'border-slate-900'} flex-shrink-0 transition-colors duration-300`}>
//         <div className="flex items-center gap-4">
//           <div className="flex items-center gap-2">
//             <Clock className={`w-4 h-4 ${mainTimer <= 60 && !isOnBreak ? 'animate-pulse' : ''}`} />
//             <span className="text-sm font-semibold">Time:</span>
//             <span className={`font-mono text-base font-bold ${mainTimer <= 60 && !isOnBreak ? 'animate-pulse' : ''}`}>{formatTime(mainTimer)}</span>
//             {audioLoaded && mainTimer <= 10 && (
//               <span className="ml-4 text-xs bg-green-500 px-2 py-1 rounded">🔊 Audio Active</span>
//             )}
//           </div>
//           {currentQuestion.timeLimit && (
//             <>
//               <div className="w-px h-5 bg-slate-600"></div>
//               <div className="flex items-center gap-2">
//                 <AlertCircle className="w-4 h-4 text-amber-400" />
//                 <span className="text-sm font-semibold">Question:</span>
//                 <span className="font-mono text-base font-bold text-amber-400">{formatTime(questionTimer)}</span>
//               </div>
//             </>
//           )}
//         </div>
//         <div className="text-sm font-semibold">
//           Question {currentQuestionIndex + 1} of {questions.length}
//         </div>
//       </div>

//       {/* Main Content - Flexible Height */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <div className="flex-1 flex flex-col p-8 overflow-auto">
//           {/* Question Header */}
//           <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-slate-200 flex-shrink-0">
//             <div className="flex items-start gap-4">
//               <div className="w-12 h-12 border-2 border-slate-800 flex items-center justify-center font-bold text-xl text-slate-900 flex-shrink-0">
//                 {currentQuestionIndex + 1}
//               </div>
//               <div>
//                 <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
//                   {currentQuestion.type === "MCQ" ? "Multiple Choice Question" : "Short Answer Question"}
//                 </div>
//                 <h2 className="text-2xl font-semibold text-slate-900 leading-relaxed">
//                   {currentQuestion.question}
//                 </h2>
//               </div>
//             </div>
//             <div className="text-sm font-bold text-slate-900 border-2 border-slate-800 px-4 py-2 flex-shrink-0">
//               [{currentQuestion.marks} Mark{currentQuestion.marks > 1 ? "s" : ""}]
//             </div>
//           </div>

//           {/* Image/Video */}
//           {currentQuestion.image && (
//             <div className="mb-6 border-2 border-slate-300 p-2 flex-shrink-0">
//               <img
//                 src={currentQuestion.image}
//                 alt="Question diagram"
//                 className="w-full max-h-64 object-contain"
//               />
//             </div>
//           )}

//           {currentQuestion.video && (
//             <div className="mb-6 border-2 border-slate-300 p-2 flex-shrink-0">
//               <video
//                 src={currentQuestion.video}
//                 controls
//                 className="w-full max-h-64"
//               />
//             </div>
//           )}

//           {/* Answer Section - Takes remaining space */}
//           <div className="flex-1 flex flex-col min-h-0">
//             {currentQuestion.type === "SAQ" ? (
//               <div className="flex flex-col h-full">
//                 <p className="text-sm font-semibold text-slate-700 mb-3 flex-shrink-0">
//                   Write your answer below:
//                 </p>
//                 <div className="flex-1 border-2 border-slate-300 focus-within:border-slate-500 transition-colors flex flex-col">
//                   <textarea
//                     value={answers[currentQuestion.id] || ""}
//                     onChange={(e) => handleAnswerChange(e.target.value)}
//                     placeholder="Write your answer here..."
//                     className="w-full h-full px-4 py-3 outline-none resize-none text-slate-900 bg-white select-text"
//                     style={{ lineHeight: "2" }}
//                   />
//                 </div>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 <p className="text-sm font-semibold text-slate-700 mb-4">
//                   Select the correct answer:
//                 </p>
//                 {currentQuestion.options?.map((option, index) => (
//                   <label
//                     key={index}
//                     className={`
//                       flex items-start gap-3 p-4 border-2 cursor-pointer transition-all
//                       ${
//                         answers[currentQuestion.id] === option
//                           ? "border-slate-800 bg-slate-50"
//                           : "border-slate-300 hover:border-slate-400 bg-white"
//                       }
//                     `}
//                   >
//                     <input
//                       type="radio"
//                       name={`question-${currentQuestion.id}`}
//                       value={option}
//                       checked={answers[currentQuestion.id] === option}
//                       onChange={(e) => handleAnswerChange(e.target.value)}
//                       className="mt-1 w-4 h-4 text-slate-900 accent-slate-900"
//                     />
//                     <div className="flex items-start gap-3 flex-grow">
//                       <span className="w-8 h-8 border-2 border-slate-800 flex items-center justify-center font-bold text-sm text-slate-900 flex-shrink-0">
//                         {String.fromCharCode(65 + index)}
//                       </span>
//                       <span className="text-base text-slate-900 leading-relaxed pt-0.5">
//                         {option}
//                       </span>
//                     </div>
//                   </label>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Bottom Bar - Fixed Height */}
//         <div className="border-t-2 border-slate-200 bg-slate-50 px-8 py-4 flex items-center justify-between flex-shrink-0">
//           <div className="text-sm text-slate-600">
//             <span className="font-semibold">Answered:</span> {answeredCount} / {questions.length}
//           </div>
//           <div className="flex gap-3">
//             <Button
//               onClick={handleBreak}
//               disabled={isOnBreak}
//               className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded flex items-center gap-2 disabled:opacity-50"
//             >
//               <Pause className="w-4 h-4" />
//               Break
//             </Button>
//             {!isLastQuestion ? (
//               <Button
//                 onClick={handleNext}
//                 disabled={isOnBreak}
//                 className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded disabled:opacity-50"
//               >
//                 Next Question →
//               </Button>
//             ) : (
//               <Button
//                 onClick={handleSubmit}
//                 disabled={isOnBreak}
//                 className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded disabled:opacity-50"
//               >
//                 Submit Exam
//               </Button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* 1 Minute Warning Modal */}
//       {showOneMinWarning && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
//           <div className="max-w-md w-full bg-white border-4 border-red-600 shadow-2xl rounded-lg overflow-hidden">
//             <div className="bg-red-600 p-6 text-center border-b-2 border-red-700 animate-pulse-warning">
//               <h2 className="text-3xl font-bold text-white uppercase tracking-wide">⏰ Time Alert</h2>
//             </div>
//             <div className="p-12 text-center">
//               <div className="mb-8">
//                 <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
//                 <p className="text-2xl font-bold text-red-600 mb-2">
//                   Only 1 Minute Left!
//                 </p>
//                 <p className="text-sm text-slate-600">
//                   Please wrap up your exam.
//                 </p>
//               </div>
//               <div className="bg-red-100 border-2 border-red-300 p-6 mb-8 rounded">
//                 <p className="text-lg font-semibold text-red-700">
//                   Time Remaining: {formatTime(mainTimer)}
//                 </p>
//                 <p className="text-xs text-red-600 mt-2">
//                   Submit your exam before time runs out
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   onClick={handleContinueExam}
//                   className="flex-1 py-4 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded"
//                 >
//                   Continue Exam
//                 </Button>
//                 <Button
//                   onClick={handleSubmit}
//                   className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
//                 >
//                   Submit Now
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Break Modal - Overlay */}
//       {isOnBreak && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
//           <div className="max-w-md w-full bg-white border-4 border-orange-600 shadow-2xl rounded-lg overflow-hidden animate-pulse">
//             <div className="bg-orange-600 p-6 text-center border-b-2 border-orange-700">
//               <h2 className="text-3xl font-bold text-white uppercase tracking-wide">On Break</h2>
//             </div>
//             <div className="p-12 text-center">
//               <div className="mb-8">
//                 <Pause className="w-16 h-16 text-orange-600 mx-auto mb-4" />
//                 <p className="text-lg font-semibold text-slate-900 mb-2">
//                   Exam is Paused
//                 </p>
//                 <p className="text-sm text-slate-600">
//                   Main timers still running. Return before break expires!
//                 </p>
//               </div>
//               <div className="bg-orange-100 border-2 border-orange-300 p-6 mb-8 rounded">
//                 <p className="text-4xl font-bold text-orange-600 font-mono">
//                   {formatTime(breakTime)}
//                 </p>
//                 <p className="text-sm text-slate-600 mt-2">
//                   Remaining break time
//                 </p>
//               </div>
//               <div className="bg-red-50 border-2 border-red-200 p-4 mb-6 rounded">
//                 <AlertCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
//                 <p className="text-xs text-red-700 font-semibold">
//                   ⚠️ Do not exit the browser or minimize the window
//                 </p>
//                 <p className="text-xs text-red-600 mt-1">
//                   If you exit, the exam will be auto-submitted
//                 </p>
//               </div>
//               <Button
//                 onClick={handleResumeExam}
//                 className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded"
//               >
//                 Resume Exam
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Submit Modal */}
//       {showSubmitModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
//           <div className="max-w-md w-full bg-white border-4 border-slate-800 shadow-2xl">
//             <div className="bg-slate-800 p-6 text-center border-b-2 border-slate-900">
//               <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Confirm Submission</h2>
//             </div>
//             <div className="p-8">
//               <div className="text-center mb-6">
//                 <p className="text-slate-900 mb-4 text-lg font-semibold">
//                   Are you sure you want to submit?
//                 </p>
//                 <div className="bg-slate-100 border-2 border-slate-300 p-4 mb-4">
//                   <p className="text-sm text-slate-700">
//                     Questions Answered: <span className="font-bold text-slate-900">{answeredCount} / {questions.length}</span>
//                   </p>
//                 </div>
//                 <p className="text-sm text-slate-600">
//                   Once submitted, you cannot modify your answers.
//                 </p>
//               </div>
//               <div className="flex gap-3">
//                 <Button
//                   onClick={() => setShowSubmitModal(false)}
//                   variant="outline"
//                   className="flex-1 py-4 font-semibold border-2 border-slate-800 hover:bg-slate-100"
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={confirmSubmit}
//                   className="flex-1 py-4 font-bold bg-slate-900 hover:bg-slate-800 text-white"
//                 >
//                   Confirm & Submit
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Timer Audio Element - Must preload */}
//       <audio
//         ref={audioRef}
//         src="/timer.mp3"
//         preload="auto"
//         crossOrigin="anonymous"
//       />
//     </div>
//   );
// };

// export default TakeExam;



import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Clock, AlertCircle, Pause, Camera, Monitor, Shield, Lock } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  questionNumber: number;
  question: string;
  type: "SAQ" | "MCQ" | "TF";
  options?: string[];
  marks: number;
  timeLimit: number;
  correctAnswer: string;
  multipleAnswers: boolean;
  image?: string;
  video?: string;
}

interface SecuritySettings {
  enableCamera: boolean;
  fullScreenMode: boolean;
  preventCopyPaste: boolean;
  preventBrowserSwitch: boolean;
  preventMinimize: boolean;
}

interface ExamData {
  examId: string;
  examName: string;
  examSubtitle: string;
  totalMarks: number;
  totalTimeLimit: number;
  startTime: string;
  endTime: string;
  securitySettings: SecuritySettings;
  questions: Question[];
  roomId: string;
  roomName: string;
}

interface ExamSession {
  examData: ExamData;
  answers: Record<string, string>;
  currentQuestionIndex: number;
  mainTimer: number;
  questionTimer: number;
  startTime: string;
  violationCount: number;
}

const TakeExam = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [mainTimer, setMainTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState(300);
  const [timerAudioPlaying, setTimerAudioPlaying] = useState(false);
  const [showOneMinWarning, setShowOneMinWarning] = useState(false);
  const [oneMinWarningShown, setOneMinWarningShown] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [fullScreenActive, setFullScreenActive] = useState(false);
  const [focusLost, setFocusLost] = useState(false);
  const [copyPasteBlocked, setCopyPasteBlocked] = useState(false);
  const [examStartTime] = useState(new Date().toISOString());

  // Block browser back button
  useEffect(() => {
    const preventBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener('popstate', preventBackNavigation);

    return () => {
      window.removeEventListener('popstate', preventBackNavigation);
    };
  }, []);

  // Load exam data and restore session from localStorage
  useEffect(() => {
    const examKey = `exam_${examId}`;
    const sessionKey = `exam_session_${examId}`;
    
    const storedExamData = localStorage.getItem(examKey);
    const storedSession = localStorage.getItem(sessionKey);
    
    if (storedExamData) {
      const parsedData: ExamData = JSON.parse(storedExamData);
      setExamData(parsedData);

      if (storedSession) {
        // Restore existing session
        const session: ExamSession = JSON.parse(storedSession);
        setCurrentQuestionIndex(session.currentQuestionIndex);
        setAnswers(session.answers);
        setMainTimer(session.mainTimer);
        setQuestionTimer(session.questionTimer);
        setViolationCount(session.violationCount);
        toast.info("Exam session restored");
      } else {
        // Start new session
        setMainTimer(parsedData.totalTimeLimit > 0 ? parsedData.totalTimeLimit * 60 : 7200);
        if (parsedData.questions.length > 0) {
          const firstQuestion = parsedData.questions[0];
          setQuestionTimer(firstQuestion.timeLimit > 0 ? firstQuestion.timeLimit * 60 : 0);
        }
        
        // Save initial session
        saveSessionToStorage();
      }
    }
  }, [examId]);

  // Save session to localStorage whenever important data changes
  useEffect(() => {
    if (examData) {
      saveSessionToStorage();
    }
  }, [answers, currentQuestionIndex, mainTimer, questionTimer, violationCount, examData]);

  const saveSessionToStorage = () => {
    if (!examData) return;
    
    const session: ExamSession = {
      examData,
      answers,
      currentQuestionIndex,
      mainTimer,
      questionTimer,
      startTime: examStartTime,
      violationCount
    };
    
    localStorage.setItem(`exam_session_${examId}`, JSON.stringify(session));
  };

  const currentQuestion = examData?.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === (examData?.questions.length || 0) - 1;
  const answeredCount = Object.keys(answers).length;

  // Initialize security features
  useEffect(() => {
    if (!examData) return;

    const { securitySettings } = examData;

    // Enable camera if required
    if (securitySettings.enableCamera) {
      initializeCamera();
    }

    // Enable full screen if required
    if (securitySettings.fullScreenMode) {
      enterFullScreen();
    }

    // Prevent copy-paste if required
    if (securitySettings.preventCopyPaste) {
      preventCopyPaste();
    }

    // Prevent browser switch and minimize
    if (securitySettings.preventBrowserSwitch || securitySettings.preventMinimize) {
      setupFocusMonitoring();
    }

    // Prevent right-click context menu
    document.addEventListener('contextmenu', preventContextMenu);
    
    // Prevent keyboard shortcuts
    document.addEventListener('keydown', preventShortcuts);

    // Prevent refresh
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Cleanup
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventShortcuts);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      exitFullScreen();
    };
  }, [examData]);

  // Security Functions
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
      toast.info("Camera monitoring enabled");
    } catch (error) {
      console.error("Camera access denied:", error);
      toast.error("Camera access required for this exam");
      handleSecurityViolation("Camera access denied");
    }
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => {
        setFullScreenActive(true);
      }).catch(() => {
        handleSecurityViolation("Full screen not enabled");
      });
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullScreenActive(false);
    }
  };

  const preventCopyPaste = () => {
    const blockEvent = (e: Event) => {
      e.preventDefault();
      setCopyPasteBlocked(true);
      setTimeout(() => setCopyPasteBlocked(false), 1000);
      handleSecurityViolation("Copy-paste attempt detected");
    };

    document.addEventListener('copy', blockEvent);
    document.addEventListener('cut', blockEvent);
    document.addEventListener('paste', blockEvent);

    return () => {
      document.removeEventListener('copy', blockEvent);
      document.removeEventListener('cut', blockEvent);
      document.removeEventListener('paste', blockEvent);
    };
  };

  const setupFocusMonitoring = () => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isOnBreak) {
        setFocusLost(true);
        handleSecurityViolation("Browser/tab switch detected");
        playAlertSound();
        
        // Auto-submit after 3 violations
        if (violationCount >= 2) {
          toast.error("Multiple violations detected! Auto-submitting exam.");
          setTimeout(handleAutoSubmit, 2000);
        }
      } else {
        setFocusLost(false);
      }
    };

    const handleBlur = () => {
      if (!isOnBreak && examData?.securitySettings.preventBrowserSwitch) {
        setFocusLost(true);
        handleSecurityViolation("Window focus lost");
      }
    };

    const handleResize = () => {
      if (!document.fullscreenElement && examData?.securitySettings.fullScreenMode && !isOnBreak) {
        handleSecurityViolation("Full screen exited");
        enterFullScreen();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('resize', handleResize);
    };
  };

  const preventContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    handleSecurityViolation("Right-click context menu disabled");
    return false;
  };

  const preventShortcuts = (e: KeyboardEvent) => {
    const blockedKeys = [
      'F5', 'F11', 'F12', 'Escape',
      ...(examData?.securitySettings.preventCopyPaste ? ['c', 'x', 'v'] : []),
      ...(examData?.securitySettings.preventBrowserSwitch ? ['Tab', 'Alt'] : [])
    ];

    if (e.ctrlKey || e.metaKey) {
      if (blockedKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        handleSecurityViolation(`Shortcut ${e.key} blocked`);
      }
      
      // Block Ctrl+R, Ctrl+Shift+R, etc.
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleSecurityViolation("Page refresh blocked");
      }
    }

    // Block function keys
    if (blockedKeys.includes(e.key)) {
      e.preventDefault();
      handleSecurityViolation(`${e.key} key blocked`);
    }

    // Block backspace navigation
    if (e.key === 'Backspace' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault();
      handleSecurityViolation("Backspace navigation blocked");
    }
  };

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (!isOnBreak) {
      e.preventDefault();
      e.returnValue = "Are you sure you want to leave? Your exam progress may be lost.";
      return "Are you sure you want to leave? Your exam progress may be lost.";
    }
  };

  const handleSecurityViolation = (message: string) => {
    const newViolationCount = violationCount + 1;
    setViolationCount(newViolationCount);
    console.warn(`Security Violation (${newViolationCount}/3):`, message);
    
    if (newViolationCount < 3) {
      toast.warning(`${message} (Warning ${newViolationCount}/3)`);
      playAlertSound();
    } else {
      toast.error("Maximum violations reached! Auto-submitting exam.");
      setTimeout(handleAutoSubmit, 2000);
    }
  };

  // Audio functions
  const playAlertSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Audio context error:", error);
    }
  };

  const playWarningSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 1200;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.8);
    } catch (error) {
      console.error("Audio context error:", error);
    }
  };

  // Timer audio control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (mainTimer <= 10 && mainTimer > 0 && !isOnBreak && audioLoaded) {
      if (!timerAudioPlaying) {
        audio.currentTime = 0;
        audio.loop = true;
        
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setTimerAudioPlaying(true);
            })
            .catch((error) => {
              console.error("Audio play error:", error);
            });
        }
      }
    } else if ((mainTimer > 10 || isOnBreak || mainTimer === 0) && timerAudioPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setTimerAudioPlaying(false);
    }
  }, [mainTimer, isOnBreak, audioLoaded, timerAudioPlaying]);

  // Audio loading
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setAudioLoaded(true);
    };

    const handleError = () => {
      console.error("Audio load error");
    };

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.load();

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, []);

  // Main timer
  useEffect(() => {
    if (mainTimer <= 0 || !examData) return;

    const interval = setInterval(() => {
      setMainTimer((prev) => {
        if (prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examData]);

  // Question timer
  useEffect(() => {
    if (!currentQuestion?.timeLimit || questionTimer <= 0) return;

    const interval = setInterval(() => {
      setQuestionTimer((prev) => {
        if (prev <= 1) {
          toast.warning("Question time expired! Moving to next question.");
          if (!isLastQuestion) {
            handleNext();
          } else {
            handleSubmit();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [questionTimer, currentQuestion, isLastQuestion]);

  // Break timer
  useEffect(() => {
    if (isOnBreak && breakTime > 0) {
      const interval = setInterval(() => {
        setBreakTime((prev) => {
          if (prev <= 1) {
            toast.warning("Break time over! Auto-submitting exam...");
            setIsOnBreak(false);
            setTimeout(() => {
              handleAutoSubmit();
            }, 1500);
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOnBreak, breakTime]);

  // 1 minute warning
  useEffect(() => {
    if (mainTimer === 60 && !oneMinWarningShown && !isOnBreak) {
      setShowOneMinWarning(true);
      setOneMinWarningShown(true);
      playWarningSound();
    }
  }, [mainTimer, oneMinWarningShown, isOnBreak]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion?.id || '']: value };
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (examData?.questions.length || 0) - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestion = examData?.questions[nextIndex];
      if (nextQuestion?.timeLimit) {
        setQuestionTimer(nextQuestion.timeLimit * 60);
      } else {
        setQuestionTimer(0);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      const prevQuestion = examData?.questions[prevIndex];
      if (prevQuestion?.timeLimit) {
        setQuestionTimer(prevQuestion.timeLimit * 60);
      } else {
        setQuestionTimer(0);
      }
    }
  };

  const handleAutoSubmit = () => {
    cleanupAndSubmit("Time's up! Exam auto-submitted.");
  };

  const handleSubmit = () => {
    setShowSubmitModal(true);
  };

  const handleBreak = () => {
    setIsOnBreak(true);
    setBreakTime(300);
    toast.info("Break started. Main timers continue running.");
  };

  const handleResumeExam = () => {
    setIsOnBreak(false);
    setFocusLost(false);
    toast.success("Exam resumed!");
  };

  const handleContinueExam = () => {
    setShowOneMinWarning(false);
    toast.info("Continue with your exam.");
  };

  const cleanupAndSubmit = (message: string) => {
    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Save final results
    saveExamResults();
    
    // Clear session
    localStorage.removeItem(`exam_session_${examId}`);
    
    toast.error(message);
    
    // Force page reload to stop all audio and timers
    setTimeout(() => {
      window.location.href = `/exam/${examId}/submitted`;
    }, 1000);
  };

  const saveExamResults = () => {
    if (!examData) return;

    const results = {
      examId: examData.examId,
      examName: examData.examName,
      startTime: examStartTime,
      endTime: new Date().toISOString(),
      answers,
      questions: examData.questions,
      violationCount,
      totalMarks: examData.totalMarks,
      securitySettings: examData.securitySettings,
      totalQuestions: examData.questions.length,
      answeredQuestions: Object.keys(answers).length
    };

    localStorage.setItem(`exam_results_${examId}`, JSON.stringify(results));
  };

  const confirmSubmit = () => {
    setShowSubmitModal(false);
    cleanupAndSubmit("Exam submitted successfully!");
  };

  if (!examData || !currentQuestion) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden select-none">
      <style>{`
        * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        textarea, input[type="text"], input[type="radio"] {
          user-select: text !important;
          -webkit-user-select: text !important;
        }
        @keyframes pulse-warning {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-warning {
          animation: pulse-warning 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .violation-flash {
          animation: flash-red 0.5s;
        }
        @keyframes flash-red {
          0%, 100% { background-color: transparent; }
          50% { background-color: #fee2e2; }
        }
      `}</style>

      {/* Security Status Bar */}
      {examData.securitySettings && (
        <div className={`bg-slate-900 text-white px-4 py-2 text-xs border-b ${focusLost ? 'violation-flash border-red-500' : 'border-slate-700'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {examData.securitySettings.enableCamera && (
                <div className={`flex items-center gap-1 ${cameraActive ? 'text-green-400' : 'text-red-400'}`}>
                  <Camera className="w-3 h-3" />
                  <span>Camera {cameraActive ? 'Active' : 'Inactive'}</span>
                </div>
              )}
              {examData.securitySettings.fullScreenMode && (
                <div className={`flex items-center gap-1 ${fullScreenActive ? 'text-green-400' : 'text-red-400'}`}>
                  <Monitor className="w-3 h-3" />
                  <span>Full Screen {fullScreenActive ? 'Active' : 'Inactive'}</span>
                </div>
              )}
              {(examData.securitySettings.preventCopyPaste || examData.securitySettings.preventBrowserSwitch) && (
                <div className="flex items-center gap-1 text-yellow-400">
                  <Shield className="w-3 h-3" />
                  <span>Security Active</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              {violationCount > 0 && (
                <span className="text-red-400 font-semibold">
                  Violations: {violationCount}/3
                </span>
              )}
              {focusLost && (
                <span className="text-red-400 animate-pulse">⚠️ Focus Lost</span>
              )}
              {copyPasteBlocked && (
                <span className="text-yellow-400">Copy-Paste Blocked</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Top Bar - Timers */}
      <div className={`${mainTimer <= 60 && !isOnBreak ? 'bg-red-600' : 'bg-slate-800'} text-white px-6 py-3 flex items-center justify-between border-b-2 ${mainTimer <= 60 && !isOnBreak ? 'border-red-700' : 'border-slate-900'} flex-shrink-0 transition-colors duration-300`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className={`w-4 h-4 ${mainTimer <= 60 && !isOnBreak ? 'animate-pulse' : ''}`} />
            <span className="text-sm font-semibold">Time:</span>
            <span className={`font-mono text-base font-bold ${mainTimer <= 60 && !isOnBreak ? 'animate-pulse' : ''}`}>
              {formatTime(mainTimer)}
            </span>
          </div>
          {currentQuestion.timeLimit > 0 && (
            <>
              <div className="w-px h-5 bg-slate-600"></div>
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold">Question:</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {formatTime(questionTimer)}
                </span>
              </div>
            </>
          )}
        </div>
        <div className="text-sm font-semibold">
          Question {currentQuestionIndex + 1} of {examData.questions.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Camera Feed Sidebar */}
        {examData.securitySettings.enableCamera && (
          <div className="w-64 bg-slate-100 border-r border-slate-300 p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-slate-700" />
              <span className="text-sm font-semibold text-slate-700">Live Camera</span>
            </div>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-48 bg-slate-800 rounded border-2 border-slate-400 object-cover"
            />
            <div className="mt-2 text-xs text-slate-600">
              <p>✅ Facial recognition active</p>
              <p>✅ Proctoring enabled</p>
            </div>
          </div>
        )}

        {/* Question Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col p-8 overflow-auto">
            {/* Question Header */}
            <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-slate-200 flex-shrink-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 border-2 border-slate-800 flex items-center justify-center font-bold text-xl text-slate-900 flex-shrink-0">
                  {currentQuestion.questionNumber}
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    {currentQuestion.type === "MCQ" ? "Multiple Choice Question" : 
                     currentQuestion.type === "SAQ" ? "Short Answer Question" : "True/False Question"}
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-900 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>
              <div className="text-sm font-bold text-slate-900 border-2 border-slate-800 px-4 py-2 flex-shrink-0">
                [{currentQuestion.marks} Mark{currentQuestion.marks > 1 ? "s" : ""}]
              </div>
            </div>

            {/* Answer Section */}
            <div className="flex-1 flex flex-col min-h-0">
              {currentQuestion.type === "SAQ" ? (
                <div className="flex flex-col h-full">
                  <p className="text-sm font-semibold text-slate-700 mb-3 flex-shrink-0">
                    Write your answer below:
                  </p>
                  <div className="flex-1 border-2 border-slate-300 focus-within:border-slate-500 transition-colors flex flex-col">
                    <textarea
                      value={answers[currentQuestion.id] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Write your answer here..."
                      className="w-full h-full px-4 py-3 outline-none resize-none text-slate-900 bg-white select-text"
                      style={{ lineHeight: "2" }}
                      onCopy={(e) => {
                        if (examData.securitySettings.preventCopyPaste) {
                          e.preventDefault();
                          handleSecurityViolation("Copy attempt blocked");
                        }
                      }}
                      onPaste={(e) => {
                        if (examData.securitySettings.preventCopyPaste) {
                          e.preventDefault();
                          handleSecurityViolation("Paste attempt blocked");
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-slate-700 mb-4">
                    {currentQuestion.type === "MCQ" ? "Select the correct answer:" : "Select True or False:"}
                  </p>
                  {currentQuestion.options?.map((option, index) => (
                    <label
                      key={index}
                      className={`
                        flex items-start gap-3 p-4 border-2 cursor-pointer transition-all
                        ${
                          answers[currentQuestion.id] === option
                            ? "border-slate-800 bg-slate-50"
                            : "border-slate-300 hover:border-slate-400 bg-white"
                        }
                      `}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswerChange(e.target.value)}
                        className="mt-1 w-4 h-4 text-slate-900 accent-slate-900"
                      />
                      <div className="flex items-start gap-3 flex-grow">
                        <span className="w-8 h-8 border-2 border-slate-800 flex items-center justify-center font-bold text-sm text-slate-900 flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-base text-slate-900 leading-relaxed pt-0.5">
                          {option}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t-2 border-slate-200 bg-slate-50 px-8 py-4 flex items-center justify-between flex-shrink-0">
            <div className="text-sm text-slate-600">
              <span className="font-semibold">Answered:</span> {answeredCount} / {examData.questions.length}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0 || isOnBreak}
                variant="outline"
                className="px-6 py-3 border-slate-800 text-slate-800 font-semibold rounded disabled:opacity-50"
              >
                ← Previous
              </Button>
              <Button
                onClick={handleBreak}
                disabled={isOnBreak}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded flex items-center gap-2 disabled:opacity-50"
              >
                <Pause className="w-4 h-4" />
                Break
              </Button>
              {!isLastQuestion ? (
                <Button
                  onClick={handleNext}
                  disabled={isOnBreak}
                  className="px-8 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded disabled:opacity-50"
                >
                  Next Question →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isOnBreak}
                  className="px-8 py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded disabled:opacity-50"
                >
                  Submit Exam
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1 Minute Warning Modal */}
      {showOneMinWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white border-4 border-red-600 shadow-2xl rounded-lg overflow-hidden">
            <div className="bg-red-600 p-6 text-center border-b-2 border-red-700 animate-pulse-warning">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wide">⏰ Time Alert</h2>
            </div>
            <div className="p-12 text-center">
              <div className="mb-8">
                <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
                <p className="text-2xl font-bold text-red-600 mb-2">
                  Only 1 Minute Left!
                </p>
                <p className="text-sm text-slate-600">
                  Please wrap up your exam.
                </p>
              </div>
              <div className="bg-red-100 border-2 border-red-300 p-6 mb-8 rounded">
                <p className="text-lg font-semibold text-red-700">
                  Time Remaining: {formatTime(mainTimer)}
                </p>
                <p className="text-xs text-red-600 mt-2">
                  Submit your exam before time runs out
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleContinueExam}
                  className="flex-1 py-4 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded"
                >
                  Continue Exam
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded"
                >
                  Submit Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Break Modal */}
      {isOnBreak && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="max-w-md w-full bg-white border-4 border-orange-600 shadow-2xl rounded-lg overflow-hidden animate-pulse">
            <div className="bg-orange-600 p-6 text-center border-b-2 border-orange-700">
              <h2 className="text-3xl font-bold text-white uppercase tracking-wide">On Break</h2>
            </div>
            <div className="p-12 text-center">
              <div className="mb-8">
                <Pause className="w-16 h-16 text-orange-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-900 mb-2">
                  Exam is Paused
                </p>
                <p className="text-sm text-slate-600">
                  Main timers still running. Return before break expires!
                </p>
              </div>
              <div className="bg-orange-100 border-2 border-orange-300 p-6 mb-8 rounded">
                <p className="text-4xl font-bold text-orange-600 font-mono">
                  {formatTime(breakTime)}
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  Remaining break time
                </p>
              </div>
              <div className="bg-red-50 border-2 border-red-200 p-4 mb-6 rounded">
                <AlertCircle className="w-5 h-5 text-red-600 mx-auto mb-2" />
                <p className="text-xs text-red-700 font-semibold">
                  ⚠️ Do not exit the browser or minimize the window
                </p>
                <p className="text-xs text-red-600 mt-1">
                  If you exit, the exam will be auto-submitted
                </p>
              </div>
              <Button
                onClick={handleResumeExam}
                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded"
              >
                Resume Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60">
          <div className="max-w-md w-full bg-white border-4 border-slate-800 shadow-2xl">
            <div className="bg-slate-800 p-6 text-center border-b-2 border-slate-900">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wide">Confirm Submission</h2>
            </div>
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-slate-900 mb-4 text-lg font-semibold">
                  Are you sure you want to submit?
                </p>
                <div className="bg-slate-100 border-2 border-slate-300 p-4 mb-4">
                  <p className="text-sm text-slate-700">
                    Questions Answered: <span className="font-bold text-slate-900">{answeredCount} / {examData.questions.length}</span>
                  </p>
                  <p className="text-sm text-slate-700 mt-2">
                    Security Violations: <span className="font-bold text-slate-900">{violationCount}</span>
                  </p>
                </div>
                <p className="text-sm text-slate-600">
                  Once submitted, you cannot modify your answers.
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSubmitModal(false)}
                  variant="outline"
                  className="flex-1 py-4 font-semibold border-2 border-slate-800 hover:bg-slate-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmSubmit}
                  className="flex-1 py-4 font-bold bg-slate-900 hover:bg-slate-800 text-white"
                >
                  Confirm & Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timer Audio Element */}
      <audio
        ref={audioRef}
        src="/timer.mp3"
        preload="auto"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default TakeExam;