import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import AuthLayout from "./components/AuthLayout";
import RegisterPage from "./Pages/RegisterPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import { RequireAuth } from "react-auth-kit";

function App() {
  return (
    <Router>
      <Routes>
      <Route
          path="/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="home" />
            </RequireAuth>
          }
        />
        <Route
          path="/kpi/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="kpi" />
            </RequireAuth>
          }
        />
        <Route
          path="/kpi_review/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="kpi_review" />
            </RequireAuth>
          }
        />
        <Route
          path="/kpi_assessment/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="kpi_assessment" />
            </RequireAuth>
          }
        />
        <Route
          path="/team/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="team" />
            </RequireAuth>
          }
        />
        <Route
          path="/team_management/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="team_management" />
            </RequireAuth>
          }
        />
        <Route
          path="/task/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="task" />
            </RequireAuth>
          }
        />
        <Route
          path="/task_management/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="task_management" />
            </RequireAuth>
          }
        />
        <Route
          path="/task-checking/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="task-checking" />
            </RequireAuth>
          }
        />
        <Route
          path="/rubric/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="rubric" />
            </RequireAuth>
          }
        />
        <Route
          path="/rubric_review/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="rubric_review" />
            </RequireAuth>
          }
        />
        <Route
          path="/employee/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="employee" />
            </RequireAuth>
          }
        />
        <Route
          path="/change_password/"
          element={
            <RequireAuth loginPath="/login">
              <AuthLayout page="change_password" />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}

export default App;
