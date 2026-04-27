import { useEffect } from "react";

const REF_COOKIE = "dyn_ref";
const SUBREF_COOKIE = "dyn_subref";
const COOKIE_DAYS = 90;

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

export function getReferralCodes(): { ref: string | null; subref: string | null } {
  return {
    ref: getCookie(REF_COOKIE),
    subref: getCookie(SUBREF_COOKIE),
  };
}

export function useReferralTracking() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    const subref = params.get("subref");

    if (ref) {
      setCookie(REF_COOKIE, ref, COOKIE_DAYS);
    }
    if (subref) {
      setCookie(SUBREF_COOKIE, subref, COOKIE_DAYS);
    }
  }, []);
}
