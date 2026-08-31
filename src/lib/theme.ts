/** Prefix for every localStorage key. S11 progress must use this too. */
export const STORAGE_PREFIX = "learn-coptic:";
export const THEME_KEY = `${STORAGE_PREFIX}theme`;

/** Runs in <head> before paint. Keep in sync with ThemeToggle. */
export const themeBootScript = `(function(){try{var k=${JSON.stringify(THEME_KEY)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);}catch(e){}})();`;
