/* eslint-disable jsx-a11y/alt-text */
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { userLoggedOut } from "../../features/auth/authSlice";
import successToast from "../../utils/successToast";
import { activeClass } from "../../utils/activeNavLinkTracker";

const StudentNavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { name } = useSelector((state) => state.auth?.user) || {};

  const logout = () => {
    dispatch(userLoggedOut());
    localStorage.removeItem("LWSLearningPortalAppAuth");
    successToast("Logout Successful");
    navigate("/");
  };
  return (
    <nav className="shadow-md">
      <div className="max-w-7xl px-5 lg:px-0 mx-auto flex justify-between py-3">
        <img className="h-10" src="/assets/image/learningportal.svg" />
        <div className="flex items-center gap-3">
          <NavLink to="/course" className={activeClass}>
            Course
          </NavLink>
          <NavLink to="/leaderboard" className={activeClass}>
            Leaderboard
          </NavLink>
          <h2>{name}</h2>
          <button
            className="flex gap-2 border border-cyan items-center px-4 py-1 rounded-full text-sm transition-all hover:bg-cyan"
            onClick={logout}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default StudentNavbar;
