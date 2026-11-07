# Kotoba Frontend — mở bằng Visual Studio Code

Thư mục này chứa toàn bộ mã frontend React + CSS, chạy độc lập với thư mục tài liệu và chưa cần backend C#.

## Mở và chạy

1. Trong VS Code chọn File → Open Folder → chọn thư mục Kotoba-Frontend. Hoặc mở file Kotoba.code-workspace.
2. Mở Terminal → New Terminal. Terminal phải nằm trong thư mục có package.json.
3. Chạy lần lượt:

```sh
npm ci
npm run dev
```

Mở http://127.0.0.1:5174 theo URL terminal in ra. Cổng 5174 giúp không trùng bản frontend trước đang dùng 5173. Khi sửa file và lưu, Vite tự cập nhật trình duyệt.

Cần cài Node.js kèm npm trước khi chạy. Bản gốc đã được kiểm tra với Node.js 22.18.0. npm ci cần mạng ở lần cài đầu. Dừng server bằng Ctrl+C.

## Các file cần biết

- src/main.jsx: khởi chạy ứng dụng.
- src/App.jsx: điều phối các trang và dữ liệu mẫu.
- src/pages/: trang tra từ, chi tiết, bộ thẻ, ôn, ảnh, tài khoản, nhắc học.
- src/components/: form, hộp thoại, bảng vẽ, xem trước thẻ.
- src/services/: mock API, localStorage và điều hướng URL.
- src/data.js: từ điển mẫu và dữ liệu ban đầu.
- src/styles.css: màu, chữ, bố cục và responsive.
- index.html: HTML khởi đầu.
- package.json và package-lock.json: thư viện, phiên bản và lệnh chạy.
- vite.config.js: cấu hình Vite, cổng 5174.

## Lệnh khác

```sh
npm run build
npm run preview
npm run format:check
```

## Phạm vi bản thử

Có tra 6 từ mẫu, bảng vẽ với gợi ý cố định, bộ thẻ và ôn cơ bản, tài khoản mẫu, lưu cài nhắc, chỉnh ảnh và luồng phân tích mẫu. Google, OCR/NLP, nhận dạng nét và gửi nhắc chưa kết nối thật. Dữ liệu lưu trên trình duyệt; ở cổng 5174 sẽ có vùng dữ liệu riêng với cổng 5173. Ảnh không gửi lên máy chủ.

Không cần chép node_modules hoặc dist từ bản cũ; npm ci sẽ cài đúng thư viện từ package-lock.json. Các script kiểm thử phụ thuộc đường dẫn máy cũ và tài liệu thiết kế vẫn ở workspace gốc, không cần để chạy frontend này.