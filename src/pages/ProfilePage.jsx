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
export default function ProfilePage({
  data,
  setData,
  setSession,
  setModal,
  notify,
  streak,
  beginReview,
  reviewedToday,
  go,
}) {
  return (
    <>
      <PageTitle
        eyebrow="KHÔNG GIAN CỦA RIÊNG BẠN"
        title="Hành trình học của bạn."
        text="Những điều nhỏ bạn làm mỗi ngày sẽ tạo nên khác biệt."
      />
      {!data.user ? (
        <LoginGate onLogin={() => setModal({ type: "login" })} />
      ) : (
        <div className="profile-grid">
          <section className="panel profile-card">
            <div className="profile-avatar">
              {data.user.name[0].toUpperCase()}
            </div>
            <h2>{data.user.name}</h2>
            <p>{data.user.email}</p>
            <span className="type-tag">Tài khoản mô phỏng</span>
            <button
              className="secondary full"
              onClick={() => setModal({ type: "profile" })}
            >
              <Pencil size={16} /> Sửa tên hiển thị
            </button>
            <button
              className="logout-button"
              onClick={() => {
                setData((d) => ({ ...d, user: null }));
                setSession(null);
                notify(
                  "Đã đăng xuất bản thử. Bộ thẻ vẫn được giữ trên thiết bị.",
                );
              }}
            >
              <LogOut size={17} /> Đăng xuất
            </button>
          </section>
          <section>
            <div className="panel streak-panel">
              <div className="streak-head">
                <div>
                  <span className="eyebrow">ĐỀU ĐẶN, THEO CÁCH CỦA BẠN</span>
                  <h2>
                    <span>{streak}</span> ngày học liên tiếp
                  </h2>
                </div>
                <Flame size={38} />
              </div>
              <div className="week-days">
                {Array.from({ length: 7 }, (_, i) => i - 6).map((offset) => (
                  <div
                    key={offset}
                    className={
                      data.studyDays.includes(localDay(offset)) ? "learned" : ""
                    }
                  >
                    <span>
                      {offset === 0
                        ? "Nay"
                        : new Date(
                            `${localDay(offset)}T12:00:00`,
                          ).toLocaleDateString("vi-VN", { weekday: "short" })}
                    </span>
                    <b>
                      {data.studyDays.includes(localDay(offset)) ? (
                        <Check size={19} />
                      ) : (
                        new Date(`${localDay(offset)}T12:00:00`).getDate()
                      )}
                    </b>
                  </div>
                ))}
              </div>
              <p>
                {data.studyDays.includes(localDay())
                  ? "Bạn đã ôn hôm nay. Hãy tiếp tục theo nhịp phù hợp với mình."
                  : "Ôn và đánh giá ít nhất một thẻ để ghi nhận ngày học hôm nay."}
              </p>
              <button className="primary" onClick={() => beginReview()}>
                Ôn một chút nào <ArrowRight size={16} />
              </button>
            </div>
            <div className="profile-stats">
              <div className="panel">
                <Layers />
                <b>{data.decks.length}</b>
                <span>Bộ thẻ cá nhân</span>
              </div>
              <div className="panel">
                <BookOpen />
                <b>{data.cards.length}</b>
                <span>Từ đang lưu</span>
              </div>
              <div className="panel">
                <CheckCircle2 />
                <b>{reviewedToday.size}</b>
                <span>Thẻ đã ôn hôm nay</span>
              </div>
            </div>
            <div className="notice">
              <Clock size={20} />
              <div>
                <b>Nhắc học hằng ngày</b>
                <p>
                  {data.reminders?.enabled
                    ? `Đã lưu lịch lúc ${data.reminders.time}. Bản thử chưa gửi thông báo.`
                    : "Chọn giờ nhắc học để thử cài đặt."}
                </p>
                <button className="text-button" onClick={() => go("reminders")}>
                  Cài đặt nhắc học
                </button>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
