import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, AtSign, Mail, Lock } from "lucide-react";
import AuthLayout from "../components/AuthLayout";
import InputField from "../components/InputField";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Could not reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Join ConnectSphere" subtitle="Create your account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField Icon={User} name="name" placeholder="Full name" value={form.name} onChange={handleChange} />
        <InputField Icon={AtSign} name="username" placeholder="Username" value={form.username} onChange={handleChange} />
        <InputField Icon={Mail} name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <InputField Icon={Lock} name="password" type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={handleChange} />

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
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="text-primary-deep font-semibold">
          Login
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

export default Register;