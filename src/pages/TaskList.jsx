import React, { useState } from "react";
import { dateUtils } from "../services/dataService";

export default function TaskList({ tasks, staffList, onEditTask, onDeleteTask, onAddTask }) {
  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStaff, setFilterStaff] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterDeadline, setFilterDeadline] = useState("all"); // all, overdue, today, week, month

  // Sorting state
  const [sortField, setSortField] = useState(""); // ngayGiao, deadline, phanTramHoanThanh
  const [sortAsc, setSortAsc] = useState(true);

  // Details Modal state
  const [viewingTask, setViewingTask] = useState(null);

  // Helper: check if a date is within this week
  const isThisWeek = (date) => {
    const today = dateUtils.getCurrentDate();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    startOfWeek.setHours(0, 0, 0, 0);
    endOfWeek.setHours(23, 59, 59, 999);
    
    return date >= startOfWeek && date <= endOfWeek;
  };

  // Helper: check if a date is within this month
  const isThisMonth = (date) => {
    const today = dateUtils.getCurrentDate();
    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  // 1. FILTERING LOGIC
  const filteredTasks = tasks.filter((t) => {
    // Search by content
    if (searchTerm && !t.noiDung.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by staff
    if (filterStaff && t.nhanSuDauMoi !== filterStaff) {
      return false;
    }

    // Filter by status
    if (filterStatus && t.trangThai !== filterStatus) {
      return false;
    }

    // Filter by priority
    if (filterPriority && t.uuTien !== filterPriority) {
      return false;
    }

    // Filter by deadline timeframe
    if (filterDeadline !== "all") {
      const deadlineDate = dateUtils.parseDDMMYYYY(t.deadline);
      if (!deadlineDate) return false;
      const today = dateUtils.getCurrentDate();
      const diff = dateUtils.getDaysDifference(today, deadlineDate); // positive if deadline in future

      if (filterDeadline === "overdue") {
        return dateUtils.isOverdue(t);
      }
      if (filterDeadline === "today") {
        return diff === 0 && t.trangThai !== "Hoàn thành";
      }
      if (filterDeadline === "week") {
        return isThisWeek(deadlineDate) && t.trangThai !== "Hoàn thành";
      }
      if (filterDeadline === "month") {
        return isThisMonth(deadlineDate) && t.trangThai !== "Hoàn thành";
      }
    }

    return true;
  });

  // 2. SORTING LOGIC
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (!sortField) return 0;

    let valA, valB;

    if (sortField === "phanTramHoanThanh") {
      valA = a.phanTramHoanThanh;
      valB = b.phanTramHoanThanh;
    } else {
      // Date fields (ngayGiao or deadline)
      const dateA = dateUtils.parseDDMMYYYY(a[sortField]);
      const dateB = dateUtils.parseDDMMYYYY(b[sortField]);
      valA = dateA ? dateA.getTime() : 0;
      valB = dateB ? dateB.getTime() : 0;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const formatCurrency = (val) => {
    if (!val) return "—";
    return new Intl.NumberFormat("vi-VN").format(val) + " VNĐ";
  };

  return (
    <div className="task-list-view animate-fade-in">
      
      {/* Filters & Search Panel */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Bộ lọc công việc</h3>
          <button className="btn-primary" onClick={onAddTask} style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
            + Thêm mới
          </button>
        </div>
        <div className="filters-bar">
          {/* Search Box */}
          <div className="filter-group search-input-wrapper">
            <label>Tìm kiếm công việc</label>
            <input
              type="text"
              placeholder="Nhập nội dung công việc cần tìm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Filter Staff */}
          <div className="filter-group">
            <label>Nhân sự đầu mối</label>
            <select
              value={filterStaff}
              onChange={(e) => setFilterStaff(e.target.value)}
              className="form-control"
            >
              <option value="">Tất cả</option>
              {staffList.map(s => (
                <option key={s.stt} value={s.hoTen}>{s.hoTen}</option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="filter-group">
            <label>Trạng thái</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="form-control"
            >
              <option value="">Tất cả</option>
              <option value="Chưa thực hiện">Chưa thực hiện</option>
              <option value="Đang thực hiện">Đang thực hiện</option>
              <option value="Hoàn thành">Hoàn thành</option>
              <option value="Tạm dừng">Tạm dừng</option>
              <option value="Chậm tiến độ">Chậm tiến độ</option>
            </select>
          </div>

          {/* Filter Priority */}
          <div className="filter-group">
            <label>Mức ưu tiên</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="form-control"
            >
              <option value="">Tất cả</option>
              <option value="0. Khẩn cấp">0. Khẩn cấp</option>
              <option value="1. Cao">1. Cao</option>
              <option value="2. Trung bình">2. Trung bình</option>
              <option value="3. Thấp">3. Thấp</option>
            </select>
          </div>

          {/* Filter Deadline */}
          <div className="filter-group">
            <label>Theo hạn hoàn thành</label>
            <select
              value={filterDeadline}
              onChange={(e) => setFilterDeadline(e.target.value)}
              className="form-control"
            >
              <option value="all">Tất cả thời gian</option>
              <option value="overdue">Đã quá hạn</option>
              <option value="today">Hạn hôm nay</option>
              <option value="week">Hạn trong tuần này</option>
              <option value="month">Hạn trong tháng này</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="table-wrapper">
          {sortedTasks.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.95rem" }}>
              Không tìm thấy công việc nào thỏa mãn bộ lọc.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>STT</th>
                  <th style={{ minWidth: "220px" }}>Nội dung công việc</th>
                  <th>Đầu mối</th>
                  <th>Phối hợp</th>
                  <th onClick={() => toggleSort("ngayGiao")} style={{ cursor: "pointer", userSelect: "none" }}>
                    Ngày giao {sortField === "ngayGiao" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th onClick={() => toggleSort("deadline")} style={{ cursor: "pointer", userSelect: "none" }}>
                    Deadline {sortField === "deadline" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th>Mức ưu tiên</th>
                  <th>Nguồn thông tin</th>
                  <th>Trạng thái</th>
                  <th onClick={() => toggleSort("phanTramHoanThanh")} style={{ cursor: "pointer", userSelect: "none" }}>
                    Tiến độ {sortField === "phanTramHoanThanh" ? (sortAsc ? "▲" : "▼") : ""}
                  </th>
                  <th>Ngân sách</th>
                  <th style={{ width: "120px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((t, idx) => {
                  const isOverdue = dateUtils.isOverdue(t);
                  const statusClass = t.trangThai === "Chưa thực hiện" ? "status-chua-thuc-hien" 
                    : t.trangThai === "Đang thực hiện" ? "status-dang-thuc-hien" 
                    : t.trangThai === "Hoàn thành" ? "status-hoan-thanh" 
                    : t.trangThai === "Tạm dừng" ? "status-tam-dung" : "status-cham-tien-do";
                  
                  const prioClass = t.uuTien.includes("Khẩn cấp") ? "prio-urgent" 
                    : t.uuTien.includes("Cao") ? "prio-high" 
                    : t.uuTien.includes("Trung bình") ? "prio-medium" : "prio-low";

                  return (
                    <tr key={t.stt} className={`${isOverdue ? "row-overdue overdue-flash" : ""}`}>
                      <td style={{ fontWeight: 600, textAlign: "center" }}>{idx + 1}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{t.noiDung}</div>
                        {isOverdue && (
                          <div style={{ fontSize: "0.75rem", color: "var(--status-delayed)", fontWeight: 600, marginTop: "2px" }}>
                            ⚠️ Trễ hạn ({Math.abs(dateUtils.getDaysDifference(dateUtils.getCurrentDate(), dateUtils.parseDDMMYYYY(t.deadline)))} ngày)
                          </div>
                        )}
                        {t.lyDoCham && (
                          <div style={{ fontSize: "0.75rem", color: "#b45309", marginTop: "2px", fontStyle: "italic" }}>
                            Lý do trễ: {t.lyDoCham}
                          </div>
                        )}
                      </td>
                      <td style={{ whiteSpace: "nowrap" }}>{t.nhanSuDauMoi}</td>
                      <td>{t.phoiHop || "—"}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{t.ngayGiao}</td>
                      <td style={{ whiteSpace: "nowrap", fontWeight: isOverdue ? 700 : "normal", color: isOverdue ? "var(--status-delayed)" : "inherit" }}>
                        {t.deadline}
                      </td>
                      <td>
                        <span className={`badge ${prioClass}`}>{t.uuTien}</span>
                      </td>
                      <td>{t.nguonThongTin || "—"}</td>
                      <td>
                        <span className={`badge ${statusClass}`}>{t.trangThai}</span>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${t.phanTramHoanThanh}%`, backgroundColor: t.phanTramHoanThanh >= 100 ? "var(--status-completed)" : "var(--status-progress)" }}></div>
                          </div>
                          <span className="progress-text">{t.phanTramHoanThanh}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{formatCurrency(t.nganSach)}</td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn-icon view" title="Xem Chi tiết" onClick={() => setViewingTask(t)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/>
                              <line x1="12" x2="12" y1="8" y2="12"/>
                              <line x1="12" x2="12.01" y1="16" y2="16"/>
                            </svg>
                          </button>
                          <button className="btn-icon edit" title="Sửa" onClick={() => onEditTask(t)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/>
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                            </svg>
                          </button>
                          <button className="btn-icon delete" title="Xóa" onClick={() => onDeleteTask(t.stt)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18"/>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Task Details Modal */}
      {viewingTask && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3 className="modal-title">Chi Tiết Công Việc</h3>
              <button className="modal-close" onClick={() => setViewingTask(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="details-grid">
                <div className="details-row">
                  <span className="details-label">Nội dung công việc:</span>
                  <span className="details-value" style={{ fontWeight: 600, fontSize: "0.95rem" }}>{viewingTask.noiDung}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Nhân sự đầu mối:</span>
                  <span className="details-value">{viewingTask.nhanSuDauMoi}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Phối hợp:</span>
                  <span className="details-value">{viewingTask.phoiHop || "Không có"}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Ngày giao:</span>
                  <span className="details-value">{viewingTask.ngayGiao}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Hạn hoàn thành (Deadline):</span>
                  <span className="details-value" style={{ fontWeight: viewingTask.trangThai !== "Hoàn thành" && dateUtils.isOverdue(viewingTask) ? "bold" : "normal" }}>
                    {viewingTask.deadline} 
                    {viewingTask.trangThai !== "Hoàn thành" && dateUtils.isOverdue(viewingTask) && (
                      <span style={{ color: "var(--status-delayed)", marginLeft: "8px" }}>
                        (Đã trễ hạn)
                      </span>
                    )}
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Mức ưu tiên:</span>
                  <span className="details-value">
                    <span className={`badge ${viewingTask.uuTien.includes("Khẩn cấp") ? "prio-urgent" : viewingTask.uuTien.includes("Cao") ? "prio-high" : viewingTask.uuTien.includes("Trung bình") ? "prio-medium" : "prio-low"}`}>
                      {viewingTask.uuTien}
                    </span>
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Nguồn thông tin:</span>
                  <span className="details-value">{viewingTask.nguonThongTin || "Không xác định"}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Trạng thái:</span>
                  <span className="details-value">
                    <span className={`badge ${viewingTask.trangThai === "Chưa thực hiện" ? "status-chua-thuc-hien" : viewingTask.trangThai === "Đang thực hiện" ? "status-dang-thuc-hien" : viewingTask.trangThai === "Hoàn thành" ? "status-hoan-thanh" : viewingTask.trangThai === "Tạm dừng" ? "status-tam-dung" : "status-cham-tien-do"}`}>
                      {viewingTask.trangThai}
                    </span>
                  </span>
                </div>
                <div className="details-row">
                  <span className="details-label">Tiến độ hoàn thành:</span>
                  <span className="details-value" style={{ fontWeight: 600 }}>{viewingTask.phanTramHoanThanh}%</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Ngân sách dự kiến:</span>
                  <span className="details-value">{formatCurrency(viewingTask.nganSach)}</span>
                </div>
                <div className="details-row">
                  <span className="details-label">Ghi chú:</span>
                  <span className="details-value">{viewingTask.ghiChu || "Không có ghi chú"}</span>
                </div>
                {viewingTask.lyDoCham && (
                  <div className="details-row" style={{ backgroundColor: "#fef2f2", padding: "8px", borderRadius: "var(--radius-sm)" }}>
                    <span className="details-label" style={{ color: "var(--status-delayed)" }}>Lý do chậm & đề xuất:</span>
                    <span className="details-value" style={{ color: "#991b1b" }}>{viewingTask.lyDoCham}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setViewingTask(null)}>Đóng</button>
              <button className="btn-primary" onClick={() => { onEditTask(viewingTask); setViewingTask(null); }}>
                Chỉnh sửa công việc
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
