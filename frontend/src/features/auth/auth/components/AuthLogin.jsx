import { EmailInput, PasswordInput } from "./fields";
import { Button } from "react-bootstrap";
import { AuthHeader, AuthLoginOptions, AuthSocialLinks } from "./sections";
import { Link } from "react-router-dom";
import { useState } from "react";

const AuthLogin = ({ onSubmit, onGoogleSignIn, loading, error }) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [validationError, setValidationError] = useState("");

  const isEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleChange = (e) => {
    if (validationError) {
      setValidationError("");
    }

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedEmail = form.email.trim();

    if (!normalizedEmail || !form.password) {
      setValidationError("Email and password are required.");
      return;
    }

    if (!isEmail(normalizedEmail)) {
      setValidationError("Please enter a valid email address.");
      return;
    }

    if (form.password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    onSubmit({
      email: normalizedEmail,
      password: form.password,
    });
  };

  return (
    <>
      <AuthHeader
        icon="bi-calendar-check"
        title="Welcome Back"
        subtitle="Sign in to manage your tasks"
      />
      <form onSubmit={handleSubmit}>
        <EmailInput value={form.email} onChange={handleChange} />
        <PasswordInput
          value={form.password}
          onChange={handleChange}
          autoComplete="current-password"
        >
          <div className="invalid-feedback" id="password-error">
            Password is required.
          </div>
        </PasswordInput>
        <AuthLoginOptions />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100 fw-bold mb-3"
          disabled={loading || !form.email.trim() || !form.password}
        >
          <i className="bi bi-box-arrow-in-right me-2"></i>
          {loading ? "Logging in..." : "Sign in"}
        </Button>
        {(validationError || error) && (
          <div className="alert alert-danger py-2" role="alert">
            {validationError || error}
          </div>
        )}
        <AuthSocialLinks
          text="Or continue with"
          onGoogleSignIn={onGoogleSignIn}
        />
        <div className="text-center mt-3">
          <p className="text-muted small mb-0 d-flex align-items-center justify-content-center gap-1">
            Don&apos;t have an account?{" "}
            <Button
              as={Link}
              to="/register"
              variant="link"
              className="text-primary fw-bold text-decoration-none p-0"
            >
              Sign up here
            </Button>
          </p>
        </div>
      </form>
    </>
  );
};

export default AuthLogin;
