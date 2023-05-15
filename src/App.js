import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import useCheckAuth from "./hooks/useCheckAuth";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminNavbar from "./components/admin/AdminNavbar";
import Assignment from "./pages/admin/Assignment";
import AssignmentMark from "./pages/admin/AssignmentMark";
import Quizes from "./pages/admin/Quizes";
import Videos from "./pages/admin/Videos";
import LeaderBoard from "./pages/student/LeaderBoard";
import Register from "./pages/student/Register";
import StudentLogin from "./pages/student/StudentLogin";
import StudentNavbar from "./components/student/StudentNavbar";
import AdminPublicRoute from "./components/admin/AdminPublicRoute";
import AdminPrivateRoute from "./components/admin/AdminPrivateRoute";
import StudentPublicRoute from "./components/student/StudentPublicRoute";
import StudentPrivateRoute from "./components/student/StudentPrivateRoute";
import CoursePlayer from "./pages/student/CoursePlayer";
import VideoPlayer from "./pages/student/VideoPlayer";
import Quiz from "./pages/student/Quiz";

function App() {
  const authChecked = useCheckAuth();
  const { user } = useSelector((state) => state.auth) || {};
  const { pageUrl } = useSelector((state) => state.customization);
  return (
    <>
      {authChecked && (
        <Router>
          {pageUrl !== "/" &&
            pageUrl !== "/admin" &&
            pageUrl !== "/register" && (
              <>
                {user?.role === "admin" && <AdminNavbar />}
                {user?.role === "student" && <StudentNavbar />}
              </>
            )}
          <Routes>
            <Route
              path="/"
              element={
                <StudentPublicRoute>
                  <StudentLogin />
                </StudentPublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <StudentPublicRoute>
                  <Register />
                </StudentPublicRoute>
              }
            />
            <Route
              path="/course/*"
              element={
                <StudentPrivateRoute>
                  <CoursePlayer />
                </StudentPrivateRoute>
              }
            >
              <Route
                path="videos/:videoId"
                element={
                  <StudentPrivateRoute>
                    <VideoPlayer />
                  </StudentPrivateRoute>
                }
              />
            </Route>
            <Route
              path="/leaderboard"
              element={
                <StudentPrivateRoute>
                  <LeaderBoard />
                </StudentPrivateRoute>
              }
            />
            <Route
              path="quizes/:videoId"
              element={
                <StudentPrivateRoute>
                  <Quiz />
                </StudentPrivateRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <AdminPublicRoute>
                  <AdminLogin />
                </AdminPublicRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminPrivateRoute>
                  <AdminDashboard />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/assignment"
              element={
                <AdminPrivateRoute>
                  <Assignment />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/videos"
              element={
                <AdminPrivateRoute>
                  <Videos />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/quizes"
              element={
                <AdminPrivateRoute>
                  <Quizes />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/admin/assignment-mark"
              element={
                <AdminPrivateRoute>
                  <AssignmentMark />
                </AdminPrivateRoute>
              }
            />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
