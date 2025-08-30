type PatchedGlobal = typeof globalThis & {
  __LOGGER_PATCHED__?: boolean;
};

const g = globalThis as PatchedGlobal;
if (!g.__LOGGER_PATCHED__) {
  g.__LOGGER_PATCHED__ = true;

  const nativeLog = console.log.bind(console);
  const nativeWarn = console.warn.bind(console);
  const nativeError = console.error.bind(console);
  const nativeInfo = console.info.bind(console);
  const nativeDebug = console.debug.bind(console);

  const isProd = process.env.NODE_ENV === "production";

  const isStyled = (args: unknown[]) =>
    typeof args[0] === "string" && (args[0] as string).includes("%c");

  const styleInfo =
    "background:#4CAF50;color:#111;padding:0 5px;border-radius:10px;font-weight:600";
  const styleWarn =
    "background:#FFC107;color:#111;padding:0 5px;border-radius:10px;font-weight:600";
  const styleError =
    "background:#F44336;color:#111;padding:0 5px;border-radius:10px;font-weight:600";
  const styleDebug =
    "background:#2196F3;color:#111;padding:0 5px;border-radius:10px;font-weight:600";

  function info(...args: unknown[]) {
    if (isStyled(args)) return nativeInfo(...args);
    nativeInfo("%cINFO", styleInfo, ...args);
  }

  function warn(...args: unknown[]) {
    if (isStyled(args)) return nativeWarn(...args);
    nativeWarn("%cWRN", styleWarn, ...args);
  }

  function error(...args: unknown[]) {
    if (isStyled(args)) return nativeError(...args);
    nativeError("%cERR", styleError, ...args);
  }

  function debug(...args: unknown[]) {
    if (isProd) return;
    if (isStyled(args)) return nativeLog(...args);
    nativeDebug("%cDEBG", styleDebug, ...args);
  }

  console.log = info;
  console.warn = warn;
  console.error = error;
  console.debug = debug;
}
