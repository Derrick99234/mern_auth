import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        headers: { "content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      setLoading(false);

      if (data.error) {
        setError(true);
        return;
        }
      setError(false);
    } catch (e) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 ">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          id="username"
          onChange={handleChange}
          className="bg-slate-100 p-3 outline-none rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="bg-slate-100 p-3 outline-none rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="bg-slate-100 p-3 outline-none rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "Sign up"}
        </button>
      </form>
      <div className="">
        <p className="flex gap-2 mt-5">
          Alredy have an acct?{" "}
          <span className="text-blue-500">
            <Link to="/login">Sign in</Link>
          </span>
        </p>
      </div>
      <p className="text-red-700 mt-5">{error && "Something went wrong!"}</p>
    </div>
  );
}

export default Signup;
