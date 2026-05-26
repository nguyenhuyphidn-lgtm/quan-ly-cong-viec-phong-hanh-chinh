import React from "react";

export default function Sidebar({ currentPage, setCurrentPage, stats, sidebarOpen, setSidebarOpen, onLogout }) {
  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
      )
    },
    {
      id: "tasks",
      label: "Danh sách công việc",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <line x1="8" x2="21" y1="6" y2="6" />
          <line x1="8" x2="21" y1="12" y2="12" />
          <line x1="8" x2="21" y1="18" y2="18" />
          <line x1="3" x2="3.01" y1="6" y2="6" />
          <line x1="3" x2="3.01" y1="12" y2="12" />
          <line x1="3" x2="3.01" y1="18" y2="18" />
        </svg>
      )
    },
    {
      id: "byStaff",
      label: "Công việc theo nhân sự",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: "byPriority",
      label: "Công việc theo mức ưu tiên",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
          <line x1="4" x2="4" y1="22" y2="15" />
        </svg>
      )
    },
    {
      id: "overdue",
      label: "Công việc chậm tiến độ",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      ),
      badge: stats.overdueCount + stats.delayedTasksStatus > 0 ? stats.overdueCount + stats.delayedTasksStatus : null
    },
    {
      id: "staff",
      label: "Nhân sự Phòng Hành chính",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    },
    {
      id: "reports",
      label: "Báo cáo tổng hợp",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <line x1="18" x2="18" y1="20" y2="10" />
          <line x1="12" x2="12" y1="20" y2="4" />
          <line x1="6" x2="6" y1="20" y2="14" />
        </svg>
      )
    },
    {
      id: "settings",
      label: "Cài đặt danh mục",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="menu-icon">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <div className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
      <div className="sidebar-header" style={{ marginBottom: "8px" }}>
        <div className="logo-icon">HC</div>
        <div className="logo-text">
          <h1>Hành chính</h1>
          <span>BÀ NÀ HILLS</span>
        </div>
      </div>
      <div className="sidebar-status-cloud" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", margin: "0 16px 16px 16px", backgroundColor: "rgba(34, 197, 94, 0.08)", border: "1px solid rgba(34, 197, 94, 0.2)", borderRadius: "var(--radius-full)" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#22c55e", display: "inline-block", boxShadow: "0 0 8px #22c55e" }}></span>
        <span style={{ color: "#4ade80", fontWeight: 700, fontSize: "0.7rem", letterSpacing: "0.5px", textTransform: "uppercase" }}>ONLINE (ĐÃ ĐỒNG BỘ CLOUD)</span>
      </div>
      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <a
            key={item.id}
            className={`menu-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => {
              setCurrentPage(item.id);
              setSidebarOpen(false); // Close sidebar on mobile
            }}
          >
            <div className="menu-item-left">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`menu-badge ${item.id === "overdue" ? "urgent" : ""}`}>
                {item.badge}
              </span>
            )}
          </a>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="btn-logout" onClick={onLogout} title="Đăng xuất khỏi hệ thống" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "8px 12px",
          backgroundColor: "rgba(239, 68, 68, 0.1)",
          color: "#f87171",
          border: "1px solid rgba(239, 68, 68, 0.2)",
          borderRadius: "var(--radius-md)",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "var(--transition-fast)"
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "8px" }}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Đăng xuất</span>
        </button>
        <p style={{ marginTop: "12px" }}>Quản lý Công việc © 2026</p>
        <p style={{ marginTop: "4px", fontSize: "0.7rem", opacity: 0.6 }}>Phòng Hành chính Nhân sự</p>
      </div>
    </div>
  );
}
