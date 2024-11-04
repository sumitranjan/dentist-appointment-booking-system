import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient"; // Adjust this import based on your setup

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user from local storage on initial load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [role, setRole] = useState(() => {
    // Retrieve role from local storage on initial load
    const storedRole = localStorage.getItem("role");
    return storedRole ? storedRole : null;
  });

  const [name, setName] = useState(() => {
    // Retrieve role from local storage on initial load
    const storedName = localStorage.getItem("name");
    return storedName ? storedName : null;
  });

  // const [loading, setLoading] = useState(true); // New loading state

  // useEffect(() => {
  //   console.log("Useeffect effect:");

  //   // Check the session on component mount
  //   const getUperProfile = async () => {
  //     const session = await supabase.auth.getSession();
  //     if (session.data.session) {
  //       console.log("session effetc:", session);
  //       console.log("useeffect id:", session.data.session.user.id);

  //       setUser(session.data.session.user);
  //       fetchUserProfile(session.data.session.user.id);
  //     }

  //     // Listen for changes in the auth state
  //     const {
  //       data: { subscription },
  //     } = supabase.auth.onAuthStateChange(async (event, session) => {
  //       if (session) {
  //         console.log("session:", session);
  //         setUser(session.user);
  //         fetchUserProfile(session.user.id);
  //       } else {
  //         setUser(null);
  //         setRole(null);
  //       }
  //       // setLoading(false); // Set loading to false when done
  //     });

  //     return () => {
  //       subscription.unsubscribe();
  //     };
  //   };
  //   getUperProfile();
  // }, [role]);
  useEffect(() => {
    console.log("Running useEffect on mount");

    // Define the async function directly within useEffect
    const fetchSessionAndSubscribe = async () => {
      // console.log("Fetching initial session");

      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        // console.log("Session found on mount:", sessionData.session);
        setUser(sessionData.session.user);
        await fetchUserProfile(sessionData.session.user.id);
      }

      // // Listen for auth state changes
      // const {
      //   data: { subscription },
      // } = supabase.auth.onAuthStateChange(async (event, session) => {
      //   console.log("Auth state change detected:", event);

      //   if (session) {
      //     console.log("New session:", session);
      //     setUser(session.user);
      //     await fetchUserProfile(session.user.id);
      //   } else {
      //     console.log("No session found (user signed out)");
      //     setUser(null);
      //     setRole(null);
      //   }
      // });

      // // Cleanup function to unsubscribe
      // return () => {
      //   console.log("Cleaning up subscription");
      //   subscription.unsubscribe();
      // };
    };

    // Call the async function
    fetchSessionAndSubscribe();
  }, []);

  const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role, fullName")
      .eq("id", userId)
      .single();

    console.log("userId", userId, "fetchUserProfile: data", data);

    if (data) {
      setRole(data.role);
      localStorage.setItem("role", data.role); // Store role in local storage
      localStorage.setItem("name", data.fullName);
    } else if (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const login = async (email, password) => {
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });
    // console.log("loginData:", loginData);

    if (loginError) return alert(loginError.message);
    fetchUserProfile(loginData.user.id);
    setUser(loginData.user);
    localStorage.setItem("user", JSON.stringify(loginData.user)); // Store user in local storage
  };

  //     setRole(profileData.role); // Set role from profile
  //     console.log("profileData:", profileData);
  const register = async (email, password) => {
    const { user, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user)); // Store user in local storage
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, register, logout, name }}>
      {children}
    </AuthContext.Provider>
  );
};

// export const useAuth = () => useContext(AuthContext);
// export { AuthContext };
export const useAuth = () => useContext(AuthContext);
export { AuthContext };
