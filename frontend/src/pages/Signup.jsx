import { useState } from "react";
import {
  useSignupMutation,
  useLoginMutation,
} from "../features/auth/authApi.js";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";
function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup, { isLoading, isError, error }] = useSignupMutation();
  const [login] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting signup form:", name, email, password);

    try {
      const signupRes = await signup({ name, email, password }).unwrap();
      console.log("Signup Success:", signupRes);

      // Automatically login the user after successful signup
      const loginRes = await login({ email, password }).unwrap();
      console.log("Auto-login Success:", loginRes);

      // Reset form
      setName("");
      setEmail("");
      setPassword("");

      // Navigate to home page after successful signup and login
      navigate("/");
    } catch (err) {
      console.error("Signup/Login Error:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ShowSocial</h1>
          <p>Create your account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {isError && (
            <p className="auth-error">
              {error?.data?.message || "Signup failed"}
            </p>
          )}

          <button className="auth-btn" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Signup"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
