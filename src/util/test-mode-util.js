export const setTestModeDefault = () => {
  var testModeSession = sessionStorage.getItem("test-mode");
  if (testModeSession) {
    if (testModeSession === "true") {
      return true;
    } else {
      return false;
    }
  } else {
    sessionStorage.setItem("test-mode", false);
  }
};

export const isTestModeOn = () => {
  return sessionStorage.getItem("test-mode") === "true";
};
