import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleLogin, handleSignup } from "./utils/auth";

export default function AuthToggle() {
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [color, setColor] = useState(null);
  const navigate = useNavigate();

  const onLogin = async () => {
    const result = await handleLogin(email, password);
    if (result.success) {
        setMessage("Logged in successfully!");
        setColor("green");
        navigate("/calendar");
    }
    else {
        setMessage(result.error);
        setColor("red");
    }
  };

  const onSignup = async () => {
    const result = await handleSignup(username, email, password);
    if (result.success) {
        setMessage("Signup successful!");
        setColor("green");
        navigate("/calendar");
    }
    else {
        setMessage(result.error);
        setColor("red");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-md">
      <div className="flex mb-4 border-b w-full">
        <button
          onClick={() => setActiveTab("login")}
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "login"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setActiveTab("signup")}
          className={`flex-1 py-2 text-center font-semibold ${
            activeTab === "signup"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-blue-500"
          }`}
        >
          Signup
        </button>
      </div>

      <div className="space-y-3">
        {activeTab === "signup" && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded"
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={activeTab === "login" ? onLogin : onSignup}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {activeTab === "login" ? "Login" : "Signup"}
        </button>

        {message && <p className="text-center" style={{color}}>{message}</p>}
      </div>
    </div>
  );
}
