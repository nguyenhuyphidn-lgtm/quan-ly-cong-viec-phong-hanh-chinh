import React, { useState } from "react";
import { dateUtils } from "../services/dataService";

export default function TaskByPriority({ tasks, onEditTask }) {
  const priorities = [
    { id: "urgent", label: "0. Khẩn cấp", color: "var(--prio-urgent)", iconColor: "#f87171" },
    { id: "high", label: "1. Cao", color: "var(--prio-high)", iconColor: "#fb923c" },
    { id: "medium", label: "2. Trung bình", color: "var(--prio-medium)", iconColor: "#60a5fa" },
    { id: "low", label: "3. Thấp", color: "var(--prio-low)", iconColor: "#cbd5e1" }
  ];

  const [expandedPriority, setExpandedPriority] = useState("urgent");

  // Helper to filter tasks by priority keyword
  const getTasksByPriority = (label) => {
    return tasks.filter(t => {
      const p = t.uuTien.toLowerCase();
      const l = label.toLowerCase();
      // Match if starts with prefix or contains name
      return p.includes(l) || p.startsWith(l.substring(0, 1));
    });
  };

  return (
    <div className="task-by-priority-view animate-fade-in">
      {/* Priority stats header */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
        {priorities.map((prio) => {
          const list = getTasksByPriority(prio.label);
          const activeCount = list.filter(t => t.trangThai !== "Hoàn thành").length;
          const isExpanded = expandedPriority === prio.id;

          return (
            <div
              key={prio.id}
              className="stat-card"
              style={{
                borderColor: isExpanded ? prio.color : "var(--border-color)",
                borderWidth: isExpanded ? "2px" : "1px",
                cursor: "pointer"
              }}
              onClick={() => setExpandedPriority(prio.id)}
            >
              <div className="stat-info">
                <span className="stat-label" style={{ color: prio.color, fontWeight: 700 }}>{prio.label}</span>
                <span className="stat-value">{list.length} <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text-muted)" }}>việc</span></span>
                <span style={{ fontSize: "0.75rem", color: "var(--status-delayed)", fontWeight: 600 }}>
                  {activeCount > 0 ? `(${activeCount} việc chưa xong)` : "Đã xử lý xong"}
                </span>
              </div>
              <div className="stat-icon-wrapper" style={{ backgroundColor: `${prio.color}15`, color: prio.color }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                  <line x1="4" x2="4" y1="22" y2="15" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Priority Tasks Table */}
      {expandedPriority && (() => {
        const targetPrio = priorities.find(p => p.id === expandedPriority);
        const pTasks = getTasksByPriority(targetPrio.label);

        return (
          <div className="panel animate-slide-up" style={{ marginTop: "24px" }}>
            <div className="panel-header" style={{ borderLeft: `6px solid ${targetPrio.color}` }}>
              <h3 className="panel-title">
                Danh sách công việc mức ưu tiên: <span style={{ color: targetPrio.color }}>{targetPrio.label}</span>
              </h3>
              <span className="badge" style={{ backgroundColor: `${targetPrio.color}15`, color: targetPrio.color }}>
                {pTasks.length} công việc
              </span>
            </div>
            <div className="table-wrapper">
              {pTasks.length === 0 ? (
                <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                  Không có công việc nào thuộc mức độ ưu tiên này.
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: "50px" }}>STT</th>
                      <th>Nội dung công việc</th>
                      <th>Nhân sự đầu mối</th>
                      <th>Ngày giao</th>
                      <th>Deadline</th>
                      <th>Trạng thái</th>
                      <th>Tiến độ</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pTasks.map((t, index) => {
                      const isOverdue = dateUtils.isOverdue(t);
                      const statusClass = t.trangThai === "Chưa thực hiện" ? "status-chua-thuc-hien" 
                        : t.trangThai === "Đang thực hiện" ? "status-dang-thuc-hien" 
                        : t.trangThai === "Hoàn thành" ? "status-hoan-thanh" 
                        : t.trangThai === "Tạm dừng" ? "status-tam-dung" : "status-cham-tien-do";

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
                          <td>{t.nhanSuDauMoi}</td>
                          <td>{t.ngayGiao}</td>
                          <td style={{ fontWeight: isOverdue ? 700 : "normal", color: isOverdue ? "var(--status-delayed)" : "inherit" }}>
                            {t.deadline}
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
        );
      })()}
    </div>
  );
}
