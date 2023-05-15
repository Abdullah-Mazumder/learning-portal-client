/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authAPI";
import Spinner from "../../components/Spinner";
import successToast from "../../utils/successToast";
import errorToast from "../../utils/errorToast";
import { useDispatch } from "react-redux";
import { setPageUrl } from "../../features/customization/customizationSlice";

const StudentLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [studentLogin, { isLoading, isError, isSuccess }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = (e) => {
    e.preventDefault();
    studentLogin({ email, password, role: "student" });
  };

  useEffect(() => {
    if (isSuccess) {
      successToast("Logg In Successful!");
      navigate("/leaderboard");
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (isError) {
      errorToast("Invalid Credentials!");
    }
  }, [isError]);

  useEffect(() => {
    dispatch(setPageUrl("/"));
    return () => {
      dispatch(setPageUrl(""));
    };
  }, [dispatch]);
  return (
    <section className="py-6 bg-primary h-screen grid place-items-center">
      <div className="mx-auto max-w-md px-5 lg:px-0">
        <div>
          <img
            className="h-12 mx-auto"
            src="/assets/image/learningportal.svg"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-100">
            Sign in to Student Account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={login}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="login-input rounded-t-md"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="login-input rounded-b-md"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link
                to="/register"
                className="font-medium text-violet-600 hover:text-violet-500"
              >
                Create New Account
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default StudentLogin;
