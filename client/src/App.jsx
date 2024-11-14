
import React from "react"
import {BrowserRouter,Routes,Route} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from "./components/landingpage";
import Register from "./components/register";
import Login from "./components/login";
import Home from "./components/home";
import ForgotPassword from "./components/forgotPassword";
import Resetpassword from "./components/resetpassword2.0";
import View from "./components/view";
import Subscribe from "./components/subscribe";
import Plans from "./components/plans";
import Watchlater from "./components/watchlater";
import Watchhistory from "./components/watchhistory";
import ChangePassword from "./components/changePassword";
import './app.css';

import ProtectedRoute from "./components/protectedRoute";


function App() {



 

  return (
    
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage/>}></Route>
      <Route path="/register" element={<Register/>}></Route>
      <Route path="/login" element={<Login/>}></Route>
      <Route path="/forgotpassword" element={<ForgotPassword/>}></Route>
      <Route path="/home" element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
      <Route path="/resetpassword2.0" element={<Resetpassword/>}></Route>
      <Route path="/movie/:id" element={<View/>}></Route>
      <Route path="/plans" element={<Plans/>}></Route>
      <Route path="/subscribe" element={<Subscribe/>}></Route>
      <Route path="/watchlater" element={<ProtectedRoute><Watchlater/></ProtectedRoute>}></Route>
      <Route path="/watchhistory" element={<ProtectedRoute><Watchhistory/></ProtectedRoute>}/>
      <Route path="/changepassword" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>}></Route>
    
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
