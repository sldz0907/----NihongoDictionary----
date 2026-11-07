import React from "react";
import { ArrowRight, User } from "lucide-react";
export function PageTitle({ eyebrow, title, text, action }) {
  return (
    <div className="page-title">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}
export function Empty({ icon: Icon, title, text, action, onAction }) {
  return (
    <div className="empty">
      <div className="large-symbol">
        <Icon size={29} />
      </div>
      <h2>{title}</h2>
      <p>{text}</p>
      {action && (
        <button className="secondary" onClick={onAction}>
          {action}
          <ArrowRight size={16} />
        </button>
      )}
    </div>
  );
}
export function LoginGate({ onLogin }) {
  return (
    <Empty
      icon={User}
      title="Một góc học tập dành riêng cho bạn"
      text="Mở tài khoản mẫu để thử bộ thẻ, ôn tập và theo dõi chuỗi ngày học. Không cần nhập thông tin thật."
      action="Mở tài khoản mẫu"
      onAction={onLogin}
    />
  );
}
