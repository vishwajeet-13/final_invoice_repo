import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useUser } from "../context/UserContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const SubmitHandler = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/user/login", { username, password });

      if (response.status === 200) {
        const userData = response.data.user;
        login(userData);
        toast.success("Login successful!");
        navigate("/home");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Invalid Username or password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-[#F3F3F3]">
      <div className="h-screen w-screen flex flex-col justify-center scale-[0.85] items-center bg-[#F3F3F3] px-4 text-[0.95rem] sm:text-base">
        <h1 className="text-xl sm:text-2xl font-semibold mb-8 text-[#383838]">
          Login to My Invoice App
        </h1>

        <form
          onSubmit={SubmitHandler}
          className="px-4 sm:px-8 py-6 rounded-lg bg-white flex flex-col items-center justify-center w-full max-w-[320px] min-h-[300px] sm:max-w-[400px] shadow-sm"
        >
          <div className="relative w-full mb-4">
            <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-base" />
            <input
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="py-2 pl-10 pr-3 placeholder:text-sm sm:placeholder:text-base rounded-lg bg-[#F3F3F3] w-full focus:outline-none"
            />
          </div>

          <div className="relative w-full mb-5">
            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm" />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="py-2 pl-10 pr-3 placeholder:text-sm sm:placeholder:text-base rounded-lg bg-[#F3F3F3] w-full focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm  mb-3">{error}</p>}
          <div className="flex justify-end w-full mb-3">
            <p className="text-sm text-gray-500 hover:underline cursor-pointer transition">
              Forgot Password?
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-base text-white rounded-md py-2 transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-[#171717] hover:bg-black"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
