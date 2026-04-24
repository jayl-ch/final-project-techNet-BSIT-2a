import { useLogin } from "../hooks/useLogin";
import { useSocialAuth } from "../hooks/useSocialAuth";
import { AuthLogin, AuthPageShell } from "../components";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loading, error, login } = useLogin();
  const {
    loading: googleLoading,
    error: googleError,
    loginWithGoogle,
  } = useSocialAuth();
  const navigate = useNavigate();

  const handleLogin = async (credentials) => {
    const loginResult = await login(credentials);
    if (loginResult) {
      navigate("/dashboard");
    }
  };

  const handleGoogleLogin = async (idToken) => {
    const loginResult = await loginWithGoogle(idToken);
    if (loginResult) {
      navigate("/dashboard");
      return true;
    }

    return false;
  };

  return (
    <AuthPageShell cardName="Login Form">
      <AuthLogin
        onSubmit={handleLogin}
        onGoogleSignIn={handleGoogleLogin}
        loading={loading || googleLoading}
        error={error || googleError}
      />
    </AuthPageShell>
  );
};

export default Login;
