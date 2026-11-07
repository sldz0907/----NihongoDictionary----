import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  BookOpen,
  Layers,
  Repeat2,
  ScanLine,
  User,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Check,
  ChevronRight,
  Flame,
  LogOut,
  Settings2,
  MoreHorizontal,
  Trash2,
  Pencil,
  FolderPlus,
  CheckCircle2,
  RotateCcw,
  Menu,
  Compass,
  Bookmark,
  GraduationCap,
  Clock,
  Info,
  ArrowUpRight,
  Eye,
  NotebookPen,
} from "lucide-react";
import { words, initialState, localDay } from "./data";
import "./styles.css";
import ProfilePage from "./pages/ProfilePage";
import ReviewPage from "./pages/ReviewPage";
import DecksPage from "./pages/DecksPage";
import DetailPage from "./pages/DetailPage";
import SearchPage from "./pages/SearchPage";
import Modal from "./components/Modal";
import { CardForm, DeckForm, NameForm } from "./components/Forms";
import { PageTitle, Empty, LoginGate } from "./components/Common";
import { loadState, saveState } from "./services/storage";
import { useAppRoute } from "./services/routes";
import { searchWords } from "./services/mockApi";
import KanjiPad from "./components/KanjiPad";
import AnalysisPage from "./pages/AnalysisPage";
import RemindersPage from "./pages/RemindersPage";
import LoginPanel from "./components/LoginPanel";
import BatchCardForm from "./components/BatchCardForm";

