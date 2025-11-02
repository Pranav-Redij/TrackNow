import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";//this will check where token is there or not if not redirect back

import SelectRole from './components/SelectRole'; 
import DriverLogin from './components/DriverLogin';
import UserLogin from './components/UserLogin';
import DriverSignup from './components/DriverSignup';
import UserSignup from './components/UserSignup';
import HomePage from './components/HomePage';
import ChangePassword from './components/ChangePassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SelectRole />} />
        <Route path="/driverlogin" element={<DriverLogin />} />
        <Route path="/userlogin" element={<UserLogin />} />
        <Route path="/driversignup" element={<DriverSignup />} />
        <Route path="/usersignup" element={<UserSignup />} />
        <Route path="/home" element={ <ProtectedRoute>
                                                <HomePage />
                                      </ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute>
                                                    <ChangePassword />
                                                </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
