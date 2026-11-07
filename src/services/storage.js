import { initialState } from "../data";
export const STORAGE_KEY = "kotoba-frontend-v1";
export function loadState() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (
      value?.version !== 1 ||
      !["cards", "decks", "reviews", "studyDays"].every((k) =>
        Array.isArray(value[k]),
      )
    )
      return initialState();
    if (
      !value.cards.every((c) =>
        ["id", "deckId", "front", "back"].every(
          (k) => typeof c[k] === "string",
        ),
      ) ||
      !value.decks.every(
        (d) => typeof d.id === "string" && typeof d.name === "string",
      )
    )
      return initialState();
    if (
      !value.reviews.every(
        (r) => r && typeof r.cardId === "string" && typeof r.day === "string",
      ) ||
      !value.studyDays.every((d) => typeof d === "string")
    )
      return initialState();
    if (
      value.user &&
      (typeof value.user.name !== "string" ||
        !value.user.name.trim() ||
        typeof value.user.email !== "string")
    )
      return initialState();
    return value;
  } catch {
    return initialState();
  }
}
export function saveState(value) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}
