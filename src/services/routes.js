import { useState, useEffect } from "react";
const paths = {
  search: "/dictionary",
  decks: "/decks",
  review: "/review",
  profile: "/account",
  analysis: "/analysis",
  reminders: "/reminders",
  login: "/login",
};
export function readRoute() {
  const decode = (value) => {
    try {
      return decodeURIComponent(value);
    } catch {
      return "__invalid__";
    }
  };
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (!parts.length) return { page: "search" };
  if (parts[0] === "words" && parts.length === 2)
    return { page: "detail", id: decode(parts[1]) };
  if (parts[0] === "decks" && parts.length === 2)
    return { page: "decks", id: decode(parts[1]) };
  const page = Object.keys(paths).find(
    (k) => paths[k] === "/" + parts.join("/"),
  );
  return { page: page || "notfound" };
}
export function useAppRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const pop = () => setRoute(readRoute());
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  function navigate(page, id, replace = false) {
    const url =
      page === "detail"
        ? `/words/${encodeURIComponent(id)}`
        : page === "decks" && id
          ? `/decks/${encodeURIComponent(id)}`
          : paths[page] || "/dictionary";
    history[replace ? "replaceState" : "pushState"]({}, "", url);
    setRoute(readRoute());
  }
  return [route, navigate];
}
