import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = "http://localhost:8080/api";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/x-www-form-urlencoded",
                    },

                    body: new URLSearchParams({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Login failed"
                );
            }

            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify({
                    userId: data.userId,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                })
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            setError(
                error.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            {/* Background decoration */}
            <div className="login-background">
                <div className="circle circle-one"></div>
                <div className="circle circle-two"></div>
            </div>

            <div className="login-card">

                {/* Logo */}
                <div className="login-logo">
                    <span>PG</span>
                </div>

                <div className="login-header">
                    <h1>PG Management</h1>

                    <p>
                        Welcome back, Admin
                    </p>
                </div>

                {error && (
                    <div className="login-error">
                        <span>⚠</span>
                        <span>{error}</span>
                    </div>
                )}

                <form
                    onSubmit={handleLogin}
                    className="login-form"
                >

                    {/* Email */}
                    <div className="login-field">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                ✉
                            </span>

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="admin@example.com"
                                required
                                autoComplete="email"
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                🔒
                            </span>

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
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
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* Login button */}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign In
                                <span className="arrow">
                                    →
                                </span>
                            </>
                        )}
                    </button>

                </form>

<div className="login-footer">
    <span>Don't have an account?</span>

    <button
        type="button"
        className="login-link"
        onClick={() => navigate("/register")}
    >
        Create Admin Account
    </button>
</div>

            </div>
        </div>
    );
}

export default Login;