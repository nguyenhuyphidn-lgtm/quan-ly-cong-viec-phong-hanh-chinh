import React from "react";

export default function Header({ currentPage, onAddTask, setSidebarOpen }) {
  const getPageTitleInfo = () => {
    switch (currentPage) {
      case "dashboard":
        return {
          title: "Bảng Điều Khiển Tổng Quan",
          subtitle: "Thống kê tiến độ công việc, trạng thái và hiệu suất làm việc của Phòng Hành chính"
        };
      case "tasks":
        return {
          title: "Danh Sách Công Việc",
          subtitle: "Quản lý chi tiết toàn bộ các công việc được giao của phòng"
        };
      case "byStaff":
        return {
          title: "Theo Dõi Theo Nhân Sự",
          subtitle: "Thống kê số lượng công việc phụ trách và hiệu suất hoàn thành của từng nhân viên"
        };
      case "byPriority":
        return {
          title: "Phân Loại Theo Mức Ưu Tiên",
          subtitle: "Xem các công việc theo mức độ quan trọng và khẩn cấp để xử lý kịp thời"
        };
      case "overdue":
        return {
          title: "Công Việc Chậm Tiến Độ",
          subtitle: "Danh sách công việc đã quá deadline hoặc ghi nhận tình trạng trễ hạn cần xử lý gấp"
        };
      case "staff":
        return {
          title: "Nhân Sự Phòng Hành Chính",
          subtitle: "Danh sách cán bộ nhân viên và mảng công việc phụ trách chuyên môn"
        };
      case "reports":
        return {
          title: "Báo Cáo Tổng Hợp",
          subtitle: "Phân tích số liệu thống kê chi tiết và kết xuất báo cáo định dạng Excel (CSV)"
        };
      case "settings":
        return {
          title: "Cài Đặt Danh Mục",
          subtitle: "Quản lý và cấu hình các danh mục trạng thái, mức độ ưu tiên và các tham số khác"
        };
      default:
        return {
          title: "Hệ Thống Quản Lý Công Việc",
          subtitle: "Phòng Hành chính - Công ty Cổ phần Dịch vụ Cáp treo Bà Nà"
        };
    }
  };

  const { title, subtitle } = getPageTitleInfo();

  // Reference date: May 23, 2026
  const getFormattedDate = () => {
    const today = new Date();
    // Use the 2026 reference year from the system context
    const year = today.getFullYear() < 2026 ? 2026 : today.getFullYear();
    const month = today.getFullYear() < 2026 ? 4 : today.getMonth(); // 4 is May
    const date = today.getFullYear() < 2026 ? 23 : today.getDate();
    
    const weekdayNames = ["Chủ nhật", "Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"];
    const d = new Date(year, month, date);
    const dayName = weekdayNames[d.getDay()];

    const pad = (n) => String(n).padStart(2, "0");
    return `${dayName}, ${pad(date)}/${pad(month + 1)}/${year}`;
  };

  return (
    <header className="header">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Mobile Hamburger menu */}
        <button className="mobile-menu-toggle btn-icon" onClick={() => setSidebarOpen(prev => !prev)} style={{ display: "none" }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", height: "20px" }}>
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
        <div className="header-left">
          <h2 className="header-title">{title}</h2>
          <p className="header-subtitle">{subtitle}</p>
        </div>
      </div>
      <div className="header-right">
        <div className="status-badge-cloud" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", border: "1px solid rgba(22, 163, 74, 0.2)", backgroundColor: "rgba(22, 163, 74, 0.05)", borderRadius: "var(--radius-full)" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }}></span>
          <span style={{ color: "#16a34a", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>ONLINE (ĐÃ ĐỒNG BỘ CLOUD)</span>
        </div>
        <div className="date-badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px", color: "var(--primary-accent)" }}>
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          <span>{getFormattedDate()}</span>
        </div>
        <button className="btn-primary" onClick={onAddTask}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "16px", height: "16px" }}>
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
          <span>Thêm công việc</span>
        </button>
      </div>
    </header>
  );
}
