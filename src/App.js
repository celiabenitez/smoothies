import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import {React, useState, useEffect} from "react";

import supabase from "./config/supabaseClient"; // Import Supabase client

// pages
import Home from "./pages/Home"
import Create from "./pages/Create"
import Update from "./pages/Update"
import SignIn from "./pages/SignIn"; // Import SignIn page
import LogIn from "./pages/LogIn"; // Import SignIn page
import ResetPassword from './pages/ResetPassword';


function App() {
  //const navigate = useNavigate();
  const [user, setUser] = useState(null); // State to store user data

  
/*
    const handleSignOut = async () => {
      // First, fetch user data
      const fetchUserData = async () => {
        try {
         
            const { data, error } = await supabase.auth.getUser();
            if (error) {
              // Handle error if needed
            } else {
              setUser(data);
              console.log("User Data:", data); // Print user data to console
              // Update logged_in status in User_Smoothies table
              try {
                await supabase
                  .from("User_Smoothies")
                  .update({ logged_in: false })
                  .eq("user_id", data.user.id);
              } catch (error) {
                console.error("Error updating logged_in status:", error.message);
              }
            
          }
        } catch (error) {
          // Handle error if needed
        }
      };
  
      await fetchUserData(); // Call fetchUserData on component mount 
      
     
  
      // Then, sign out
      const { error } = await supabase.auth.signOut();
  
      if (!error) {
        //navigate("/signIn"); // Redirect after successful sign out
      } else {
        console.error('Sign out error:', error.message);
      }
    };  
  
    // Call handleSignOut when component mounts
    handleSignOut();

    */
   
    const handleSignOut = async () => {
      const { error } = await supabase.auth.signOut();
  
      if (!error) {
        //navigate("/signIn"); // Redirect after successful sign out
      } else {
        console.error('Sign out error:', error.message);
      }
    }; 
  


  return (
    <BrowserRouter>
      <nav>
        <h1>Supa Smoothies</h1>
        <Link to="/home">Home</Link>
        <Link to="/create">Create New Smoothie</Link>
        <Link to="/login" onClick={handleSignOut}>Sign Out</Link>
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
