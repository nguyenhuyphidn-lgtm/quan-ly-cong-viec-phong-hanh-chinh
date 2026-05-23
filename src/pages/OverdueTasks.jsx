import React, { useState } from "react";
import { dateUtils } from "../services/dataService";

export default function OverdueTasks({ tasks, onEditTask, onSaveTask }) {
  const [editingStt, setEditingStt] = useState(null);
  const [tempLyDo, setTempLyDo] = useState("");

  const today = dateUtils.getCurrentDate();

  // Filter: Overdue (deadline passed and not completed) OR status is "Chậm tiến độ"
  const overdueTasks = tasks.filter(t => {
    const isStatusDelayed = t.trangThai === "Chậm tiến độ";
    const isDeadlineOverdue = dateUtils.isOverdue(t);
    return isStatusDelayed || isDeadlineOverdue;
  });

  const getDaysDelayed = (task) => {
    const deadlineDate = dateUtils.parseDDMMYYYY(task.deadline);
    if (!deadlineDate) return 0;
    const diff = dateUtils.getDaysDifference(deadlineDate, today);
    return diff > 0 ? diff : 0;
  };

  const handleStartInlineEdit = (task) => {
    setEditingStt(task.stt);
    setTempLyDo(task.lyDoCham || "");
  };

  const handleSaveInline = (task) => {
    onSaveTask({
      ...task,
      lyDoCham: tempLyDo,
      // If they input a delay reason, let's make sure it reflects
      trangThai: task.trangThai === "Hoàn thành" ? "Hoàn thành" : "Chậm tiến độ"
    });
    setEditingStt(null);
  };

  return (
    <div className="overdue-tasks-view animate-fade-in">
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title" style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--status-delayed)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            <span>Giám sát công việc chậm tiến độ & quá hạn</span>
          </h3>
          <span className="badge status-chuyen-nhuong" style={{ fontSize: "0.85rem" }}>
            {overdueTasks.length} công việc cần giải trình
          </span>
        </div>
        
        <div className="table-wrapper">
          {overdueTasks.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
              🎉 Tuyệt vời! Không có công việc nào bị chậm tiến độ hoặc quá hạn.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "50px" }}>STT</th>
                  <th>Nội dung công việc</th>
                  <th>Nhân sự đầu mối</th>
                  <th>Deadline</th>
                  <th>Số ngày chậm</th>
                  <th>Trạng thái</th>
                  <th style={{ minWidth: "250px" }}>Lý do chậm / Đề xuất hành động tiếp theo</th>
                  <th style={{ width: "100px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {overdueTasks.map((t, index) => {
                  const daysDelayed = getDaysDelayed(t);
                  const isEditing = editingStt === t.stt;

                  return (
                    <tr key={t.stt} className="row-overdue overdue-flash">
                      <td style={{ fontWeight: 600, textAlign: "center" }}>{index + 1}</td>
                      <td style={{ fontWeight: 500 }}>{t.noiDung}</td>
                      <td>{t.nhanSuDauMoi}</td>
                      <td style={{ fontWeight: 700, color: "var(--status-delayed)" }}>{t.deadline}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "var(--status-delayed)" }}>
                        {daysDelayed > 0 ? `${daysDelayed} ngày` : "Chậm tiến độ"}
                      </td>
                      <td>
                        <span className="badge status-chuyen-nhuong">{t.trangThai}</span>
                      </td>
                      <td>
                        {isEditing ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <textarea
                              value={tempLyDo}
                              onChange={(e) => setTempLyDo(e.target.value)}
                              placeholder="Nhập lý do chậm và đề xuất hành động tiếp theo..."
                              className="form-control"
                              style={{ height: "60px", fontSize: "0.8rem" }}
                            />
                            <div style={{ display: "flex", gap: "8px", alignSelf: "flex-end" }}>
                              <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => setEditingStt(null)}>Hủy</button>
                              <button className="btn-primary" style={{ padding: "4px 8px", fontSize: "0.75rem" }} onClick={() => handleSaveInline(t)}>Lưu nhanh</button>
                            </div>
                          </div>
                        ) : (
                          <div onClick={() => handleStartInlineEdit(t)} style={{ cursor: "pointer", minHeight: "36px", padding: "6px", border: "1px dashed #fca5a5", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(254, 242, 242, 0.5)", fontSize: "0.8rem" }}>
                            {t.lyDoCham ? (
                              <span style={{ color: "#991b1b" }}>{t.lyDoCham}</span>
                            ) : (
                              <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Nhấp để cập nhật nhanh lý do chậm & đề xuất...</span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button className="btn-icon edit" title="Sửa chi tiết" onClick={() => onEditTask(t)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 20h9"/>
                              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
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
    </div>
  );
}
