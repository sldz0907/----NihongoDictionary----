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
export default function DecksPage({
  data,
  deckId,
  go,
  requireUser,
  setModal,
  reviewedToday,
  beginReview,
}) {
  return (
    <>
      <PageTitle
        eyebrow="GÓC NHỚ CỦA BẠN"
        title={
          deckId
            ? data.decks.find((d) => d.id === deckId)?.name
            : "Mỗi bộ thẻ, một hành trình."
        }
        text={
          deckId
            ? "Những từ bạn muốn gặp lại và ghi nhớ."
            : "Gom từ mới theo cách của bạn, rồi học từng chút mỗi ngày."
        }
        action={
          <button
            className="primary"
            onClick={() =>
              requireUser(() =>
                setModal(deckId ? { type: "card", deckId } : { type: "deck" }),
              )
            }
          >
            <Plus size={17} />
            {deckId ? "Thêm thẻ" : "Tạo bộ thẻ"}
          </button>
        }
      />
      {!data.user ? (
        <LoginGate onLogin={() => setModal({ type: "login" })} />
      ) : deckId && !data.decks.some((d) => d.id === deckId) ? (
        <Empty
          icon={Layers}
          title="Không tìm thấy bộ thẻ"
          text="Bộ này đã bị xóa hoặc đường dẫn không đúng."
          action="Về danh sách bộ"
          onAction={() => go("decks")}
        />
      ) : !deckId ? (
        <div className="deck-grid">
          {data.decks.map((d, i) => {
            const cards = data.cards.filter((c) => c.deckId === d.id);
            const due = cards.filter((c) => !reviewedToday.has(c.id)).length;
            return (
              <article className={`deck-card ${d.color}`} key={d.id}>
                <div className="deck-card-top">
                  <span className="deck-symbol">
                    <Layers size={26} />
                  </span>
                  <div>
                    <button
                      className="icon-btn"
                      aria-label={`Đổi tên ${d.name}`}
                      onClick={() => setModal({ type: "deck", deck: d })}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      className="icon-btn"
                      aria-label={`Xóa bộ ${d.name}`}
                      onClick={() => setModal({ type: "deleteDeck", deck: d })}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <button className="deck-name" onClick={() => go("decks", d.id)}>
                  {d.name}
                  <ArrowUpRight size={20} />
                </button>
                <p>{d.description || "Một nơi cho những điều bạn muốn nhớ."}</p>
                <div className="deck-meta">
                  <span>{cards.length} thẻ</span>
                  <span className="due-dot">{due} chưa ôn hôm nay</span>
                </div>
                <button
                  className="secondary full"
                  onClick={() => beginReview(d.id)}
                >
                  Ôn bộ này <ArrowRight size={16} />
                </button>
              </article>
            );
          })}
          <button
            className="create-deck"
            onClick={() => setModal({ type: "deck" })}
          >
            <FolderPlus size={30} />
            <b>Một bộ thẻ mới</b>
            <span>Thêm chủ đề bạn muốn khám phá</span>
          </button>
        </div>
      ) : (
        <>
          <div className="deck-toolbar">
            <button className="back-link" onClick={() => go("decks")}>
              <ArrowLeft size={16} /> Tất cả bộ thẻ
            </button>
            <button className="secondary" onClick={() => beginReview(deckId)}>
              <Repeat2 size={17} /> Ôn bộ này
            </button>
          </div>
          {data.cards.filter((c) => c.deckId === deckId).length ? (
            <div className="cards-table">
              <div className="table-header">
                <span>TỪ / MẶT TRƯỚC</span>
                <span>NGHĨA / MẶT SAU</span>
                <span />
              </div>
              {data.cards
                .filter((c) => c.deckId === deckId)
                .map((c) => (
                  <div className="table-row" key={c.id}>
                    <div>
                      <b lang="ja">{c.front}</b>
                      <small>{c.reading}</small>
                    </div>
                    <p>{c.back}</p>
                    <div className="row-actions">
                      <button
                        className="icon-btn"
                        aria-label={`Sửa thẻ ${c.front}`}
                        onClick={() => setModal({ type: "card", card: c })}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="icon-btn"
                        aria-label={`Xóa thẻ ${c.front}`}
                        onClick={() =>
                          setModal({ type: "deleteCard", card: c })
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <Empty
              icon={Layers}
              title="Bộ thẻ đang chờ từ đầu tiên"
              text="Tra một từ bạn muốn học, hoặc tự tạo một thẻ mới."
              action="Tra từ để thêm thẻ"
              onAction={() => go("search")}
            />
          )}
        </>
      )}
      <div className="data-caption">
        <Info size={14} /> Thẻ của bản thử được lưu trên trình duyệt này, chưa
        đồng bộ tài khoản.
      </div>
    </>
  );
}
