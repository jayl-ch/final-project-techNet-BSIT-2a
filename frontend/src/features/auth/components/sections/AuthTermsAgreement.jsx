const AuthTermsAgreement = ({ checked, onChange }) => {
  return (
    <div className="mb-4">
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="terms"
          name="terms"
          required
          aria-required="true"
          checked={checked}
          onChange={onChange}
        />
        <label className="form-check-label small" htmlFor="terms">
          I agree to the{" "}
          <a href="#" className="text-primary text-decoration-none">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary text-decoration-none">
            Privacy Policy
          </a>
        </label>
      </div>
    </div>
  );
};

export default AuthTermsAgreement;
