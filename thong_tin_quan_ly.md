# THÔNG TIN QUẢN LÝ DỰ ÁN QUẢN LÝ CÔNG VIỆC PHÒNG HÀNH CHÍNH

Tài liệu này tổng hợp toàn bộ các thông tin kỹ thuật, đường dẫn lưu trữ, tài khoản quản trị và hệ thống sao lưu của dự án để thuận tiện cho việc bàn giao và quản lý lâu dài.

---

## 1. Thông tin Chung dự án
* **Tên dự án**: Cổng quản lý công việc Phòng Hành chính - Bà Nà Hills
* **Nền tảng công nghệ**: ReactJS (Vite), CSS Vanilla, Progressive Web App (PWA), Firebase Firestore (Online).
* **Đường dẫn thư mục dự án trên máy tính (Local Path)**:
  `d:\01 CONG VIEC\OneDrive - sungroup.com.vn\01. BÀ NÀ\11 CHUYỂN ĐỔI SỐ\01 CÁC DỰ ÁN\03 PHÒNG HANH CHÍNH NHÂN SỰ - QUẢN LÝ CÔNG VIỆC`

---

## 2. Lưu trữ Mã nguồn & Hosting Trực tuyến
* **Kho lưu trữ mã nguồn (GitHub Repository)**:
  * **Tài khoản liên kết**: `nguyenhuyphidn@gmail.com`
  * **Địa chỉ kho**: [https://github.com/nguyenhuyphidn-lgtm/quan-ly-cong-viec-phong-hanh-chinh](https://github.com/nguyenhuyphidn-lgtm/quan-ly-cong-viec-phong-hanh-chinh)
  * **Nhánh chính (Branch)**: `main`
* **Website trực tuyến (Vercel Production Hosting)**:
  * **Địa chỉ truy cập**: [https://quan-ly-cong-viec-phong-hanh-chinh.vercel.app](https://quan-ly-cong-viec-phong-hanh-chinh.vercel.app)
  * *(Hệ thống tự động biên dịch và cập nhật lên link này mỗi khi có code mới được đẩy lên nhánh main của GitHub)*

---

## 3. Cơ sở dữ liệu Đám mây (Firebase Cloud Database)
Dữ liệu của ứng dụng được lưu trữ trực tuyến thời gian thực trên Firebase Firestore:
* **Firebase Project ID**: `task-manager-bana`
* **Bảng dữ liệu công việc (Tasks Collection)**: `phc_tasks`
* **Bảng dữ liệu nhân sự (Staff Collection)**: `phc_staff`
* **Quy tắc bảo mật (Security Rules)**: Cho phép đọc/ghi công khai không cần đăng nhập Firebase Auth để phục vụ đồng bộ nhanh chóng.

---

## 4. Tài khoản Đăng nhập Hệ thống (Website & App di động)
Để truy cập vào hệ thống trên mọi thiết bị, sử dụng tài khoản cố định sau:
* **Tài khoản (Email)**: `PhongHC2023@gmail.com` *(luôn được điền sẵn mặc định)*
* **Mật khẩu**: `Phonghanhchinh23`

---

## 5. Hệ thống Sao lưu Tự động (Daily Auto Backup)
Hệ thống được thiết lập tự động nén toàn bộ mã nguồn dự án thành file `.zip` (loại bỏ thư mục rác `node_modules` và `dist` để tiết kiệm dung lượng) vào lúc **16:30 hàng ngày**.
* **Thư mục lưu trữ tệp sao lưu cục bộ**:
  `d:\01 CONG VIEC\OneDrive - sungroup.com.vn\01. BÀ NÀ\11 CHUYỂN ĐỔI SỐ\01 CÁC DỰ ÁN\03 PHÒNG HANH CHÍNH NHÂN SỰ - QUẢN LÝ CÔNG VIỆC\backups\`
* **Cách kích hoạt/đăng ký lại lịch sao lưu trên máy tính**:
  1. Truy cập vào thư mục gốc của dự án.
  2. Nhấp chuột phải vào tệp `install_autobackup.bat` và chọn **Run as Administrator** (Chạy với quyền Administrator).
  3. Hệ thống sẽ tự động đăng ký tác vụ sao lưu vào Task Scheduler. Nhấn phím bất kỳ để đóng cửa sổ khi hoàn thành.
