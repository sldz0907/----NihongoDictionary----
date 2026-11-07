import React from "react";
import {
  X,
  Search,
  BookOpen,
  Layers,
  Repeat2,
  User,
  ArrowRight,
  ArrowLeft,
  Plus,
  Check,
  Flame,
  LogOut,
  Trash2,
  Pencil,
  FolderPlus,
  CheckCircle2,
  Bookmark,
  GraduationCap,
  Clock,
  Info,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import { PageTitle, Empty, LoginGate } from "../components/Common";
import { localDay } from "../data";
export default function SearchPage({
  words,
  query,
  setQuery,
  direction,
  setDirection,
  filter,
  setFilter,
  results,
  data,
  remaining,
  beginReview,
  showWord,
  addWord,
  setModal,
  searchBusy,
  searchError,
  searchFail,
  setSearchFail,
  setSearchRetry,
}) {
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow">
          <span /> KHÁM PHÁ NGÔN NGỮ
        </div>
        <h1>
          Mỗi từ mới, một bước tiến<span>.</span>
        </h1>
        <p>Tra nghĩa, hiểu cách dùng và giữ lại những điều bạn muốn nhớ.</p>
        <div className="heading-decoration" aria-hidden="true">
          あ <span>ア</span>
        </div>
      </div>
      <div className="search-panel">
        <div className="search-tabs" role="group" aria-label="Chiều tra">
          <button
            className={direction === "ja" ? "selected" : ""}
            onClick={() => {
              setDirection("ja");
              setQuery("");
            }}
          >
            Nhật <span>→</span> Việt
          </button>
          <button
            className={direction === "vi" ? "selected" : ""}
            onClick={() => {
              setDirection("vi");
              setQuery("");
            }}
          >
            Việt <span>→</span> Nhật
          </button>
          <span className="search-tip">Một nơi cho những từ bạn chưa biết</span>
        </div>
        <form
          className="search-field"
          onSubmit={(e) => {
            e.preventDefault();
            document.getElementById("results-heading")?.focus();
          }}
        >
          <Search size={23} />
          <input
            aria-label="Từ cần tra"
            placeholder={
              direction === "ja"
                ? "Nhập Kanji, Hiragana hoặc romaji…"
                : "Nhập nghĩa tiếng Việt, ví dụ: học…"
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="icon-btn"
              onClick={() => setQuery("")}
              aria-label="Xóa từ khóa"
            >
              <X size={18} />
            </button>
          )}
          <button className="primary search-submit" type="submit">
            Tra từ <ArrowRight size={17} />
          </button>
        </form>
        <div className="search-helper">
          <span>
            Thử tìm:{" "}
            {["勉強", "たべる", "日本語"].map((w) => (
              <button
                key={w}
                onClick={() => {
                  setDirection("ja");
                  setQuery(w);
                  setFilter("Tất cả");
                }}
              >
                {w}
              </button>
            ))}
          </span>
          <button
            type="button"
            className="draw-button"
            onClick={() => setModal({ type: "kanji" })}
          >
            <Pencil size={15} /> Vẽ Kanji
          </button>
        </div>
      </div>
      <div className="content-grid">
        <section className="results">
          <div className="section-heading">
            <h2 id="results-heading" tabIndex={-1}>
              {query ? "Kết quả tìm kiếm" : "Từ vựng dành cho bạn"}{" "}
              <span className="count">{results.length}</span>
            </h2>
            <span className="muted small">Bộ dữ liệu thử · 6 từ</span>
          </div>
          <div className="filter-row">
            {["Tất cả", "Học tập", "Đời sống", "Ngôn ngữ"].map((f) => (
              <button
                key={f}
                className={`chip ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <details className="demo-controls">
            <summary>Thử trạng thái dữ liệu</summary>
            <label className="check-label">
              <input
                type="checkbox"
                checked={searchFail}
                onChange={(e) => setSearchFail(e.target.checked)}
              />{" "}
              Mô phỏng lỗi tải từ điển
            </label>
          </details>
          {searchBusy ? (
            <p role="status" className="notice">
              Đang tìm từ…
            </p>
          ) : searchError ? (
            <div role="alert" className="notice error">
              {searchError}
              <button
                className="secondary"
                onClick={() => {
                  setSearchFail(false);
                  setSearchRetry((n) => n + 1);
                }}
              >
                Thử lại
              </button>
            </div>
          ) : (
            <div className="word-list">
              {results.map((w) => (
                <article className="word-card" key={w.id}>
                  <button className="word-open" onClick={() => showWord(w)}>
                    <div className="word-line">
                      <span className="japanese">{w.word}</span>
                      <span className="word-reading">{w.reading}</span>
                      <span className="level">{w.level}</span>
                    </div>
                    <p className="word-meaning">{w.meaning}</p>
                    <span className="word-type">{w.type}</span>
                  </button>
                  <button
                    className={`save-word ${data.cards.some((c) => c.wordId === w.id) ? "saved" : ""}`}
                    onClick={() => addWord(w)}
                    aria-label={`Thêm ${w.word} vào bộ thẻ`}
                    title="Thêm vào bộ thẻ"
                  >
                    {data.cards.some((c) => c.wordId === w.id) ? (
                      <Check size={18} />
                    ) : (
                      <Plus size={19} />
                    )}
                  </button>
                </article>
              ))}
            </div>
          )}
          {!searchBusy && !searchError && !results.length && (
            <Empty
              icon={Search}
              title="Chưa tìm thấy từ này"
              text="Bản thử hiện có 6 từ. Bạn thử “勉強”, “たべる” hoặc đổi chiều tra để tìm “ăn” nhé."
              action="Xem tất cả từ mẫu"
              onAction={() => {
                setQuery("");
                setFilter("Tất cả");
              }}
            />
          )}
          <div className="data-caption">
            <Info size={14} /> Nội dung minh họa để thử giao diện; chưa phải bộ
            từ điển đầy đủ.
          </div>
        </section>
        <aside className="right-column">
          <section className="daily-word">
            <div className="daily-top">
              <span>TỪ NHỎ HÔM NAY</span>
              <BookOpen size={18} />
            </div>
            <div className="daily-character">
              学<span className="circle-mark" />
            </div>
            <div className="daily-reading">がく · まなぶ</div>
            <h3>Học, để hiểu hơn.</h3>
            <p>
              Mỗi điều mới bắt đầu
              <br />
              từ một chút tò mò.
            </p>
            <button
              onClick={() => showWord(words.find((w) => w.id === "gakkou"))}
            >
              Khám phá từ liên quan <ArrowRight size={16} />
            </button>
          </section>
          <section className="review-promo">
            <span className="promo-icon">
              <Layers size={21} />
            </span>
            <h3>Gặp lại những từ đã học</h3>
            <p>
              {remaining > 0
                ? `${remaining} thẻ mẫu đang chờ bạn. Dành một chút thời gian để ghi nhớ nhé.`
                : "Bạn đã xem hết thẻ hôm nay. Thêm từ mới hoặc trở lại vào ngày mai."}
            </p>
            <button onClick={() => beginReview()}>
              Ôn tập ngay <ArrowUpRight size={17} />
            </button>
          </section>
          <div className="little-note">
            <span>ひとつずつ。</span>
            <p>Từng chút một, bạn đang tiến bộ.</p>
          </div>
        </aside>
      </div>
    </>
  );
}
