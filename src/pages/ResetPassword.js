import React, { useState } from "react";
import  supabase from "../config/supabaseClient"; // Import Supabase client
import { useNavigate, Link } from "react-router-dom";
//import "./PasswordRecovery.css"; // Import CSS file for styling

function PasswordRecovery() {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [message, setMessage] = useState(""); // State for success or error messages
    const navigate = useNavigate();

    const onButtonClick = async () => {
        setEmailError(""); // Reset any previous errors
        setMessage(""); // Reset the message

        if (!email) {
            setEmailError("Email is required");
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) {
                console.error("Error sending password recovery email:", error.message);
                setEmailError("Error sending password recovery email. Please try again later.");
            } else {
                // Set success message
                setMessage("Check your inbox for the recovery email.");
            }
        } catch (error) {
            console.error("Error sending password recovery email:", error.message);
            setEmailError("Unexpected error. Please try again later.");
        }
    };

    

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Password Recovery</div>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    value={email}
                    placeholder="Enter your email here"
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={"inputBox"}
                />
                <label className="errorLabel">{emailError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <button
                    className={"inputButton"}
                    onClick={onButtonClick}
                >
                    Send Recovery Email
                </button>
            </div>
            {/* Display the message */}
            {message && (
                <div className={"messageContainer"}>
                    <p>{message}</p>
                </div>
            )}
            <div className={"inputContainer"}>
                <p>Remember your password? <Link to="/login">Log In</Link></p>
            </div>
        </div>
    );
}

export default PasswordRecovery; 