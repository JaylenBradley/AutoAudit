import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import AuthForm from './containers/AuthForm.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import Error from './pages/Error';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserProfile from "./pages/UserProfile.jsx";

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Header/>
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/login" element={<AuthForm mode="login"/>}/>
                <Route path="/signup" element={<AuthForm mode="signup"/>}/>
                <Route path="dashboard" element={
                  <ProtectedRoute>
                    <Dashboard/>
                  </ProtectedRoute>
                }/>
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile/>
                  </ProtectedRoute>
                }/>
                <Route path="*" element={<Error/>}/>
              </Routes>
            </main>
            <Footer/>
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;