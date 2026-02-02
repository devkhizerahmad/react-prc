import { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../features/auth/authSlice";
import "../styles/auth.css";
function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      console.log("Login Success:", res.data.token);
      // Navigate to home or dashboard after successful login
      dispatch(
        setCredentials({ user: res?.data?.user, token: res?.data?.token })
      );
      navigate("/card");
    } catch (err) {
      console.error("Login Error:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>ShowSocial</h1>
          <p>Welcome back</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
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
              {error?.data?.message || "Login failed"}
            </p>
          )}

          <button className="auth-btn" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don’t have an account? <a href="/signup">Signup</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
