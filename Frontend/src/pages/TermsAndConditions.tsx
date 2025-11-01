import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { CheckCircle2, Circle, Camera, Monitor, Shield, Lock } from "lucide-react";

interface Term {
  id: string;
  text: string;
  icon?: React.ReactNode;
}

interface SecuritySettings {
  enableCamera: boolean;
  fullScreenMode: boolean;
  preventCopyPaste: boolean;
  preventBrowserSwitch: boolean;
  preventMinimize: boolean;
}

const TermsAndConditions = () => {
  const navigate = useNavigate();
  const { examId } = useParams();
  
  const [acceptedTerms, setAcceptedTerms] = useState<Set<string>>(new Set());
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings | null>(null);
  const [examData, setExamData] = useState<any>(null);

  useEffect(() => {
    // Load exam data and security settings from localStorage
    const examKey = `exam_${examId}`;
    const storedExamData = localStorage.getItem(examKey);
    
    if (storedExamData) {
      const parsedData = JSON.parse(storedExamData);
      setExamData(parsedData);
      setSecuritySettings(parsedData.securitySettings);
    }
  }, [examId]);

  // Generate dynamic terms based on security settings
  const generateTerms = (): Term[] => {
    const baseTerms: Term[] = [
      { 
        id: "1", 
        text: "I understand that this exam must be completed in one sitting without closing the browser.",
        icon: <Monitor className="w-4 h-4" />
      },
      { 
        id: "2", 
        text: "I will not use any unauthorized materials, notes, or external assistance during the exam.",
        icon: <Shield className="w-4 h-4" />
      },
      { 
        id: "3", 
        text: "I understand that any violation of exam rules may result in disqualification.",
        icon: <Lock className="w-4 h-4" />
      },
    ];

    const securityTerms: Term[] = [];

    if (securitySettings?.enableCamera) {
      securityTerms.push({
        id: "camera",
        text: "I acknowledge that my camera will be monitored throughout the exam for academic integrity purposes.",
        icon: <Camera className="w-4 h-4" />
      });
    }

    if (securitySettings?.fullScreenMode) {
      securityTerms.push({
        id: "fullscreen",
        text: "I agree to remain in full-screen mode throughout the exam duration and not to exit it.",
        icon: <Monitor className="w-4 h-4" />
      });
    }

    if (securitySettings?.preventCopyPaste) {
      securityTerms.push({
        id: "copy-paste",
        text: "I understand that copy-paste functionality will be disabled and I will not attempt to bypass this restriction.",
        icon: <Lock className="w-4 h-4" />
      });
    }

    if (securitySettings?.preventBrowserSwitch) {
      securityTerms.push({
        id: "browser-switch",
        text: "I will not switch browser tabs or open new windows during the exam. The system will detect and report any attempts.",
        icon: <Monitor className="w-4 h-4" />
      });
    }

    if (securitySettings?.preventMinimize) {
      securityTerms.push({
        id: "minimize",
        text: "I will not minimize the browser window during the exam. The system monitors window focus and any minimization will be recorded.",
        icon: <Monitor className="w-4 h-4" />
      });
    }

    // If no security features are enabled, add a static message
    if (securityTerms.length === 0) {
      securityTerms.push({
        id: "basic-security",
        text: "Standard exam conditions apply. Please maintain academic integrity throughout the examination.",
        icon: <Shield className="w-4 h-4" />
      });
    }

    // Add timing terms if exam has time limit
    if (examData?.totalTimeLimit && examData.totalTimeLimit > 0) {
      baseTerms.push({
        id: "timing",
        text: `I understand this exam has a time limit of ${examData.totalTimeLimit} minutes and must be completed within this timeframe.`,
        icon: <Monitor className="w-4 h-4" />
      });
    }

    return [...baseTerms, ...securityTerms];
  };

  const terms = generateTerms();

  const toggleTerm = (termId: string) => {
    const newAccepted = new Set(acceptedTerms);
    if (newAccepted.has(termId)) {
      newAccepted.delete(termId);
    } else {
      newAccepted.add(termId);
    }
    setAcceptedTerms(newAccepted);
  };

  const allAccepted = terms.every((term) => acceptedTerms.has(term.id));

  const handleNext = () => {
    if (allAccepted) {
      // Store acceptance in localStorage
      const acceptanceData = {
        examId,
        acceptedAt: new Date().toISOString(),
        acceptedTerms: Array.from(acceptedTerms),
        securitySettings
      };
      localStorage.setItem(`terms_accepted_${examId}`, JSON.stringify(acceptanceData));
      
      navigate(`/exam/${examId}/info`);
    }
  };

  // Show loading while security settings are being loaded
  if (!securitySettings) {
    return (
      <div className="h-screen w-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam security settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="h-screen w-screen bg-white flex flex-col overflow-hidden"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* Hide scrollbar for all browsers */}
      <style>{`
        .terms-container::-webkit-scrollbar {
          display: none;
        }
        .terms-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Header with Logo */}
      <div className="border-b-2 border-gray-300 px-8 py-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <img 
            src="/image-removebg-preview (28).png" 
            alt="Institution Logo" 
            className="h-16 w-auto object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Terms & Conditions
            </h1>
            <p className="text-sm text-gray-600">
              {examData?.examName || "Exam"} - Security Requirements
            </p>
            <div className="flex gap-2 mt-1">
              {securitySettings.enableCamera && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                  <Camera className="w-3 h-3" />
                  Camera Monitoring
                </span>
              )}
              {securitySettings.fullScreenMode && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  <Monitor className="w-3 h-3" />
                  Full Screen
                </span>
              )}
              {(securitySettings.preventCopyPaste || securitySettings.preventBrowserSwitch || securitySettings.preventMinimize) && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                  <Shield className="w-3 h-3" />
                  Strict Monitoring
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings Summary */}
      <div className="bg-blue-50 border-b border-blue-200 px-8 py-4">
        <div className="max-w-4xl">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Exam Security Features Enabled:
          </h3>
          <div className="flex flex-wrap gap-4 text-xs text-blue-800">
            {securitySettings.enableCamera && (
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Camera Monitoring
              </span>
            )}
            {securitySettings.fullScreenMode && (
              <span className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                Full Screen Mode
              </span>
            )}
            {securitySettings.preventCopyPaste && (
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Copy-Paste Disabled
              </span>
            )}
            {securitySettings.preventBrowserSwitch && (
              <span className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                Tab Switching Prevention
              </span>
            )}
            {securitySettings.preventMinimize && (
              <span className="flex items-center gap-1">
                <Monitor className="w-3 h-3" />
                Minimize Prevention
              </span>
            )}
            {!securitySettings.enableCamera && 
             !securitySettings.fullScreenMode && 
             !securitySettings.preventCopyPaste && 
             !securitySettings.preventBrowserSwitch && 
             !securitySettings.preventMinimize && (
              <span className="text-gray-600">
                Standard security measures applied
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Terms List - Scrollable with hidden scrollbar */}
      <div className="terms-container flex-grow overflow-y-auto px-8 py-6">
        <div className="space-y-3 max-w-4xl">
          {terms.map((term) => {
            const isAccepted = acceptedTerms.has(term.id);
            return (
              <div
                key={term.id}
                onClick={() => toggleTerm(term.id)}
                className={`
                  flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-all duration-150 group
                  ${isAccepted 
                    ? 'bg-blue-50 border-blue-400 shadow-sm' 
                    : 'bg-white border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <div className={`
                  p-2 rounded-full flex-shrink-0 transition-colors
                  ${isAccepted 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                  }
                `}>
                  {term.icon}
                </div>
                
                <div className="flex-1 flex items-start gap-3">
                  {isAccepted ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                  )}
                  <p className={`text-sm leading-relaxed flex-1 ${isAccepted ? 'text-gray-900 font-medium' : 'text-gray-700'}`}>
                    {term.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-300 px-8 py-6 bg-white flex items-center justify-between flex-shrink-0">
        <div>
          <p className="text-sm text-gray-700 font-medium">
            {acceptedTerms.size} of {terms.length} terms accepted
          </p>
          <p className="text-xs text-gray-500 mt-1">
            You must accept all terms to proceed with the exam
          </p>
        </div>
        <Button
          onClick={handleNext}
          disabled={!allAccepted}
          className={`
            px-8 py-3 rounded-lg font-semibold text-base transition-all duration-200
            ${allAccepted 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:scale-105' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue to Exam ›
        </Button>
      </div>
    </div>
  );
};

export default TermsAndConditions;