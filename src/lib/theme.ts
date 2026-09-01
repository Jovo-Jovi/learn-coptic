/** Prefix for every localStorage key. S11 progress must use this too. */
export const STORAGE_PREFIX = "learn-coptic:";
export const THEME_KEY = `${STORAGE_PREFIX}theme`;
export const COPTIC_FONT_KEY = `${STORAGE_PREFIX}coptic-font`;
export const LEITNER_KEY = `${STORAGE_PREFIX}leitner`;

export const COPTIC_FACES = ["serif", "sans", "athanasius"] as const;
export type CopticFace = (typeof COPTIC_FACES)[number];

export function isCopticFace(value: string): value is CopticFace {
  return (COPTIC_FACES as readonly string[]).includes(value);
}

/** Runs in <head> before paint. Keep in sync with ThemeToggle and FontSelect. */
export const themeBootScript = `(function(){try{var r=document.documentElement;var tk=${JSON.stringify(THEME_KEY)};var t=localStorage.getItem(tk);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}r.classList.remove("light","dark");r.classList.add(t);var fk=${JSON.stringify(COPTIC_FONT_KEY)};var f=localStorage.getItem(fk);if(f!=="serif"&&f!=="sans"&&f!=="athanasius")f="serif";r.setAttribute("data-coptic-font",f);}catch(e){}})();`;
