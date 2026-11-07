import React from "react";
import {
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
export default function DetailPage({ selected, go, addWord, showWord, words }) {
  return (
    <>
      <button className="back-link" onClick={() => go("search")}>
        <ArrowLeft size={16} /> Quay lại kết quả
      </button>
      <div className="detail-grid">
        <section>
          <div className="detail-main">
            <div className="eyebrow">TỪ ĐIỂN NHẬT – VIỆT</div>
            <div className="detail-word-row">
              <div>
                <h1 className="detail-japanese">{selected.word}</h1>
                <p className="detail-reading">
                  {(selected.readings || [selected.reading]).join(" / ")}{" "}
                  <span>· {selected.romaji}</span>
                </p>
              </div>
              <span className="level">{selected.level}</span>
            </div>
            <span className="type-tag">{selected.type}</span>
            <div className="meaning-block">
              <span className="meaning-number">01</span>
              <div>
                <h2>{selected.meaning}</h2>
                <p>{selected.description}</p>
              </div>
            </div>
            <div className="sense-list">
              {(selected.senses || []).map((sense, i) => (
                <div key={sense.id}>
                  <span className="count">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{sense.meaning}</h3>
                    <p>{sense.note}</p>
                    <p lang="ja">{sense.example}</p>
                    <small>{sense.translation}</small>
                    <button
                      className="text-button"
                      onClick={() =>
                        addWord({
                          ...selected,
                          meaning: sense.meaning,
                          example: sense.example,
                          translation: sense.translation,
                        })
                      }
                    >
                      Thêm nghĩa này vào thẻ
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="example-box">
              <span className="eyebrow">VÍ DỤ SỬ DỤNG</span>
              <p lang="ja">{selected.example}</p>
              <small>{selected.translation}</small>
            </div>
          </div>
          <section className="panel kanji-panel">
            <div className="section-heading">
              <h2>Kanji trong từ</h2>
              <span className="count">{selected.kanji.length}</span>
            </div>
            <div className="kanji-list">
              {selected.kanji.map((k) => (
                <div className="kanji-item" key={k.char}>
                  <div className="kanji-square">{k.char}</div>
                  <div>
                    <h3>
                      {k.hv} <span>· {k.meaning}</span>
                    </h3>
                    <p>
                      <b>On</b> {k.on}
                    </p>
                    <p>
                      <b>Kun</b> {k.kun}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="panel">
            <h2>Từ gần nghĩa</h2>
            {selected.related.length ? (
              <>
                <div className="related-list">
                  {selected.related.map((r) => (
                    <button
                      className="chip"
                      key={r}
                      onClick={() => showWord(words.find((w) => w.word === r))}
                    >
                      {r} <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
                <p className="muted">{selected.note}</p>
              </>
            ) : (
              <p className="muted">
                Chưa có dữ liệu từ đồng nghĩa trong bản mẫu.
              </p>
            )}
          </section>
          <p className="data-caption">
            Nguồn: nội dung mẫu biên soạn cho prototype, cần rà soát trước khi
            đưa vào sản phẩm.
          </p>
        </section>
        <aside className="right-column">
          <div className="save-panel">
            <Bookmark size={26} />
            <h2>
              Biến từ mới thành
              <br />
              điều bạn nhớ.
            </h2>
            <p>
              Lưu nghĩa và câu ví dụ vào bộ thẻ riêng để gặp lại khi ôn tập.
            </p>
            <button className="primary full" onClick={() => addWord(selected)}>
              <Plus size={17} /> Thêm vào bộ thẻ
            </button>
            <small>Bạn có thể sửa hai mặt trước khi lưu.</small>
          </div>
          <div className="tip-panel">
            <GraduationCap size={22} />
            <p>
              Thử đặt một câu của riêng bạn. Ngữ cảnh giúp việc học từ có ý
              nghĩa hơn.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
