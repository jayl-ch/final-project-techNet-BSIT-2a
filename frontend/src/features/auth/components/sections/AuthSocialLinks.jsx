import { Button } from "react-bootstrap";
import { useGoogleSignInButton } from "../../hooks/useGoogleSignInButton";

const AuthSocialLinks = ({ text, onGoogleSignIn }) => {
  const isSignupContext =
    typeof text === "string" && text.toLowerCase().includes("sign up");
  const { buttonRef, sdkError, googleSubmitting } = useGoogleSignInButton({
    onGoogleSignIn,
    buttonText: isSignupContext ? "signup_with" : "signin_with",
  });

  return (
    <>
      <div className="d-flex align-items-center gap-3 mb-4">
        <hr className="flex-grow-1 m-0" />
        <small className="text-muted">{text}</small>
        <hr className="flex-grow-1 m-0" />
      </div>
      <div className="d-flex gap-2 mb-4">
        {typeof onGoogleSignIn === "function" ? (
          <div className="flex-grow-1 d-flex justify-content-center" ref={buttonRef} />
        ) : (
          <Button
            type="button"
            variant="outline-secondary"
            size="sm"
            className="flex-grow-1 py-2"
            aria-label="Sign in with Google"
            disabled
          >
            <i className="bi bi-google"></i>
          </Button>
        )}
      </div>
      {(sdkError || googleSubmitting) && (
        <div
          className={`alert py-2 ${sdkError ? "alert-danger" : "alert-info"}`}
          role={sdkError ? "alert" : "status"}
        >
          {sdkError || "Completing Google sign-in..."}
        </div>
      )}
    </>
  );
};

export default AuthSocialLinks;
