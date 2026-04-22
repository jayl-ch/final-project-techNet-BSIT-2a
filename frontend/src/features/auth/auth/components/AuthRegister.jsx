import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import {
  UsernameInput, EmailInput, PasswordInput, ConfirmPassword,
} from "./fields";
import { AuthHeader, AuthSocialLinks, AuthTermsAgreement } from "./sections";

const AuthRegister = ({
  onSubmit,
  loading,
  error,
  successMessage,
  socialLoading,
  socialError,
  onGoogleSignIn,
}) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");

    const normalizedUsername = form.username.trim();
    const normalizedEmail = form.email.trim();

    if (!normalizedUsername || !normalizedEmail || !form.password) {
      setValidationError("Please complete all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setValidationError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      setValidationError("You must agree to the terms to continue.");
      return;
    }

    onSubmit({
      username: normalizedUsername,
      email: normalizedEmail,
      password: form.password,
    });
  };

  const isSubmitDisabled =
    loading ||
    !form.username.trim() ||
    !form.email.trim() ||
    !form.password ||
    !form.confirmPassword ||
    !form.terms;

  return (
    <>
      <AuthHeader
        icon="bi-person-plus"
        iconClass="text-success"
        title="Create Account"
        subtitle="Join Smart Task Manager today"
      />
      <form onSubmit={handleSubmit}>
        <UsernameInput
          placeholder="Choose your username"
          onChange={handleChange}
          value={form.username}
        />
        <EmailInput onChange={handleChange} value={form.email} />
        <PasswordInput
          onChange={handleChange}
          value={form.password}
          autoComplete="new-password"
        >
          <div className="password-strength" id="passwordStrength"></div>
          <small
            id="password-help"
            className="form-text text-muted d-block mt-1"
          >
            At least 6 characters
          </small>
        </PasswordInput>
        <ConfirmPassword onChange={handleChange} value={form.confirmPassword} />
        <AuthTermsAgreement checked={form.terms} onChange={handleChange} />
        <Button
          type="submit"
          variant="success"
          size="lg"
          className="w-100 fw-bold mb-3"
          disabled={isSubmitDisabled}
        >
          <i className="bi bi-check-circle me-2"></i>
          {loading ? "Creating account..." : "Create Account"}
        </Button>
        {(validationError || error) && (
          <div className="alert alert-danger py-2" role="alert">
            {validationError || error}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success py-2" role="status">
            {successMessage}
          </div>
        )}
        {socialError && (
          <div className="alert alert-danger py-2" role="alert">
            {socialError}
          </div>
        )}
        <AuthSocialLinks
          text={socialLoading ? "Connecting to Google..." : "Or sign up with"}
          onGoogleSignIn={onGoogleSignIn}
        />
        <div className="text-center">
          <p className="text-muted small mb-0 d-flex align-items-center justify-content-center gap-1">
            Already have an account?
            <Button
              as={Link}
              to="/login"
              variant="link"
              className="text-primary fw-bold text-decoration-none p-0"
            >
              Sign in here
            </Button>
          </p>
        </div>
      </form>
    </>
  );
};

export default AuthRegister;
