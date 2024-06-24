import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInFailure,
  signInStart,
  signInSucess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import OAuth from "../components/OAuth";

function Signin() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        headers: { "content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.error) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSucess(data));
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (e) {
      dispatch(signInFailure(e));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 ">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
          {loading ? "loading..." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="">
        <p className="flex gap-2 mt-5">
          Don&apos;t have an acct?{" "}
          <span className="text-blue-500">
            <Link to="/register">Sign up</Link>
          </span>
        </p>
      </div>
      <p className="text-red-700 mt-5">
        {error ? error.message || "Something went wrong!" : " "}
      </p>
    </div>
  );
}

export default Signin;
