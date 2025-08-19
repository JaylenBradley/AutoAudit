import { Routes, Route } from 'react-router-dom';
import AuthForm from './containers/AuthForm.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import Error from './pages/Error';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RegisterCompany from "./pages/RegisterCompany.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import CompanyDetails from "./pages/CompanyDetails.jsx";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<AuthForm mode="login"/>}/>
          <Route path="/signup" element={<AuthForm mode="signup"/>}/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile/>
            </ProtectedRoute>
          }/>
          <Route path="dashboard" element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path="/register-company" element={
            <ProtectedRoute>
              <RegisterCompany/>
            </ProtectedRoute>
          }/>
          <Route path="/company/:id" element={
            <ProtectedRoute>
              <CompanyDetails/>
            </ProtectedRoute>
          }
          />
          <Route path="*" element={<Error/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  );
};

export default App;