// import { Button } from "../components/ui/button";
// import { useNavigate } from "react-router-dom";
// import {
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "../../src/firebaseConfig";

// const providerGoogle = new GoogleAuthProvider();
// const Login = () => {
// const navigate = useNavigate();

// const handleGoogleSignIn = async () => {
//   try {
//     const cred = await signInWithPopup(auth, providerGoogle);
//     const firebaseUser = cred.user;
//     console.log(firebaseUser);
//     navigate("/dashboard",{ replace: true });
//   } catch (err) {
//     alert(err.message);
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
//       <div className="text-center space-y-8 p-8">
//         <div className="space-y-4">
//           <h1 className="text-6xl font-bold text-foreground tracking-tight">
//             Examly
//           </h1>
//           <p className="text-lg text-muted-foreground">
//             Modern Online Exam Platform
//           </p>
//         </div>
        
//         <Button
//           onClick={handleGoogleSignIn}
//           size="lg"
//           className="bg-card hover:bg-card/90 text-foreground border border-border shadow-lg hover:shadow-xl transition-all duration-200 gap-3 px-8 py-6 text-base"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24">
//             <path
//               fill="currentColor"
//               d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
//             />
//             <path
//               fill="currentColor"
//               d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
//             />
//             <path
//               fill="currentColor"
//               d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
//             />
//             <path
//               fill="currentColor"
//               d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
//             />
//           </svg>
//           Login with Google
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Login;



import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom";
import logoImage from "/image-removebg-preview (27).png";
import gifImage from "/online-exam-unscreen.gif";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../../src/firebaseConfig";
import { useEffect } from "react";
import axios from "axios";

const providerGoogle = new GoogleAuthProvider();



const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  });
  return () => unsubscribe();
}, [navigate]);

const handleGoogleSignIn = async () => {
  try {
    const cred = await signInWithPopup(auth, providerGoogle);
    const firebaseUser = cred.user;
    console.log(firebaseUser);

        // Step 2️⃣ — Prepare user data
    const userData = {
      uid: firebaseUser.uid,
      name: firebaseUser.displayName,
      email: firebaseUser.email,
      photoURL: firebaseUser.photoURL,
    };
     const res = await axios.post("http://localhost:5000/api/users/createuser", userData);

    if (res.status === 200 || res.status === 201) {
      console.log("✅ User stored successfully:", res.data);
    } else {
      console.warn("⚠️ User storage response:", res);
    }
    navigate("/dashboard",{ replace: true });
    localStorage.setItem("uid",firebaseUser.uid);
  } catch (err) {
    alert(err.message);
  }
};

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative overflow-hidden select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      <style>{`
        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        
        *::-webkit-scrollbar {
          display: none;
        }

        html, body {
          overflow: hidden;
        }

        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        .animated-gradient {
          background: linear-gradient(-45deg, #f1faffff,  #93adf6ff, #f0f7ffff);
          background-size: 400% 400%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>

      {/* Animated background elements */}
      <div className="animated-gradient absolute inset-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-cyan-300/20 via-transparent to-transparent"></div>
      
      {/* GIF in bottom right corner */}
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none select-none">
        <img 
          src={gifImage} 
          alt="Exam Animation" 
          className="w-74 h-64 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 select-none"
          draggable="false"
        />
      </div>

      {/* Glass morphism container */}
      <div className="relative backdrop-blur-xl bg-white/80 border border-blue-200/60 rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4 z-10 select-none">
        <div className="text-center space-y-6">
          {/* Logo Section */}
          <div className="flex justify-center select-none">
            <div className="relative group select-none">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
              <img 
                src={logoImage} 
                alt="Examly Logo" 
                className="w-32 h-32 object-contain relative z-10 drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-300 select-none"
                draggable="false"
              />
            </div>
          </div>

          {/* Title Section */}
          <div className="space-y-3 select-none pointer-events-none">
            <p className="text-lg text-slate-700 font-light">
              Modern Online Exam Platform
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto rounded-full"></div>
          </div>
          
          {/* Login Button */}
          <div className="pt-2">
            <Button
              onClick={handleGoogleSignIn}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg hover:shadow-blue-400/60 transition-all duration-300 gap-3 px-8 py-7 text-base font-semibold rounded-xl group relative overflow-hidden select-none"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <svg className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24">
                <path
                  fill="#FFFFFF"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#FFFFFF"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FFFFFF"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#FFFFFF"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="relative z-10">Continue with Google</span>
            </Button>
          </div>

          {/* Additional Info */}
          <p className="text-sm text-slate-600 pt-2 select-none pointer-events-none">
            Secure authentication powered by Google
          </p>

          {/* Powered by SnapCode */}
          <div className="pt-6 border-t border-blue-200/50 select-none pointer-events-none">
            <p className="text-sm text-slate-600 font-light tracking-wide">
              Powered by <span className="font-semibold text-blue-600">SnapCode</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;