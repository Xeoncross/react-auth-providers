/* global window */
import OAuthPopupOpen from "./OAuthPopupOpen";

const WINDOW_CLOSED = "WINDOW_CLOSED";
const INVALID_ORIGIN = "INVALID_ORIGIN";

const popup = (provider, url, origin, name) => {
  const authWindow = OAuthPopupOpen(provider, url, name);

  // Create IE8 + others compatible event handler
  const eventMethod = window.addEventListener
    ? "addEventListener"
    : "attachEvent";
  const eventer = window[eventMethod];
  const messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";

  // Listen to message from child window
  const authPromise = new Promise((resolve, reject) => {
    // If either the window is closed, or we get a message
    let handled = false;

    // properly expose event to GC
    const removeListener = () => {
      if (window.removeEventListener) {
        window.removeEventListener("message", eventListener);
      } else if (window.detachEvent) {
        // IE8+
        // see jquery, detachEvent needed property on element, by name of that event, to properly expose it to GC
        if (typeof window.onmessage === "undefined") window.onmessage = null;
        window.detachEvent("onmessage", eventListener);
      }
    };

    // Detect the window being closed
    let checker = setInterval(() => {
      if (authWindow.closed) {
        if (!handled) {
          handled = true;
          resolve({ error: WINDOW_CLOSED });
          clearInterval(checker);
          removeListener();
        }
      }
    }, 400);

    // Detect the login complete and the window sending back the data we need
    let eventListener = eventer(
      messageEvent,
      e => {
        // resolve() already called
        if (handled) {
          return;
        }

        handled = true;
        authWindow.close();
        clearInterval(checker);
        removeListener();

        // same-origin
        // if (e.origin === window.location.origin) {
        if (e.origin === origin) {
          resolve(e.data);
        } else {
          resolve({ error: INVALID_ORIGIN });
        }
      },
      origin
    );
  });

  return authPromise;
};

export default popup;
