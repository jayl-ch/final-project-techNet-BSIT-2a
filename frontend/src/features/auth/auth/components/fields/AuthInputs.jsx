import { useState } from "react";

export const UsernameInput = ({ placeholder, value, onChange }) => (
  <div className="mb-4">
    <label htmlFor="username" className="form-label fw-bold">
      Username
    </label>
    <div className="input-group">
      <span className="input-group-text border-end-0">
        <i className="bi bi-person text-muted"></i>
      </span>
      <input
        type="text"
        className="form-control border-start-0"
        id="username"
        name="username"
        autoComplete="username"
        placeholder={placeholder}
        required
        aria-required="true"
        aria-describedby="username-error"
        onChange={onChange}
        value={value}
      />
    </div>
    <div className="invalid-feedback" id="username-error">
      Username is required.
    </div>
  </div>
);

export const EmailInput = ({ value, onChange }) => (
  <div className="mb-4">
    <label htmlFor="email" className="form-label fw-bold">
      Email Address
    </label>
    <div className="input-group">
      <span className="input-group-text border-end-0">
        <i className="bi bi-envelope text-muted"></i>
      </span>
      <input
        type="email"
        className="form-control border-start-0"
        id="email"
        name="email"
        autoComplete="email"
        placeholder="Enter your email"
        required
        aria-required="true"
        aria-describedby="email-error"
        onChange={onChange}
        value={value}
      />
    </div>
    <div className="invalid-feedback" id="email-error">
      Please enter a valid email address.
    </div>
  </div>
);

export const PasswordInput = ({ onChange, value, children, autoComplete }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor="password" className="form-label fw-bold">
        Password
      </label>
      <div className="input-group">
        <span className="input-group-text border-end-0">
          <i className="bi bi-lock text-muted"></i>
        </span>

        <input
          type={show ? "text" : "password"}
          className="form-control border-start-0 border-end-0"
          id="password"
          name="password"
          autoComplete={autoComplete || "current-password"}
          placeholder="Enter your password"
          required
          aria-describedby="password-error"
          onChange={onChange}
          value={value}
        />

        <button
          className="btn border"
          type="button"
          onClick={() => setShow(!show)}
          aria-label="Show or hide password"
          aria-pressed={show}
        >
          <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>
      </div>

      {children}
    </div>
  );
};

export const ConfirmPassword = ({ value, onChange }) => {
  const [show, setShow] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor="confirmPassword" className="form-label fw-semibold">
        Confirm Password
      </label>
      <div className="input-group">
        <span className="input-group-text border-end-0">
          <i className="bi bi-lock text-muted"></i>
        </span>
        <input
          type={show ? "text" : "password"}
          className="form-control border-start-0 border-end-0"
          id="confirmPassword"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          required
          aria-required="true"
          aria-describedby="confirmPassword-error"
          onChange={onChange}
          value={value}
        />
        <button
          className="btn border password-toggle"
          type="button"
          onClick={() => setShow(!show)}
          aria-label="Show or hide confirm password"
          aria-pressed={show}
        >
          <i className={`bi ${show ? "bi-eye-slash" : "bi-eye"}`}></i>
        </button>
      </div>
      <div className="invalid-feedback" id="confirmPassword-error">
        Passwords do not match.
      </div>
    </div>
  );
};
