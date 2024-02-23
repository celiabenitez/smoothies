import React, { useState } from "react";
import { supabase, createUser } from "../config/supabaseClient"; // Import Supabase client
import { useNavigate, Link } from "react-router-dom";
import "./SignIn.css"; // Import CSS file for styling

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    const onButtonClick = async () => {
        // Reset any previous errors
        setEmailError("");
        setPasswordError("");

        // Perform validation
        if (!email) {
            setEmailError("Email is required");
            return;
        }
        if (!password) {
            setPasswordError("Password is required");
            return;
        }

        try {
            // Create user with email and password
            const { user, error } = await createUser(email, password);

            if (error) {
                console.error("Error signing up:", error.message); // Log the error message
                setEmailError("Error signing up: " + error.message); // Display the error message to the user
            } else {
                navigate("/home");
            }
        } catch (error) {
            console.error("Error signing up:", error.message);
        }
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Sign Up</div>
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
                <input
                    value={password}
                    placeholder="Enter your password here"
                    onChange={(ev) => setPassword(ev.target.value)}
                    className={"inputBox"}
                    type="password"
                />
                <label className="errorLabel">{passwordError}</label>
            </div>
            <br />
            <div className={"inputContainer"}>
                <input
                    className={"inputButton"}
                    type="button"
                    onClick={onButtonClick}
                    value={"Sign Up"}
                />
            </div>
            <div className={"inputContainer"}>
                <p>Already have an account? <Link to="/login">Log In</Link></p>
            </div>
        </div>
    );
}

export default SignIn;
