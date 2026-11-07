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
export default function ReviewPage({
  data,
  remaining,
  session,
  setSession,
  revealed,
  setRevealed,
  beginReview,
  setModal,
  streak,
  go,
  grade,
}) {
  return (
    <>
      <PageTitle
        eyebrow="MỘT CHÚT MỖI NGÀY"
        title="Gặp lại. Nhớ lâu hơn."
        text="Thử nhớ trước khi lật thẻ. Không cần vội, hãy học theo nhịp của bạn."
      />
      {!data.user ? (
        <LoginGate onLogin={() => setModal({ type: "login" })} />
      ) : !session ? (
        <div className="review-start panel">
          <div className="large-symbol">
            <Repeat2 size={34} />
          </div>
          <h2>
            {remaining
              ? `${remaining} thẻ chưa ôn hôm nay`
              : "Bạn đã ôn hết thẻ hôm nay"}
          </h2>
          <p>
            Lịch ôn ở bản thử chỉ phân biệt đã ôn và chưa ôn trong ngày.
            <br />
            Thuật toán ôn ngắt quãng sẽ được bổ sung sau.
          </p>
          <button
            className="primary"
            onClick={() => beginReview()}
            disabled={!remaining}
          >
            Bắt đầu ôn <ArrowRight size={17} />
          </button>
        </div>
      ) : session.index >= session.cards.length ? (
        <div className="review-start panel">
          <div className="large-symbol">
            <CheckCircle2 size={36} />
          </div>
          <span className="eyebrow">MỘT BƯỚC TIẾN NHỎ</span>
          <h2>
            {session.cards.length
              ? "Bạn đã dành thời gian cho mình."
              : "Không có thẻ cần ôn lúc này"}
          </h2>
          <p>
            {session.answers.length} thẻ đã ôn · {streak} ngày học liên tiếp
          </p>
          <div className="button-row">
            <button
              className="primary"
              onClick={() => {
                setSession(null);
                go("decks");
              }}
            >
              Về bộ thẻ <ArrowRight size={17} />
            </button>
            <button
              className="secondary"
              onClick={() => {
                setSession(null);
                go("search");
              }}
            >
              Khám phá từ mới
            </button>
          </div>
        </div>
      ) : (
        <div className="review-area">
          <div className="review-status">
            <span>
              THẺ {session.index + 1} / {session.cards.length}
            </span>
            <button
              className="text-button"
              onClick={() => setModal({ type: "endReview" })}
            >
              Kết thúc buổi ôn
            </button>
          </div>
          <div className="progress-track">
            <div
              style={{
                width: `${(session.index / session.cards.length) * 100}%`,
              }}
            />
          </div>
          <div className={`flashcard ${revealed ? "revealed" : ""}`}>
            <span className="eyebrow">
              {revealed ? "MẶT SAU · ĐÁP ÁN" : "MẶT TRƯỚC · BẠN CÒN NHỚ KHÔNG?"}
            </span>
            <div className="flash-word" lang="ja">
              {session.cards[session.index].front}
            </div>
            <div className="flash-reading">
              {session.cards[session.index].reading}
            </div>
            {revealed ? (
              <div className="flash-answer">
                <h2>{session.cards[session.index].back}</h2>
                <p lang="ja">{session.cards[session.index].example}</p>
                <span>{session.cards[session.index].translation}</span>
              </div>
            ) : (
              <button
                className="primary reveal-btn"
                onClick={() => setRevealed(true)}
              >
                <Eye size={18} /> Xem đáp án
              </button>
            )}
          </div>
          {revealed ? (
            <div className="grade-area">
              <p>Bạn nhớ từ này đến mức nào?</p>
              <div className="grade-buttons">
                {["Chưa nhớ", "Khó", "Nhớ", "Dễ"].map((g, i) => (
                  <button
                    key={g}
                    className={`grade grade-${i}`}
                    onClick={() => grade(g)}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="review-hint">
              Tự trả lời một lần trước khi xem đáp án nhé.
            </p>
          )}
        </div>
      )}
    </>
  );
}
