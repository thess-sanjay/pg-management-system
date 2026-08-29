
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";

const API_BASE_URL = "http://localhost:8080/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    const handleRegister = async (e) => {

        e.preventDefault();

        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                `${API_BASE_URL}/auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },

                    body: new URLSearchParams({
                        name,
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message || "Registration failed"
                );

            }

            navigate("/login");

        } catch (error) {

            console.error(
                "Registration error:",
                error
            );

            setError(
                error.message ||
                "Unable to create account"
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            {/* Background */}

            <div className="login-background">

                <div className="circle circle-one"></div>

                <div className="circle circle-two"></div>

            </div>


            {/* Register Card */}

            <div className="login-card">

                {/* Logo */}

                <div className="login-logo">
                    <span>PG</span>
                </div>


                {/* Header */}

                <div className="login-header">

                    <h1>
                        Create Admin Account
                    </h1>

                    <p>
                        Set up your PG Management System account
                    </p>

                </div>


                {/* Error */}

                {error && (

                    <div className="login-error">

                        <span>⚠</span>

                        {error}

                    </div>

                )}


                {/* Form */}

                <form
                    className="login-form"
                    onSubmit={handleRegister}
                >


                    {/* NAME */}

                    <div className="login-field">

                        <label>
                            Full Name
                        </label>

                        <div className="input-wrapper">

                            <User className="input-icon" />

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                required
                            />

                        </div>

                    </div>


                    {/* EMAIL */}

                    <div className="login-field">

                        <label>
                            Email
                        </label>

                        <div className="input-wrapper">

                            <Mail className="input-icon" />

                            <input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                            />

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="login-field">

                        <label>
                            Password
                        </label>

                        <div className="input-wrapper">

                            <Lock className="input-icon" />

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Create a password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword
                                    ? <EyeOff size={15} />
                                    : <Eye size={15} />
                                }

                            </button>

                        </div>

                    </div>


                    {/* CONFIRM PASSWORD */}

                    <div className="login-field">

                        <label>
                            Confirm Password
                        </label>

                        <div className="input-wrapper">

                            <Lock className="input-icon" />

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                placeholder="Confirm your password"
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >

                                {showConfirmPassword
                                    ? <EyeOff size={15} />
                                    : <Eye size={15} />
                                }

                            </button>

                        </div>

                    </div>


                    {/* REGISTER BUTTON */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading ? (

                            <>
                                <span className="spinner"></span>
                                Creating Account...
                            </>

                        ) : (

                            <>
                                Create Account
                                <ArrowRight className="arrow" size={18} />
                            </>

                        )}

                    </button>

                </form>


                {/* FOOTER */}

                <div className="login-footer">

                    <span>
                        Already have an account?
                    </span>

                    <button
                        type="button"
                        className="login-link"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>

    );

}

export default Register;
