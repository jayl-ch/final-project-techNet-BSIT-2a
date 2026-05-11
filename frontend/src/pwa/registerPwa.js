import { registerSW } from "virtual:pwa-register";

export const registerPwa = () => {
  const updateSW = registerSW({
    onNeedRefresh() {
      const shouldUpdate = window.confirm(
        "A new version is available. Reload to update?",
      );

      if (shouldUpdate) {
        updateSW(true);
      }
    },
    onOfflineReady() {
      console.info("TaskWise is ready to work offline.");
    },
  });

  return updateSW;
};
