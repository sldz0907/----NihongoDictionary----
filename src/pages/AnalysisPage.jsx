import React, { useState, useRef, useEffect } from "react";
import { recognizeImage, analyzeText, sampleText } from "../services/mockApi";
export default function AnalysisPage({ onAdd }) {
  const [url, setUrl] = useState(""),
    [angle, setAngle] = useState(0),
    [crop, setCrop] = useState(0),
    [text, setText] = useState(""),
    [items, setItems] = useState([]),
    [selected, setSelected] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [fail, setFail] = useState(false);
  const preview = useRef(null),
    version = useRef(0);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  useEffect(
    () => () => {
      version.current++;
    },
    [],
  );
  function upload(file) {
    version.current++;
    setError("");
    setItems([]);
    setSelected([]);
    setText("");
    if (!file) return;
    if (
      !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
      file.size > 8 * 1024 * 1024
    ) {
      setError("Chọn ảnh PNG, JPEG hoặc WebP không quá 8 MB.");
      return;
    }
    setUrl(URL.createObjectURL(file));
    setAngle(0);
    setCrop(0);
  }
  async function run(kind) {
    const v = ++version.current;
    setBusy(true);
    setError("");
    try {
      if (kind === "ocr") {
        const t = await recognizeImage(fail);
        if (v === version.current) {
          setText(t);
          setItems([]);
        }
      } else {
        const r = await analyzeText(text, fail);
        if (v === version.current) {
          setItems(r);
          setSelected([]);
        }
      }
    } catch (e) {
      if (v === version.current) setError(e.message);
    } finally {
      if (v === version.current) setBusy(false);
    }
  }
  function applyCrop() {
    const img = preview.current;
    if (!img?.naturalWidth) return;
    const c = document.createElement("canvas"),
      ctx = c.getContext("2d"),
      w = img.naturalWidth,
      h = img.naturalHeight;
    const rotated = angle % 180 !== 0;
    c.width = rotated ? h : w;
    c.height = rotated ? w : h;
    ctx.translate(c.width / 2, c.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(img, -w / 2, -h / 2);
    const out = document.createElement("canvas"),
      ratio = crop / 100;
    out.width = Math.max(1, Math.round(c.width * (1 - 2 * ratio)));
    out.height = Math.max(1, Math.round(c.height * (1 - 2 * ratio)));
    out
      .getContext("2d")
      .drawImage(
        c,
        c.width * ratio,
        c.height * ratio,
        out.width,
        out.height,
        0,
        0,
        out.width,
        out.height,
      );
    out.toBlob((blob) => {
      if (blob) {
        setUrl(URL.createObjectURL(blob));
        setAngle(0);
        setCrop(0);
        setText("");
        setItems([]);
        setSelected([]);
      }
    }, "image/png");
  }
  return (
    <section className="analysis-page">
      <div className="page-title">
        <div>
          <div className="eyebrow">TỪ ẢNH ĐẾN BỘ THẺ</div>
          <h1>Học từ những gì bạn gặp.</h1>
          <p>Thử quy trình với ảnh của bạn và kết quả nhận dạng mẫu.</p>
        </div>
      </div>
      <p className="notice">
        Ảnh chỉ ở trình duyệt, chưa gửi lên máy chủ. OCR trả về câu mẫu cố định;
        phân tích chỉ đối chiếu bộ từ nhỏ và mẫu 〜ている, chưa phải NLP thật.
      </p>
      <div className="analysis-grid">
        <section className="panel">
          <h2>1. Chọn và chỉnh ảnh</h2>
          <label className="file-label">
            Tải ảnh
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              disabled={busy}
              onChange={(e) => upload(e.target.files[0])}
            />
          </label>
          <label className="file-label">
            Chụp ảnh (thiết bị hỗ trợ)
            <input
              type="file"
              accept="image/*"
              capture="environment"
              disabled={busy}
              onChange={(e) => upload(e.target.files[0])}
            />
          </label>
          {url ? (
            <>
              <div className="image-stage">
                <img
                  ref={preview}
                  src={url}
                  alt="Ảnh đã chọn"
                  onLoad={(e) => {
                    if (
                      e.currentTarget.naturalWidth *
                        e.currentTarget.naturalHeight >
                      16000000
                    ) {
                      setError(
                        "Ảnh quá nhiều điểm ảnh. Chọn ảnh nhỏ hơn 16 megapixel.",
                      );
                      setUrl("");
                    }
                  }}
                  style={{
                    transform: `rotate(${angle}deg)`,
                    clipPath: `inset(${crop}%)`,
                  }}
                  onError={() => {
                    setError("Không đọc được ảnh. Hãy chọn ảnh khác.");
                    setUrl("");
                  }}
                />
              </div>
              <div className="button-row">
                <button
                  disabled={busy}
                  className="secondary"
                  onClick={() => setAngle((a) => (a + 90) % 360)}
                >
                  Xoay 90°
                </button>
                <button
                  disabled={busy}
                  className="secondary"
                  onClick={() => {
                    setAngle(0);
                    setCrop(0);
                  }}
                >
                  Đặt lại
                </button>
              </div>
              <label>
                Cắt đều các mép: {crop}%
                <input
                  disabled={busy}
                  aria-label="Mức cắt ảnh"
                  type="range"
                  min="0"
                  max="35"
                  value={crop}
                  onChange={(e) => setCrop(Number(e.target.value))}
                />
              </label>
              <button disabled={busy} className="secondary" onClick={applyCrop}>
                Áp dụng cắt / xoay
              </button>
              <button
                className="primary"
                disabled={busy}
                onClick={() => run("ocr")}
              >
                Nhận chữ mẫu
              </button>
            </>
          ) : (
            <p className="muted">
              Chọn ảnh để xem trước. Bạn cũng có thể thử bằng văn bản mẫu bên
              cạnh.
            </p>
          )}
        </section>
        <section className="panel">
          <h2>2. Kiểm tra văn bản</h2>
          <button
            disabled={busy}
            className="text-button"
            onClick={() => {
              setText(sampleText);
              setItems([]);
            }}
          >
            Dùng văn bản mẫu
          </button>
          <label>
            Văn bản tiếng Nhật
            <textarea
              disabled={busy}
              aria-label="Văn bản tiếng Nhật"
              rows={6}
              maxLength={2000}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setItems([]);
                setSelected([]);
              }}
            />
          </label>
          <button
            className="primary"
            disabled={busy || !text.trim()}
            onClick={() => run("nlp")}
          >
            {busy ? "Đang xử lý…" : "Phân tích mẫu"}
          </button>
          <label className="check-label">
            <input
              type="checkbox"
              checked={fail}
              onChange={(e) => setFail(e.target.checked)}
            />{" "}
            Mô phỏng lỗi xử lý
          </label>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
          <h2>3. Chọn nội dung để lưu</h2>
          {!items.length ? (
            <p className="muted">
              Chưa có kết quả. Bộ mẫu nhận ra 日本語, 勉強 và 〜ている trong câu
              gợi ý.
            </p>
          ) : (
            items.map((i) => (
              <label className="analysis-item" key={i.id}>
                <input
                  type="checkbox"
                  checked={selected.includes(i.id)}
                  onChange={(e) =>
                    setSelected((s) =>
                      e.target.checked
                        ? [...s, i.id]
                        : s.filter((id) => id !== i.id),
                    )
                  }
                />
                <span>
                  <small>{i.kind}</small>
                  <b>{i.front}</b>
                  <span>{i.back}</span>
                </span>
              </label>
            ))
          )}
          <button
            className="primary"
            disabled={!selected.length}
            onClick={() => onAdd(items.filter((i) => selected.includes(i.id)))}
          >
            Thêm {selected.length} mục vào bộ thẻ
          </button>
        </section>
      </div>
    </section>
  );
}
