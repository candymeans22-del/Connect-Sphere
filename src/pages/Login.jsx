import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import { useDispatch } from "react-redux";
import api from "../services/api";
import { loginSuccess } from "../store/AuthSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      dispatch(loginSuccess({ token: data.token, user: data.user }));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Welcome back" subtitle="Login to continue">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField Icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <InputField Icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />

        {error && (
          <p className="text-sm text-rose-deep bg-petal rounded-2xl px-4 py-2 text-center">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary text-white font-semibold shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        New here?{" "}
        <Link to="/register" className="text-primary-deep font-semibold">
          Register
        </Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link to="/home" className="text-muted font-semibold">
          Continue as guest
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;