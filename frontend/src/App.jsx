import { Routes, Route } from 'react-router-dom';
import AuthForm from './containers/AuthForm.jsx';
import Dashboard from "./pages/Dashboard.jsx";
import AddExpense from "./pages/AddExpense.jsx";
import AddPolicy from "./pages/AddPolicy.jsx";
import Error from './pages/Error';
import Expenses from "./pages/Expenses.jsx";
import ExpenseDetails from "./pages/ExpenseDetails.jsx";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Policies from "./pages/Policies.jsx";
import PolicyDetails from "./pages/PolicyDetails.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import RegisterCompany from "./pages/RegisterCompany.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import CompanyDetails from "./pages/CompanyDetails.jsx";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header/>
      <main className="flex items-center justify-center min-h-[600px] py-8">
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<AuthForm mode="login"/>}/>
          <Route path="/signup" element={<AuthForm mode="signup"/>}/>
          <Route path="/profile" element={<ProtectedRoute><UserProfile/></ProtectedRoute>}/>

          <Route path="dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path="/register-company" element={<ProtectedRoute><RegisterCompany/></ProtectedRoute>}/>
          <Route path="/company/:id" element={<ProtectedRoute><CompanyDetails/></ProtectedRoute>}/>

          <Route path="/expenses" element={<ProtectedRoute><Expenses /></ProtectedRoute>}/>
          <Route path="/expenses/:id" element={<ProtectedRoute><ExpenseDetails /></ProtectedRoute>}/>
          <Route path="/expenses/create" element={<ProtectedRoute><AddExpense /></ProtectedRoute>}/>

          <Route path="/policies" element={<ProtectedRoute><Policies /></ProtectedRoute>}/>
          <Route path="/policies/:id" element={<ProtectedRoute><PolicyDetails /></ProtectedRoute>}/>
          <Route path="/policies/create" element={<ProtectedRoute><AddPolicy /></ProtectedRoute>}/>

          <Route path="*" element={<Error/>}/>
        </Routes>
      </main>
      <Footer/>
    </div>
  );
};

export default App;