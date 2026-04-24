import { Button } from "react-bootstrap";

const AuthLoginOptions = () => {
  return (
    <div className="row mb-4">
      <div className="col-6">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
          />
          <label className="form-check-label small fw-medium" htmlFor="rememberMe">
            Remember me
          </label>
        </div>
      </div>
      <div className="col-6 text-end">
        <Button
          variant="link"
          href="#"
          className="text-primary text-decoration-none fw-bold"
        >
          Forgot password?
        </Button>
      </div>
    </div>
  );
};

export default AuthLoginOptions;
