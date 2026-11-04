import axios from "axios";

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

/**
 * Read cookie by name
 */
export const getCookie = (name) => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
  return match ? decodeURIComponent(match[3]) : null;
};

/**
 * Set cookie helper
 */
export const setCookie = (name, value, days = 90) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

/**
 * Capture ?fbclid=... and create _fbc cookie if not already set
 */
export const initFbcCookie = () => {
  if (typeof window === "undefined") return;
  const urlParams = new URLSearchParams(window.location.search);
  const fbclid = urlParams.get("fbclid");
  if (fbclid && !getCookie("_fbc")) {
    const creationTime = Date.now();
    const fbcValue = `fb.1.${creationTime}.${fbclid}`;
    setCookie("_fbc", fbcValue, 90);
  }
};

/**
 * Generate a unique event_id for Meta Pixel & CAPI deduplication
 */
export const generateEventId = () => {
  return `evt_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Fire PageView event in browser
 */
export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq && FB_PIXEL_ID) {
    window.fbq("track", "PageView");
  }
};

/**
 * Fire standard or custom event on browser Pixel with eventID for deduplication
 */
export const event = (name, options = {}, eventId = null) => {
  if (typeof window !== "undefined" && window.fbq && FB_PIXEL_ID) {
    if (eventId) {
      window.fbq("track", name, options, { eventID: String(eventId) });
    } else {
      window.fbq("track", name, options);
    }
  }
};

/**
 * Unified tracking helper: Fires client-side Pixel AND server-side CAPI with the same event_id for deduplication
 */
export const trackFacebookEvent = async (
  eventName,
  customData = {},
  { eventId = null, userData = {}, skipCapi = false } = {},
) => {
  const resolvedEventId = eventId ? String(eventId) : generateEventId();

  // 1. Browser Pixel trigger
  event(eventName, customData, resolvedEventId);

  // 2. Server CAPI trigger (if not explicitly skipped)
  if (!skipCapi) {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
      if (serverUrl) {
        const fbp = getCookie("_fbp");
        const fbc = getCookie("_fbc");
        const eventSourceUrl =
          typeof window !== "undefined" ? window.location.href : "";

        // Fire-and-forget CAPI request
        axios.post(
          `${serverUrl}/analytics/facebook-capi`,
          {
            eventName,
            eventId: resolvedEventId,
            eventSourceUrl,
            customData,
            customer: userData?.customer,
            user: userData?.user,
            fbp,
            fbc,
          },
          { withCredentials: true },
        ).catch((err) => {
          // Log only in development or debug
          if (process.env.NODE_ENV !== "production") {
            console.debug("[CAPI Frontend Proxy Error]:", err?.response?.data || err.message);
          }
        });
      }
    } catch {
      // ignore client errors
    }
  }

  return resolvedEventId;
};

