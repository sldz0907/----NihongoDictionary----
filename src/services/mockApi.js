import { words } from "../data";
export const normalize = (s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .trim();
const delay = () => new Promise((r) => setTimeout(r, 350));
export async function searchWords(query, direction, filter, fail = false) {
  await delay();
  if (fail) throw new Error("Không thể tải dữ liệu mẫu. Hãy thử lại.");
  return words.filter(
    (w) =>
      (!query.trim() ||
        (direction === "vi"
          ? normalize(
              [w.meaning, ...(w.senses || []).map((s) => s.meaning)].join(" "),
            ).includes(normalize(query))
          : [w.word, w.reading, w.romaji, ...(w.readings || [])].some((v) =>
              v.toLowerCase().includes(query.trim().toLowerCase()),
            ))) &&
      (filter === "Tất cả" || w.tags.includes(filter)),
  );
}
export async function recognizeStrokes(strokes, fail = false) {
  await delay();
  if (fail) throw new Error("Không nhận được kết quả mẫu. Hãy thử lại.");
  return strokes.length ? ["学", "日", "食", "本", "明"] : [];
}
export const sampleText = "毎日、日本語を勉強しています。";
export async function recognizeImage(fail = false) {
  await delay();
  if (fail) throw new Error("Không thể xử lý ảnh mẫu. Hãy thử lại.");
  return sampleText;
}
export async function analyzeText(text, fail = false) {
  await delay();
  if (fail) throw new Error("Không thể phân tích mẫu. Hãy thử lại.");
  const tokens = words
    .filter((w) => text.includes(w.word))
    .map((w) => ({
      id: w.id,
      front: w.word,
      reading: w.reading,
      back: w.meaning,
      example: text,
      translation: "",
      kind: "Từ vựng",
    }));
  if (text.includes("ています"))
    tokens.push({
      id: "grammar-teiru",
      front: "〜ている",
      reading: "",
      back: "Diễn tả hành động đang diễn ra hoặc trạng thái tiếp diễn.",
      example: text,
      translation: "",
      kind: "Ngữ pháp",
    });
  return tokens;
}
