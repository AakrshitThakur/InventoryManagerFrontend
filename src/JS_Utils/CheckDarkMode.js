// A JS function to check if darkmode is active or not in HTML element
export const CheckDarkMode = (SetIsDarkModeActive) => {
  const observer = new MutationObserver(() => {
    SetIsDarkModeActive(document.documentElement.classList.contains('dark'));
  });

  // Observe changes to the `class` attribute of the <html> element
  observer.observe(document.documentElement, { attributes: true });

  // Return the observer instance so it can be cleaned up when needed
  return observer;
};