const uid = () => crypto.randomUUID();
export default function App() {
  const [route, navigate] = useAppRoute();
  const page = route.page,
    selected = words.find((w) => w.id === route.id),
    deckId = page === "decks" ? route.id : null;
  const [data, setData] = useState(loadState),
    [query, setQuery] = useState(""),
    [direction, setDirection] = useState("ja"),
    [modal, setModal] = useState(null),
    [toast, setToast] = useState(""),
    [mobile, setMobile] = useState(false),
    [filter, setFilter] = useState("Tất cả"),
    [session, setSession] = useState(null),
    [revealed, setRevealed] = useState(false),
    [storageError, setStorageError] = useState(false);
  const pending = useRef(null),
    main = useRef(null),
    toastTimer = useRef(null);
  useEffect(() => {
    if (!mobile) return;
    const nav = document.querySelector(".sidebar");
    const previous = document.activeElement;
    nav.querySelector("button")?.focus();
    const key = (e) => {
      const nodes = [...nav.querySelectorAll("button")],
        first = nodes[0],
        last = nodes[nodes.length - 1];
      if (e.key === "Escape") setMobile(false);
      if (e.key === "Tab" && e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (
        e.key === "Tab" &&
        !e.shiftKey &&
        document.activeElement === last
      ) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus({ preventScroll: true });
    };
  }, [mobile]);
  useEffect(() => {
    try {
      saveState(data);
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [data]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  useEffect(() => {
    document.title = `${{ search: "Tra từ", detail: "Chi tiết từ", decks: "Bộ thẻ", review: "Ôn tập", profile: "Tài khoản", analysis: "Phân tích ảnh", reminders: "Nhắc học", login: "Đăng nhập", notfound: "Không tìm thấy" }[page]} · Kotoba`;
    window.scrollTo(0, 0);
  }, [page, deckId, route.id]);
  function notify(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 4000);
  }
  function go(next, id) {
    navigate(next, id);
    setMobile(false);
    setTimeout(() => main.current?.focus({ preventScroll: true }), 0);
  }
  function requireUser(action) {
    if (data.user) action();
    else {
      pending.current = action;
      setModal({ type: "login" });
    }
  }
  function showWord(word) {
    if (word) go("detail", word.id);
  }
  function addWord(word) {
    requireUser(() => setModal({ type: "card", word }));
  }
  function beginReview(id) {
    requireUser(() => {
      const reviewed = new Set(
        data.reviews.filter((r) => r.day === localDay()).map((r) => r.cardId),
      );
      const cards = data.cards.filter(
        (c) => (!id || c.deckId === id) && !reviewed.has(c.id),
      );
      setSession({ cards, index: 0, answers: [] });
      setRevealed(false);
      go("review");
    });
  }
  function grade(label) {
    const card = session?.cards[session.index];
    if (!card || !revealed) return;
    setData((d) => ({
      ...d,
      reviews: [
        ...d.reviews,
        {
          cardId: card.id,
          grade: label,
          day: localDay(),
          at: new Date().toISOString(),
        },
      ],
      studyDays: [...new Set([...d.studyDays, localDay()])],
    }));
    setSession((s) => ({
      ...s,
      index: s.index + 1,
      answers: [...s.answers, label],
    }));
    setRevealed(false);
  }
  const reviewedToday = new Set(
    data.reviews.filter((r) => r.day === localDay()).map((r) => r.cardId),
  );
  const remaining = data.cards.filter((c) => !reviewedToday.has(c.id)).length;
  let streak = 0;
  let offset = data.studyDays.includes(localDay()) ? 0 : -1;
  while (data.studyDays.includes(localDay(offset))) {
    streak++;
    offset--;
  }
  const [results, setResults] = useState(words),
    [searchBusy, setSearchBusy] = useState(false),
    [searchError, setSearchError] = useState(""),
    [searchFail, setSearchFail] = useState(false),
    [searchRetry, setSearchRetry] = useState(0);
  useEffect(() => {
    let current = true;
    setSearchBusy(true);
    setSearchError("");
    searchWords(query, direction, filter, searchFail)
      .then((r) => {
        if (current) setResults(r);
      })
      .catch((e) => {
        if (current) {
          setSearchError(e.message);
          setResults([]);
        }
      })
      .finally(() => {
        if (current) setSearchBusy(false);
      });
    return () => {
      current = false;
    };
  }, [query, direction, filter, searchFail, searchRetry]);
  function login() {
    setData((d) => ({
      ...d,
      user: { name: "Minh Anh", email: "minh.anh@example.com" },
    }));
    setModal(null);
    const action = pending.current;
    pending.current = null;
    if (action) action();
    else if (page === "login") go("profile");
    notify("Đã mở tài khoản mẫu Minh Anh.");
  }
  function saveBatch(id) {
    if (!data.decks.some((d) => d.id === id)) return "Hãy chọn một bộ thẻ.";
    const added = modal.items
      .filter(
        (i) =>
          !data.cards.some(
            (c) =>
              c.deckId === id &&
              (i.kind === "Từ vựng"
                ? c.wordId === i.id
                : c.front === i.front && c.back === i.back),
          ),
      )
      .map((i) => ({
        id: uid(),
        deckId: id,
        wordId: i.kind === "Từ vựng" ? i.id : null,
        front: i.front,
        reading: i.reading,
        back: i.back,
        example: i.example,
        translation: i.translation,
      }));
    setData((d) => ({ ...d, cards: [...d.cards, ...added] }));
    setModal(null);
    notify(
      `Đã lưu ${added.length} thẻ; bỏ qua ${modal.items.length - added.length} thẻ trùng.`,
    );
    return "";
  }
  const active = page === "detail" ? "search" : page;
  function saveCard(form) {
    const payload = {
      front: form.front.trim(),
      reading: form.reading.trim(),
      back: form.back.trim(),
      example: form.example.trim(),
      translation: form.translation.trim(),
    };
    const duplicate = data.cards.find(
      (c) =>
        c.id !== form.id &&
        c.deckId === form.deckId &&
        ((form.wordId && c.wordId === form.wordId) ||
          (!form.wordId &&
            c.front === payload.front &&
            c.back === payload.back)),
    );
    if (duplicate)
      return "Thẻ này đã có trong bộ. Bạn có thể sửa thẻ ở trang Bộ thẻ.";
    if (!data.decks.some((d) => d.id === form.deckId))
      return "Hãy chọn hoặc tạo một bộ thẻ.";
    setData((d) => ({
      ...d,
      cards: form.id
        ? d.cards.map((c) =>
            c.id === form.id ? { ...c, ...payload, deckId: form.deckId } : c,
          )
        : [
            ...d.cards,
            {
              ...payload,
              id: uid(),
              deckId: form.deckId,
              wordId: form.wordId || null,
            },
          ],
    }));
    setModal(null);
    notify(
      form.id
        ? "Đã lưu thay đổi."
        : `Đã thêm vào “${data.decks.find((d) => d.id === form.deckId).name}”.`,
    );
    return "";
  }
  return (
    <div className="app">
      <a className="skip" href="#main">
        Đến nội dung
      </a>
      {mobile && <div className="nav-shade" onClick={() => setMobile(false)} />}
      <aside
        className={`sidebar ${mobile ? "open" : ""}`}
        aria-label="Điều hướng chính"
      >
        <button
          className="brand"
          onClick={() => go("search")}
          aria-label="Kotoba — trang tra từ"
        >
          <span className="brand-mark">
            言<span>•</span>
          </span>
          <span>
            kotoba<span className="brand-caption">TỪNG TỪ, MỖI NGÀY</span>
          </span>
        </button>
        <div className="nav-label">GÓC HỌC CỦA BẠN</div>
        <nav>
          {[
            { id: "search", icon: Search, label: "Tra từ điển" },
            { id: "decks", icon: Layers, label: "Bộ thẻ của tôi" },
            {
              id: "review",
              icon: Repeat2,
              label: "Ôn tập",
              count: data.user ? remaining : null,
            },
            { id: "analysis", icon: ScanLine, label: "Phân tích ảnh" },
            { id: "reminders", icon: Clock, label: "Nhắc học" },
          ].map((item) => (
            <button
              key={item.id}
              className={`nav-item ${active === item.id ? "active" : ""}`}
              onClick={() => go(item.id)}
              aria-current={active === item.id ? "page" : undefined}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.count > 0 && <b className="nav-count">{item.count}</b>}
              {item.soon && (
                <span className="soon-dot" title="Chưa triển khai" />
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="mini-kanji">学</span>
          <p>
            Một chút mỗi ngày.
            <br />
            Một bước gần hơn.
          </p>
          <div className="note-line" />
        </div>
        <div className="sidebar-bottom">
          <div className="streak-mini">
            <span className="flame-icon">
              <Flame size={19} />
            </span>
            <div>
              <b>{streak} ngày liên tiếp</b>
              <small>
                {data.studyDays.includes(localDay())
                  ? "Hôm nay bạn đã học rồi!"
                  : "Bắt đầu từ một thẻ hôm nay."}
              </small>
            </div>
          </div>
          <button
            className={`nav-item ${active === "profile" ? "active" : ""}`}
            onClick={() => go("profile")}
          >
            <User size={20} />
            <span>Tài khoản</span>
            <ChevronRight size={16} />
          </button>
          <div className="sidebar-foot">
            Bản thử giao diện <span>v0.1</span>
          </div>
        </div>
      </aside>
      <div className="workspace" inert={mobile || undefined}>
        <header className="topbar">
          <div className="top-left">
            <button
              className="icon-btn mobile-menu"
              onClick={() => setMobile(!mobile)}
              aria-label="Mở menu"
              aria-expanded={mobile}
            >
              <Menu />
            </button>
            <span className="breadcrumb">
              Không gian học tập <ChevronRight size={13} />{" "}
              <b>
                {
                  {
                    search: "Từ điển",
                    detail: "Chi tiết từ",
                    decks: "Bộ thẻ",
                    review: "Ôn tập",
                    profile: "Tài khoản",
                    analysis: "Phân tích ảnh",
                    reminders: "Nhắc học",
                    login: "Đăng nhập",
                    notfound: "Không tìm thấy",
                  }[page]
                }
              </b>
            </span>
          </div>
          <div className="top-right">
            <span className="demo-label">
              <span /> Dữ liệu mẫu
            </span>
            {data.user ? (
              <button
                className="avatar"
                onClick={() => go("profile")}
                aria-label="Mở tài khoản"
              >
                {data.user.name.slice(0, 1).toUpperCase()}
              </button>
            ) : (
              <button className="text-login" onClick={() => go("login")}>
                Đăng nhập <ArrowUpRight size={15} />
              </button>
            )}
          </div>
        </header>
        <main id="main" tabIndex={-1} ref={main}>
          {storageError && (
            <div className="notice error">
              <Info size={17} />
              Trình duyệt không cho lưu dữ liệu. Thay đổi chỉ được giữ đến khi
              tải lại trang.
            </div>
          )}
          {page === "search" && (
            <SearchPage
              words={words}
              query={query}
              setQuery={setQuery}
              direction={direction}
              setDirection={setDirection}
              filter={filter}
              setFilter={setFilter}
              results={results}
              data={data}
              remaining={remaining}
              beginReview={beginReview}
              showWord={showWord}
              addWord={addWord}
              setModal={setModal}
              searchBusy={searchBusy}
              searchError={searchError}
              searchFail={searchFail}
              setSearchFail={setSearchFail}
              setSearchRetry={setSearchRetry}
            />
          )}
          {page === "detail" && selected && (
            <DetailPage
              selected={selected}
              go={go}
              addWord={addWord}
              showWord={showWord}
              words={words}
            />
          )}
          {page === "decks" && (
            <DecksPage
              data={data}
              deckId={deckId}
              go={go}
              requireUser={requireUser}
              setModal={setModal}
              reviewedToday={reviewedToday}
              beginReview={beginReview}
            />
          )}
          {page === "review" && (
            <ReviewPage
              data={data}
              remaining={remaining}
              session={session}
              setSession={setSession}
              revealed={revealed}
              setRevealed={setRevealed}
              beginReview={beginReview}
              setModal={setModal}
              streak={streak}
              go={go}
              grade={grade}
            />
          )}
          {page === "profile" && (
            <ProfilePage
              data={data}
              setData={setData}
              setSession={setSession}
              setModal={setModal}
              notify={notify}
              streak={streak}
              beginReview={beginReview}
              reviewedToday={reviewedToday}
              go={go}
            />
          )}
          {page === "analysis" &&
            (data.user ? (
              <AnalysisPage
                onAdd={(items) =>
                  requireUser(() => setModal({ type: "batch", items }))
                }
              />
            ) : (
              <>
                <PageTitle
                  eyebrow="TỪ ẢNH ĐẾN BỘ THẺ"
                  title="Phân tích ảnh tiếng Nhật"
                  text="Mở tài khoản mẫu để thử ảnh và lưu nội dung học."
                />
                <LoginGate onLogin={() => setModal({ type: "login" })} />
              </>
            ))}
          {page === "reminders" &&
            (data.user ? (
              <RemindersPage
                settings={data.reminders}
                onSave={(reminders) => {
                  setData((d) => ({ ...d, reminders }));
                  notify(
                    "Đã lưu lịch nhắc trên thiết bị. Chưa gửi thông báo thật.",
                  );
                }}
              />
            ) : (
              <LoginGate onLogin={() => setModal({ type: "login" })} />
            ))}
          {page === "login" && (
            <section className="panel login-page">
              <h1>Đăng nhập</h1>
              <LoginPanel onLogin={login} onCancel={() => go("search")} />
            </section>
          )}
          {(page === "notfound" || (page === "detail" && !selected)) && (
            <Empty
              icon={Search}
              title="Không tìm thấy trang"
              text="Đường dẫn không đúng hoặc từ chưa có trong dữ liệu mẫu."
              action="Về tra từ"
              onAction={() => go("search")}
            />
          )}
          <footer className="footer">
            <span>
              kotoba <span className="footer-dot">·</span> Từng từ, mỗi ngày.
            </span>
            <span>Thiết kế thử nghiệm · React & CSS</span>
          </footer>
        </main>
      </div>
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
          <button onClick={() => setToast("")} aria-label="Đóng thông báo">
            <X size={16} />
          </button>
        </div>
      )}
      {modal && (
        <Modal
          title={
            {
              login: "Bắt đầu góc học của bạn",
              card: modal.card ? "Sửa thẻ" : "Thêm vào bộ thẻ",
              deck: modal.deck ? "Chỉnh sửa bộ thẻ" : "Tạo bộ thẻ mới",
              deleteDeck: "Xóa bộ thẻ?",
              deleteCard: "Xóa thẻ này?",
              profile: "Tên bạn muốn được gọi",
              endReview: "Kết thúc buổi ôn?",
              kanji: "Vẽ Kanji để tra",
              batch: "Lưu nội dung đã chọn",
            }[modal.type]
          }
          onClose={() => {
            setModal(null);
            pending.current = null;
          }}
        >
          {modal.type === "login" && (
            <LoginPanel
              onLogin={login}
              onCancel={() => {
                setModal(null);
                pending.current = null;
              }}
            />
          )}
          {modal.type === "kanji" && (
            <KanjiPad
              onChoose={(c) => {
                setQuery(c);
                setDirection("ja");
                setFilter("Tất cả");
                setModal(null);
                go("search");
              }}
            />
          )}
          {modal.type === "batch" && (
            <BatchCardForm
              items={modal.items}
              decks={data.decks}
              onSave={saveBatch}
              onClose={() => setModal(null)}
            />
          )}
          {modal.type === "card" && (
            <CardForm
              data={data}
              modal={modal}
              save={saveCard}
              createDeck={(name) => {
                const id = uid();
                setData((d) => ({
                  ...d,
                  decks: [
                    ...d.decks,
                    { id, name, description: "", color: "green" },
                  ],
                }));
                return id;
              }}
              onClose={() => setModal(null)}
            />
          )}
          {modal.type === "deck" && (
            <DeckForm
              deck={modal.deck}
              onClose={() => setModal(null)}
              save={(name, description) => {
                setData((d) => ({
                  ...d,
                  decks: modal.deck
                    ? d.decks.map((x) =>
                        x.id === modal.deck.id
                          ? { ...x, name, description }
                          : x,
                      )
                    : [
                        ...d.decks,
                        {
                          id: uid(),
                          name,
                          description,
                          color: d.decks.length % 2 ? "peach" : "green",
                        },
                      ],
                }));
                setModal(null);
                notify("Đã lưu bộ thẻ.");
              }}
            />
          )}
          {modal.type === "profile" && (
            <NameForm
              name={data.user.name}
              onClose={() => setModal(null)}
              save={(name) => {
                setData((d) => ({ ...d, user: { ...d.user, name } }));
                setModal(null);
                notify("Đã cập nhật tên hiển thị.");
              }}
            />
          )}
          {(modal.type === "deleteCard" || modal.type === "deleteDeck") && (
            <>
              <p className="modal-description">
                {modal.type === "deleteDeck"
                  ? `Bộ “${modal.deck.name}” và ${data.cards.filter((c) => c.deckId === modal.deck.id).length} thẻ bên trong sẽ bị xóa trên trình duyệt này.`
                  : `Thẻ “${modal.card.front}” sẽ bị xóa khỏi bộ của bạn.`}{" "}
                Thao tác này không thể hoàn tác.
              </p>
              <div className="modal-actions">
                <button className="secondary" onClick={() => setModal(null)}>
                  Giữ lại
                </button>
                <button
                  className="danger"
                  onClick={() => {
                    const ids =
                      modal.type === "deleteDeck"
                        ? data.cards
                            .filter((c) => c.deckId === modal.deck.id)
                            .map((c) => c.id)
                        : [modal.card.id];
                    setData((d) => ({
                      ...d,
                      decks:
                        modal.type === "deleteDeck"
                          ? d.decks.filter((x) => x.id !== modal.deck.id)
                          : d.decks,
                      cards: d.cards.filter((c) => !ids.includes(c.id)),
                      reviews: d.reviews.filter((r) => !ids.includes(r.cardId)),
                    }));
                    if (modal.type === "deleteDeck") go("decks");
                    setSession(null);
                    setModal(null);
                    notify("Đã xóa.");
                  }}
                >
                  Xóa {modal.type === "deleteDeck" ? "bộ thẻ" : "thẻ"}
                </button>
              </div>
            </>
          )}
          {modal.type === "endReview" && (
            <>
              <p className="modal-description">
                Kết quả của những thẻ đã ôn được giữ lại. Bạn có thể quay lại
                học các thẻ còn lại sau.
              </p>
              <div className="modal-actions">
                <button className="secondary" onClick={() => setModal(null)}>
                  Học tiếp
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    setSession(null);
                    setModal(null);
                  }}
                >
                  Kết thúc buổi ôn
                </button>
              </div>
            </>
          )}
        </Modal>
      )}
    </div>
  );
}
