import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import supabase  from "../config/supabaseClient"; // Import Supabase client

function LogIn() {
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
            // Sign in user with email and password
            const { user,session, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error("Error signing in:", error.message);
                setEmailError("Error signing in: " + error.message);
            } else {
                navigate("/home");
            }
        } catch (error) {
            console.error("Error signing in:", error.message);
        }
    };

    return (
        <div className={"mainContainer"}>
            <div className={"titleContainer"}>
                <div>Log In</div>
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
                    value={"Log In"}
                />
            </div>
            <div className={"inputContainer"}>
                <p>Don't have an account? <Link to="/">Sign Up</Link></p>
                <p> <Link to="/reset-password">Forgot your password?</Link></p>
            </div>
        </div>
    );
}

export default LogIn;
