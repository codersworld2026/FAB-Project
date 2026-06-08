/**
 * Inline, render-blocking script that applies the saved theme BEFORE first
 * paint — prevents a flash of the wrong theme (FOUC). Default is "system"
 * (auto day/night), which follows the device's appearance setting.
 *
 * Runs as the first child of <body> so it executes during HTML parsing,
 * before any styled content is painted.
 */
export function ThemeScript() {
  const js = `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);var e=document.documentElement;e.classList.toggle('dark',d);e.style.colorScheme=d?'dark':'light';}catch(e){}})();`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
