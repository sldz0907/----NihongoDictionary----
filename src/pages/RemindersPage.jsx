import React, { useState } from "react";
export default function RemindersPage({ settings, onSave }) {
  const [enabled, setEnabled] = useState(settings?.enabled || false),
    [time, setTime] = useState(settings?.time || "20:00"),
    [days, setDays] = useState(settings?.days || [1, 2, 3, 4, 5, 6, 0]),
    [error, setError] = useState("");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (
    <>
      <div className="page-title">
        <div>
          <div className="eyebrow">TẠO THÓI QUEN NHỎ</div>
          <h1>Giờ hẹn với bộ thẻ.</h1>
          <p>Chọn lịch phù hợp với sinh hoạt của bạn.</p>
        </div>
      </div>
      <form
        className="panel reminder-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (enabled && !days.length) {
            setError("Chọn ít nhất một ngày khi bật nhắc học.");
            return;
          }
          setError("");
          onSave({ enabled, time, days, timezone });
        }}
      >
        <p className="notice">
          Bản thử lưu cài đặt trên thiết bị này. Chưa gửi thông báo khi đến giờ
          và không xin quyền thông báo.
        </p>
        <label className="check-label">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />{" "}
          Bật lịch nhắc học
        </label>
        <label>
          Giờ nhắc
          <input
            aria-label="Giờ nhắc"
            required
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <fieldset>
          <legend>Ngày trong tuần</legend>
          <div className="weekday-choices">
            {[
              "Chủ nhật",
              "Thứ hai",
              "Thứ ba",
              "Thứ tư",
              "Thứ năm",
              "Thứ sáu",
              "Thứ bảy",
            ].map((label, i) => (
              <label key={i} className="check-label">
                <input
                  type="checkbox"
                  checked={days.includes(i)}
                  onChange={(e) =>
                    setDays((s) =>
                      e.target.checked ? [...s, i] : s.filter((d) => d !== i),
                    )
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <p className="muted">Múi giờ thiết bị: {timezone}</p>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="primary" type="submit">
          Lưu lịch nhắc
        </button>
      </form>
    </>
  );
}
