import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 ">Sign Up</h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="bg-slate-100 p-3 outline-none rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="bg-slate-100 p-3 outline-none rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="bg-slate-100 p-3 outline-none rounded-lg"
        />
        <button
          disabled
          className="bg-slate-700 p-3 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          Sign up
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
    </div>
  );
}

export default Signup;
