export function getBookingLocation(link: string) {
  if (!link.trim()) return null;
  try {
    const url = new URL(/^https?:\/\//i.test(link) ? link : `https://cal.com/${link.replace(/^\/+/, "")}`);
    const path = url.pathname.replace(/^\/+|\/+$/g, "");
    return path ? { url: url.toString(), path, origin: url.origin } : null;
  } catch { return null; }
}
