import React, { useState } from "react";
export default function BatchCardForm({ items, decks, onSave, onClose }) {
  const [deckId, setDeckId] = useState(decks[0]?.id || ""),
    [error, setError] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(onSave(deckId) || "");
      }}
    >
      <p className="modal-description">
        Lưu {items.length} mục đã chọn. Các thẻ đã có trong bộ sẽ được bỏ qua.
        Bạn có thể sửa từng thẻ trong trang Bộ thẻ.
      </p>
      <label>
        Bộ thẻ
        <select
          aria-label="Bộ thẻ nhận nội dung"
          value={deckId}
          onChange={(e) => setDeckId(e.target.value)}
          required
        >
          <option value="" disabled>
            Chọn bộ thẻ
          </option>
          {decks.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      {!decks.length && (
        <p role="alert">
          Chưa có bộ thẻ. Hãy tạo bộ ở trang Bộ thẻ rồi quay lại.
        </p>
      )}
      <ul className="batch-preview">
        {items.map((i) => (
          <li key={i.id}>
            <b>{i.front}</b>
            <span>{i.back}</span>
          </li>
        ))}
      </ul>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="modal-actions">
        <button className="secondary" type="button" onClick={onClose}>
          Hủy
        </button>
        <button className="primary" type="submit" disabled={!decks.length}>
          Lưu các thẻ đã chọn
        </button>
      </div>
    </form>
  );
}
