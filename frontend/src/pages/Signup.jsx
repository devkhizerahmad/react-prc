import { useState } from "react";
import { useSignupMutation } from "../../store/api/apiSlice.js";
import { useDispatch } from "react-redux";

import "../styles/auth.css";
function Signup() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup, { isLoading, isError, error }] = useSignupMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting signup form:",name, email, password);

    try {
      const res = await signup({ name, email, password }).unwrap();
      console.log("Signup Success:", res);
      // Reset form
      setName("");
      setEmail("");
      setPassword("");

      // Optionally redirect to login page after successful signup
      // You can use navigate hook from react-router-dom here
    } catch (err) {
      console.error("Signup Error:", err);
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
