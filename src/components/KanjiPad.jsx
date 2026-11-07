import React, { useState, useRef } from "react";
import { recognizeStrokes } from "../services/mockApi";
export default function KanjiPad({ onChoose }) {
  const [strokes, setStrokes] = useState([]),
    [candidates, setCandidates] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [fail, setFail] = useState(false);
  const drawing = useRef(false);
  const point = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    return [
      ((e.clientX - r.left) * 300) / r.width,
      ((e.clientY - r.top) * 300) / r.height,
    ];
  };
  const clear = (all) => {
    setStrokes((s) => (all ? [] : s.slice(0, -1)));
    setCandidates([]);
    setError("");
  };
  async function find() {
    setBusy(true);
    setError("");
    try {
      setCandidates(await recognizeStrokes(strokes, fail));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <p className="notice">
        Vẽ bằng chuột hoặc ngón tay. Các chữ gợi ý là mẫu cố định, chưa nhận
        dạng nét vẽ thật.
      </p>
      <svg
        className="kanji-pad"
        viewBox="0 0 300 300"
        aria-label="Bảng vẽ Kanji"
        onPointerDown={(e) => {
          if (busy) return;
          const p = point(e);
          drawing.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setStrokes((s) => [...s, [p]]);
          setCandidates([]);
        }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const p = point(e);
          setStrokes((s) =>
            s.map((line, i) => (i === s.length - 1 ? [...line, p] : line)),
          );
        }}
        onPointerUp={() => (drawing.current = false)}
        onPointerCancel={() => (drawing.current = false)}
      >
        <path
          d="M150 0V300 M0 150H300"
          stroke="#cad7ce"
          strokeDasharray="6 6"
        />
        {strokes.map((s, i) => (
          <polyline
            key={i}
            points={s.map((p) => p.join(",")).join(" ")}
            fill="none"
            stroke="#153f36"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <p>{strokes.length} nét</p>
      <div className="button-row">
        <button
          className="secondary"
          onClick={() => clear(false)}
          disabled={!strokes.length || busy}
        >
          Xóa nét cuối
        </button>
        <button
          className="secondary"
          onClick={() => clear(true)}
          disabled={busy}
        >
          Xóa bảng
        </button>
        <button
          className="primary"
          onClick={find}
          disabled={!strokes.length || busy}
        >
          {busy ? "Đang tìm…" : "Tìm chữ mẫu"}
        </button>
      </div>
      <label className="check-label">
        <input
          type="checkbox"
          checked={fail}
          onChange={(e) => setFail(e.target.checked)}
        />{" "}
        Mô phỏng lỗi nhận dạng
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="candidate-list">
        {candidates.map((c) => (
          <button className="secondary" key={c} onClick={() => onChoose(c)}>
            {c}
          </button>
        ))}
      </div>
      <p className="small muted">
        Nếu không thể vẽ, đóng bảng và nhập chữ bằng bàn phím ở ô tra từ.
      </p>
    </div>
  );
}
