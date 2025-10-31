// import { useEffect, useState } from "react";
// import { onAuthStateChanged } from "firebase/auth";
// import { Navigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";

// const ProtectedRoute = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       setUser(firebaseUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div className="text-center mt-20" >Loading...</div>;

//   // If not logged in, go to login page
//   if (!user) return <Navigate to="/" replace />;

//   // If logged in, render the protected page
//   return children;
// };

// export default ProtectedRoute;




import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #e8f0ff, #f8fbff)",
        }}
      >
        {/* Loader animation */}
        <div
          style={{
            width: "fit-content",
            fontWeight: "bold",
            fontFamily: "monospace",
            fontSize: "30px",
            color: "#1e3a8a",
            clipPath: "inset(0 3ch 0 0)",
            animation: "l4 1s steps(4) infinite",
          }}
        >
          Loading...
        </div>

        {/* Animation keyframes defined dynamically */}
        <style>
          {`
            @keyframes l4 {
              to {
                clip-path: inset(0 -1ch 0 0);
              }
            }
          `}
        </style>

        <p
          style={{
            marginTop: "10px",
            color: "#475569",
            fontSize: "14px",
            fontWeight: 500,
            letterSpacing: "0.05em",
          }}
        >
          Verifying your session...
        </p>
      </div>
    );

  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;

