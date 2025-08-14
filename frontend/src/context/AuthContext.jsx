import { createContext, useState, useEffect, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../services/firebase';
import { getUserByFirebaseId } from '../services/userServices';

const auth = getAuth(app);

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userData = await getUserByFirebaseId(user.uid);
          setCurrentUser({
            ...userData,
            firebaseUser: user
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setCurrentUser({
            firebaseUser: user
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    loading,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};