import { useEffect, useRef, useState } from "react";

let googleScriptPromise;

const loadGoogleScript = () => {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (!googleScriptPromise) {
    googleScriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Unable to load Google script")),
          { once: true },
        );

        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Unable to load Google script"));

      document.head.appendChild(script);
    });
  }

  return googleScriptPromise;
};

export const useGoogleSignInButton = ({
  onGoogleSignIn,
  buttonText = "signin_with",
}) => {
  const [sdkError, setSdkError] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    const initGoogle = async () => {
      if (typeof onGoogleSignIn !== "function") {
        return;
      }

      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

      if (!googleClientId) {
        if (isActive) {
          setSdkError("Google sign-in is not configured on the client");
        }

        return;
      }

      try {
        await loadGoogleScript();

        if (!isActive || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (!response?.credential || typeof onGoogleSignIn !== "function") {
              return;
            }

            if (!isActive) {
              return;
            }

            setSdkError("");
            setGoogleSubmitting(true);
            const success = await onGoogleSignIn(response.credential);

            if (!isActive) {
              return;
            }

            if (!success) {
              setSdkError("Google sign-in failed. Please try again.");
            }

            setGoogleSubmitting(false);
          },
        });

        buttonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          text: buttonText,
          shape: "rectangular",
          width: 280,
        });
      } catch {
        if (isActive) {
          setSdkError("Unable to load Google sign-in");
        }
      }
    };

    initGoogle();

    return () => {
      isActive = false;
    };
  }, [buttonText, onGoogleSignIn]);

  return {
    buttonRef,
    sdkError,
    googleSubmitting,
  };
};
