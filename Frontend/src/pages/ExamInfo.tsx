import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Clock, FileText, AlertCircle, Calendar, Users } from "lucide-react";
import { useEffect, useState } from "react";

interface ExamData {
  examId: string;
  examName: string;
  examSubtitle: string;
  totalMarks: number;
  totalTimeLimit: number;
  startTime: string;
  endTime: string;
  securitySettings: {
    enableCamera: boolean;
    fullScreenMode: boolean;
    preventCopyPaste: boolean;
    preventBrowserSwitch: boolean;
    preventMinimize: boolean;
  };
  questions: Array<{
    id: string;
    questionNumber: number;
    question: string;
    type: string;
    marks: number;
    timeLimit: number;
    options: string[];
    correctAnswer: string;
    multipleAnswers: boolean;
  }>;
  roomId: string;
  roomName: string;
}

const ExamInfo = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  const [examData, setExamData] = useState<ExamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load exam data from localStorage
    const examKey = `exam_${examId}`;
    const storedExamData = localStorage.getItem(examKey);
    
    if (storedExamData) {
      const parsedData = JSON.parse(storedExamData);
      setExamData(parsedData);
    }
    setLoading(false);
  }, [examId]);

  const handleStartExam = () => {
    navigate(`/exam/${examId}/take`);
  };

  // Format time for display (convert 24h to 12h format)
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Generate instructions based on security settings
  const generateInstructions = () => {
    const baseInstructions = [
      "Each question must be answered within the given time limit",
      "Once you move to the next question, you cannot go back",
      "The exam will auto-submit when time expires",
      "Ensure stable internet connection throughout the exam",
    ];

    const securityInstructions = [];

    if (examData?.securitySettings.enableCamera) {
      securityInstructions.push("Your camera will be monitored throughout the exam for proctoring");
    }

    if (examData?.securitySettings.fullScreenMode) {
      securityInstructions.push("You must remain in full-screen mode for the entire exam duration");
    }

    if (examData?.securitySettings.preventCopyPaste) {
      securityInstructions.push("Copy-paste functionality is disabled - do not attempt to bypass this");
    }

    if (examData?.securitySettings.preventBrowserSwitch) {
      securityInstructions.push("Switching browser tabs or opening new windows is prohibited");
    }

    if (examData?.securitySettings.preventMinimize) {
      securityInstructions.push("Minimizing the browser window is not allowed and will be detected");
    }

    return [...baseInstructions, ...securityInstructions];
  };

  if (loading) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam information...</p>
        </div>
      </div>
    );
  }

  if (!examData) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Exam Not Found</h2>
          <p className="text-gray-600 mb-4">The exam data could not be loaded.</p>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const instructions = generateInstructions();
  const totalDuration = examData.totalTimeLimit > 0 ? examData.totalTimeLimit : 'No time limit';

  return (
    <div 
      className="h-screen w-screen flex flex-col bg-white overflow-hidden"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      <style>{`
        .exam-info-content::-webkit-scrollbar {
          display: none;
        }
        .exam-info-content {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header with Logo */}
      <div className="border-b-2 border-gray-300 px-8 py-4 flex items-center gap-4 flex-shrink-0">
        <img 
          src="/image-removebg-preview (28).png" 
          alt="Institution Logo" 
          className="h-14 w-auto object-contain"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-blue-600">
            {examData.examName}
          </h1>
          <p className="text-sm text-gray-600">
            {examData.examSubtitle} • Room: {examData.roomName}
          </p>
        </div>
      </div>

      {/* Main Content - Scrollable with hidden scrollbar */}
      <div className="exam-info-content flex-1 overflow-y-auto px-8 py-6">
        {/* Exam Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 flex-shrink-0">
          <div className="border-2 border-gray-300 p-4 rounded-lg text-center">
            <FileText className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-blue-500 mb-1">
              {examData.questions.length}
            </p>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Questions
            </p>
          </div>

          <div className="border-2 border-gray-300 p-4 rounded-lg text-center">
            <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-green-500 mb-1">
              {examData.totalMarks}
            </p>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Total Marks
            </p>
          </div>

          <div className="border-2 border-gray-300 p-4 rounded-lg text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-3xl font-bold text-purple-500 mb-1">
              {totalDuration}
            </p>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              {examData.totalTimeLimit > 0 ? 'Minutes' : 'Time Limit'}
            </p>
          </div>

          <div className="border-2 border-gray-300 p-4 rounded-lg text-center">
            <Calendar className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-orange-500 mb-1">
              {formatTime(examData.startTime)}
            </p>
            <p className="text-xs font-semibold text-gray-600 uppercase">
              Start Time
            </p>
          </div>
        </div>

        {/* Question Type Breakdown */}
        <div className="border-2 border-gray-300 p-5 rounded-lg mb-6 bg-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <h2 className="text-lg font-bold text-blue-500">Question Types</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {examData.questions.filter(q => q.type === 'MCQ').length}
              </p>
              <p className="text-xs text-gray-600 uppercase">MCQ</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {examData.questions.filter(q => q.type === 'SAQ').length}
              </p>
              <p className="text-xs text-gray-600 uppercase">Short Answer</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {examData.questions.filter(q => q.type === 'TF').length}
              </p>
              <p className="text-xs text-gray-600 uppercase">True/False</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">
                {examData.questions.reduce((sum, q) => sum + q.marks, 0)}
              </p>
              <p className="text-xs text-gray-600 uppercase">Total Marks</p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="border-2 border-gray-300 p-5 rounded-lg mb-6 bg-gray-50">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
            <h2 className="text-lg font-bold text-blue-500">Instructions</h2>
          </div>
          <ul className="space-y-2">
            {instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 leading-relaxed pt-0.5">
                  {instruction}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Security Notice */}
        <div className="border-l-4 border-gray-900 bg-gray-100 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            ⚠️ Security Monitoring Active
          </p>
          <p className="text-xs text-gray-700">
            {examData.securitySettings.enableCamera && "• Camera monitoring is enabled\n"}
            {examData.securitySettings.fullScreenMode && "• Full-screen mode is required\n"}
            {examData.securitySettings.preventCopyPaste && "• Copy-paste is disabled\n"}
            {examData.securitySettings.preventBrowserSwitch && "• Tab switching is prevented\n"}
            {examData.securitySettings.preventMinimize && "• Window minimize is blocked\n"}
            Your actions will be recorded and reviewed for academic integrity purposes.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 px-8 py-4 bg-white flex items-center justify-between flex-shrink-0">
        <Button
          onClick={() => navigate(-1)}
          className="px-8 py-3 font-semibold border-2 border-gray-900 bg-white text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          ← Back to Terms
        </Button>
        <Button
          onClick={handleStartExam}
          className="px-8 py-3 font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all hover:scale-105"
        >
          Start Exam Now →
        </Button>
      </div>
    </div>
  );
};

export default ExamInfo;