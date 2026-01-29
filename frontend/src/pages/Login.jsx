import { useState } from "react";
import { useLoginMutation } from "../features/auth/authApi";
import { useAppDispatch } from "../app/hooks";
import { setCredentials } from "../features/auth/authSelectors";

function Login() {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, isError, error }] = useLoginMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res.data));
      console.log("Login Success:", res.data);
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
            Don’t have an account? <span>Signup</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
