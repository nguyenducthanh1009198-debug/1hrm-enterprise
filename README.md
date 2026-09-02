# 1HRM - Nền Tảng Quản Trị Nhân Sự Doanh Nghiệp Toàn Diện

Hệ thống quản lý nhân sự số hóa chuẩn 1Office, tích hợp:
- **Engine tính lương & Thuế TNCN**: Áp dụng biểu thuế lũy tiến 5 bậc và mức giảm trừ gia cảnh mới theo **Luật Thuế thu nhập cá nhân số 109/2025/QH15**.
- **Chấm công GPS Geofencing**: Định vị bán kính văn phòng & ca kíp làm việc.
- **Phân quyền bảo mật lương & OKR**: Chỉ vai trò HR mới nhìn thấy mức lương/bảo hiểm toàn công ty; chỉ cấp lãnh đạo mới có quyền chỉnh sửa mục tiêu OKR.
- **Mobile Self-Service App**: Chấm công, tạo 10 loại đơn từ, xem phiếu lương điện tử và chuông thông báo Realtime.
- **Cổng cài đặt OTA (Over-The-Air)**: Hỗ trợ tải trực tiếp cho iPhone và Android mà không cần App Store / Google Play.

---

## 🚀 Các Đường Link Trải Nghiệm Demo Trực Tiếp

1. **Dashboard Quản Trị Web (Admin / HR / Lead / Nhân viên)**:
   - `http://localhost:3000` (hoặc `http://<IP-may>:3000`)
2. **Mobile Self-Service App (Trải nghiệm trực tiếp trên trình duyệt)**:
   - `http://localhost:3000/mobile`
3. **Cổng Cài Đặt Ứng Dụng OTA (Cho iPhone & Android)**:
   - `http://localhost:3000/download`
4. **File Tải Cài Đặt Demo Android**:
   - `http://localhost:3000/app/1HRM.apk`

---

## 🌐 Hướng Dẫn Deploy Lên Web (Miễn Phí 100%)

### Cách 1: Deploy lên Vercel qua GitHub (Khuyên dùng - 1 Chạm)
1. Đẩy mã nguồn lên GitHub:
   ```bash
   git remote add origin https://github.com/<tai-khoan-cua-ban>/1hrm-app.git
   git branch -M main
   git push -u origin main
   ```
2. Truy cập [https://vercel.com](https://vercel.com) > Đăng nhập bằng GitHub.
3. Chọn **Add New Project** > Chọn Repository `1hrm-app` > Bấm **Deploy**.
4. Sau 1 phút, bạn sẽ có đường link công khai: `https://1hrm-app.vercel.app` để gửi cho khách hàng và nhân viên sử dụng!

### Cách 2: Deploy lên Netlify hoặc Render
- Đăng nhập [https://netlify.com](https://netlify.com) hoặc [https://render.com](https://render.com), liên kết GitHub repo và chọn Build Command: `npm run build`, Publish Directory: `.next`.

---

## 💻 Chạy Local Trên Máy
```bash
npm install
npm run dev
```
Mở trình duyệt truy cập `http://localhost:3000`.
