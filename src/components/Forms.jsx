import React, { useState } from "react";
import { Plus, Check } from "lucide-react";
export function CardForm({ data, modal, save, createDeck, onClose }) {
  const card = modal.card,
    word = modal.word;
  const [form, setForm] = useState({
      id: card?.id,
      wordId: card?.wordId || word?.id,
      deckId: card?.deckId || modal.deckId || data.decks[0]?.id || "",
      front: card?.front || word?.word || "",
      reading: card?.reading || word?.reading || "",
      back: card?.back || word?.meaning || "",
      example: card?.example || word?.example || "",
      translation: card?.translation || word?.translation || "",
    }),
    [error, setError] = useState(""),
    [newDeck, setNewDeck] = useState(false),
    [newName, setNewName] = useState("");
  const field = (name, value) => setForm((f) => ({ ...f, [name]: value }));
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!form.front.trim() || !form.back.trim()) {
          setError("Hãy điền cả mặt trước và mặt sau.");
          return;
        }
        setError(save(form));
      }}
    >
      <p className="modal-description">
        Chọn bộ và kiểm tra hai mặt trước khi lưu.
      </p>
      <label>
        Bộ thẻ
        <select
          aria-label="Bộ thẻ"
          value={form.deckId}
          onChange={(e) => field("deckId", e.target.value)}
          required
        >
          <option value="" disabled>
            Chọn bộ thẻ
          </option>
          {data.decks.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      {newDeck ? (
        <div className="inline-create">
          <input
            aria-label="Tên bộ mới"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tên bộ mới"
            maxLength={100}
          />
          <button
            type="button"
            className="secondary"
            onClick={() => {
              if (!newName.trim()) return;
              field("deckId", createDeck(newName.trim()));
              setNewDeck(false);
              setNewName("");
            }}
          >
            Tạo
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="text-button add-deck-link"
          onClick={() => setNewDeck(true)}
        >
          <Plus size={15} /> Tạo bộ mới
        </button>
      )}
      <div className="form-two">
        <label>
          Mặt trước
          <input
            required
            maxLength={500}
            value={form.front}
            onChange={(e) => field("front", e.target.value)}
            placeholder="Từ hoặc mẫu ngữ pháp"
          />
        </label>
        <label>
          Cách đọc
          <input
            maxLength={100}
            value={form.reading}
            onChange={(e) => field("reading", e.target.value)}
            placeholder="Hiragana (nếu có)"
          />
        </label>
      </div>
      <label>
        Mặt sau · nghĩa
        <textarea
          aria-label="Mặt sau · nghĩa"
          required
          maxLength={2000}
          value={form.back}
          onChange={(e) => field("back", e.target.value)}
          rows={2}
        />
      </label>
      <label>
        Câu ví dụ
        <input
          maxLength={2000}
          value={form.example}
          onChange={(e) => field("example", e.target.value)}
          placeholder="Câu tiếng Nhật (không bắt buộc)"
        />
      </label>
      <label>
        Nghĩa của câu
        <input
          maxLength={2000}
          value={form.translation}
          onChange={(e) => field("translation", e.target.value)}
          placeholder="Nghĩa tiếng Việt (không bắt buộc)"
        />
      </label>
      <details className="card-preview">
        <summary>Xem trước hai mặt</summary>
        <div>
          <section>
            <small>Mặt trước</small>
            <b lang="ja">{form.front || "Chưa có từ"}</b>
            <span>{form.reading}</span>
          </section>
          <section>
            <small>Mặt sau</small>
            <b>{form.back || "Chưa có nghĩa"}</b>
            <span lang="ja">{form.example}</span>
            <span>{form.translation}</span>
          </section>
        </div>
      </details>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="modal-actions">
        <button type="button" className="secondary" onClick={onClose}>
          Hủy
        </button>
        <button className="primary" type="submit">
          <Check size={17} /> Lưu thẻ
        </button>
      </div>
    </form>
  );
}
export function DeckForm({ deck, save, onClose }) {
  const [name, setName] = useState(deck?.name || ""),
    [description, setDescription] = useState(deck?.description || "");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (name.trim()) save(name.trim(), description.trim());
      }}
    >
      <label>
        Tên bộ thẻ
        <input
          required
          maxLength={100}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ví dụ: Từ mới trong sách"
        />
      </label>
      <label>
        Mô tả
        <textarea
          rows={3}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Bạn muốn học gì từ bộ này?"
        />
      </label>
      <div className="modal-actions">
        <button type="button" className="secondary" onClick={onClose}>
          Hủy
        </button>
        <button className="primary" type="submit">
          Lưu bộ thẻ
        </button>
      </div>
    </form>
  );
}
export function NameForm({ name, save, onClose }) {
  const [value, setValue] = useState(name);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) save(value.trim());
      }}
    >
      <label>
        Tên hiển thị
        <input
          required
          maxLength={60}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
      <p className="muted small">Email mẫu không thể đổi trong bản thử này.</p>
      <div className="modal-actions">
        <button type="button" className="secondary" onClick={onClose}>
          Hủy
        </button>
        <button type="submit" className="primary">
          Lưu thay đổi
        </button>
      </div>
    </form>
  );
}
