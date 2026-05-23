import React, { useState } from "react";
import { dateUtils } from "../services/dataService";

export default function TaskByStaff({ tasks, staffList, stats, onEditTask }) {
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Helper to get initials of a name
  const getInitials = (name) => {
    if (!name) return "";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper to filter tasks for a specific staff member
  const getTasksForStaff = (staffName) => {
    return tasks.filter(t => {
      const lead = t.nhanSuDauMoi.toLowerCase();
      const fullName = staffName.toLowerCase();
      const lastName = staffName.split(" ").pop().toLowerCase();
      return lead === fullName || lead === lastName;
    });
  };

  return (
    <div className="task-by-staff-view animate-fade-in">
      {/* Grid of Staff Cards */}
      <div className="personnel-grid">
        {stats.staffStats.map((s) => {
          const isActive = selectedStaff && selectedStaff.stt === s.stt;
          return (
            <div
              key={s.stt}
              className={`personnel-card ${isActive ? "active" : ""}`}
              onClick={() => setSelectedStaff(isActive ? null : s)}
            >
              <div className="personnel-card-header">
                <div className="avatar-placeholder">{getInitials(s.hoTen)}</div>
                <div className="personnel-meta">
                  <h4 className="personnel-name">{s.hoTen}</h4>
                  <span className="personnel-role" title={s.mangCongViec}>
                    {s.mangCongViec.length > 35 ? s.mangCongViec.substring(0, 35) + "..." : s.mangCongViec}
                  </span>
                </div>
              </div>
              
              <div className="personnel-card-body">
                <div className="staff-stat-row">
                  <span className="staff-stat-label">Tổng công việc</span>
                  <span className="staff-stat-value"><strong>{s.total}</strong> việc</span>
                </div>
                <div className="staff-stat-row">
                  <span className="staff-stat-label">Hoàn thành</span>
                  <span className="staff-stat-value success">{s.completed} việc</span>
                </div>
                <div className="staff-stat-row">
                  <span className="staff-stat-label">Đang thực hiện</span>
                  <span className="staff-stat-value warning">{s.inProgress} việc</span>
                </div>
                <div className="staff-stat-row">
                  <span className="staff-stat-label">Trễ hạn / Chậm tiến độ</span>
                  <span className={`staff-stat-value ${s.overdue > 0 ? "danger" : ""}`}>{s.overdue} việc</span>
                </div>
                <div className="staff-stat-row" style={{ marginTop: "6px", borderTop: "1px solid var(--border-color)", paddingTop: "8px" }}>
                  <span className="staff-stat-label" style={{ fontWeight: 600 }}>Tỷ lệ hoàn thành</span>
                  <span className="staff-stat-value" style={{ color: "var(--primary-accent)", fontWeight: 700 }}>
                    {s.avgCompletion}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Staff's Task Table */}
      {selectedStaff && (
        <div className="panel animate-slide-up" style={{ marginTop: "24px" }}>
          <div className="panel-header" style={{ backgroundColor: "var(--bg-main)" }}>
            <h3 className="panel-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--primary-accent)" }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              <span>Công việc đang phụ trách của: <strong>{selectedStaff.hoTen}</strong></span>
            </h3>
            <span className="badge status-dang-thuc-hien" style={{ fontSize: "0.8rem" }}>
              Hiệu suất: {selectedStaff.avgCompletion}%
            </span>
          </div>
          <div className="table-wrapper">
            {getTasksForStaff(selectedStaff.hoTen).length === 0 ? (
              <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                Nhân viên này hiện không phụ trách công việc nào.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th style={{ width: "50px" }}>STT</th>
                    <th>Nội dung công việc</th>
                    <th>Phối hợp</th>
                    <th>Ngày giao</th>
                    <th>Deadline</th>
                    <th>Mức ưu tiên</th>
                    <th>Trạng thái</th>
                    <th>% Hoàn thành</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {getTasksForStaff(selectedStaff.hoTen).map((t, index) => {
                    const isOverdue = dateUtils.isOverdue(t);
                    const statusClass = t.trangThai === "Chưa thực hiện" ? "status-chua-thuc-hien" 
                      : t.trangThai === "Đang thực hiện" ? "status-dang-thuc-hien" 
                      : t.trangThai === "Hoàn thành" ? "status-hoan-thanh" 
                      : t.trangThai === "Tạm dừng" ? "status-tam-dung" : "status-cham-tien-do";
                    
                    const prioClass = t.uuTien.includes("Khẩn cấp") ? "prio-urgent" 
                      : t.uuTien.includes("Cao") ? "prio-high" 
                      : t.uuTien.includes("Trung bình") ? "prio-medium" : "prio-low";

                    return (
                      <tr key={t.stt} className={isOverdue ? "row-overdue" : ""}>
                        <td style={{ fontWeight: 600, textAlign: "center" }}>{index + 1}</td>
                        <td style={{ fontWeight: 500 }}>
                          {t.noiDung}
                          {isOverdue && (
                            <span className="overdue-badge-inline" style={{ marginLeft: "8px", fontSize: "0.75rem" }}>
                              (Trễ hạn)
                            </span>
                          )}
                        </td>
                        <td>{t.phoiHop || "—"}</td>
                        <td>{t.ngayGiao}</td>
                        <td style={{ fontWeight: isOverdue ? 700 : "normal", color: isOverdue ? "var(--status-delayed)" : "inherit" }}>
                          {t.deadline}
                        </td>
                        <td>
                          <span className={`badge ${prioClass}`}>{t.uuTien}</span>
                        </td>
                        <td>
                          <span className={`badge ${statusClass}`}>{t.trangThai}</span>
                        </td>
                        <td>
                          <div className="progress-bar-container">
                            <div className="progress-track">
                              <div className="progress-fill" style={{ width: `${t.phanTramHoanThanh}%`, backgroundColor: t.phanTramHoanThanh >= 80 ? "var(--status-completed)" : "var(--status-progress)" }}></div>
                            </div>
                            <span className="progress-text">{t.phanTramHoanThanh}%</span>
                          </div>
                        </td>
                        <td>
                          <button className="btn-icon edit" title="Sửa" onClick={() => onEditTask(t)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/>
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                            </svg>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
