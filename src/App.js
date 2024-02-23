import { BrowserRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import React from "react";

import supabase from "./config/supabaseClient"; // Import Supabase client

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import Update from "./pages/Update"
import SignIn from "./pages/SignIn"; // Import SignIn page
import LogIn from "./pages/LogIn"; // Import SignIn page
import ResetPassword from './pages/ResetPassword';

function App() {

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error.message);
      } else {
        window.location.reload(); // Refresh the page after sign-out
    }
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };
  return (
    <BrowserRouter>
      <nav>
        <h1>Supa Smoothies</h1>
        <Link to="/home">Home</Link>
        <Link to="/create">Create New Smoothie</Link>
        <Link to="/" onClick={signOut}>Sign Out</Link>
      </nav>
      <Routes>
        <Route path="/home"s element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/:id" element={<Update />} />
        <Route path="/" element={<SignIn />} />   
        <Route path="/login" element={<LogIn />} /> 
        <Route path="/reset-password" element={<ResetPassword/>} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
