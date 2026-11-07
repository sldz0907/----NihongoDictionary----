import React, { useState } from "react";
import { BookOpen, Info, ArrowRight } from "lucide-react";
export default function LoginPanel({ onLogin, onCancel }) {
  const [error, setError] = useState("");
  return (
    <div className="login-content">
      <div className="large-symbol">
        <BookOpen size={30} />
      </div>
      <p>
        Lưu từ mới, ôn lại mỗi ngày
        <br />
        và nhìn thấy những bước tiến của mình.
      </p>
      <div className="notice">
        <Info size={18} />
        <span>
          Đây là giao diện đăng nhập thử. Google chưa được kết nối và không yêu
          cầu mật khẩu.
        </span>
      </div>
      <button
        className="secondary full google-button"
        onClick={() =>
          setError(
            "Đăng nhập Google chưa được cấu hình. Dùng tài khoản mẫu để tiếp tục thử giao diện.",
          )
        }
      >
        <span aria-hidden="true">G</span>Tiếp tục với Google
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <button className="primary full" onClick={onLogin}>
        Dùng tài khoản mẫu <ArrowRight size={18} />
      </button>
      <button className="text-button" onClick={onCancel}>
        Tiếp tục tra từ không đăng nhập
      </button>
    </div>
  );
}
