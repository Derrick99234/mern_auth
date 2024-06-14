import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
function Header() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link>
          <h1 className="font-bold">Auth App</h1>
        </Link>
        <ul className="flex gap-4">
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/profile"}>
              {currentUser ? (
                <img
                  src={currentUser.user.profileIMG}
                  alt="profile"
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <span>sign in</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Header;
