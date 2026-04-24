import { AuthPageShell, AuthRegister } from "../components";
import { useNavigate } from "react-router-dom";
import { useRegister } from "../hooks/useRegister";
import { useSocialAuth } from "../hooks/useSocialAuth";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const { loading, error, register } = useRegister();
  const {
    loading: googleLoading,
    error: googleError,
    loginWithGoogle,
  } = useSocialAuth();
  const [successMessage, setSuccessMessage] = useState("");

  const handleRegister = async (credentials) => {
    const registerResult = await register(credentials);

    if (registerResult) {
      setSuccessMessage("Account created successfully. Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  const handleGoogleSignIn = async (idToken) => {
    const loginResult = await loginWithGoogle(idToken);

    if (loginResult) {
      navigate("/dashboard");
      return true;
    }

    return false;
  };

  return (
    <AuthPageShell cardName="Register Form" className="py-4">
      <AuthRegister
        onSubmit={handleRegister}
        loading={loading}
        error={error}
        socialLoading={googleLoading}
        socialError={googleError}
        onGoogleSignIn={handleGoogleSignIn}
        successMessage={successMessage}
      />
    </AuthPageShell>
  );
};

export default Register;
