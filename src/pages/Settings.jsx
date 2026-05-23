import React, { useState } from "react";
import { dataService } from "../services/dataService";

export default function Settings({ onResetData }) {
  const [resetConfirm, setResetConfirm] = useState(false);

  const statuses = [
    { name: "Chưa thực hiện", color: "#64748b", bg: "#f1f5f9", desc: "Công việc đã giao nhưng chưa bắt đầu thực hiện" },
    { name: "Đang thực hiện", color: "#2563eb", bg: "#eff6ff", desc: "Công việc đang trong quá trình triển khai xử lý" },
    { name: "Hoàn thành", color: "#16a34a", bg: "#f0fdf4", desc: "Công việc đã hoàn tất 100% nội dung được giao" },
    { name: "Tạm dừng", color: "#d97706", bg: "#fef3c7", desc: "Công việc đang bị tạm dừng do nguyên nhân khách quan" },
    { name: "Chậm tiến độ", color: "#dc2626", bg: "#fef2f2", desc: "Công việc bị trễ hạn deadline hoặc có cảnh báo chậm trễ" }
  ];

  const priorities = [
    { label: "0. Khẩn cấp", color: "#ef4444", desc: "Yêu cầu xử lý ngay lập tức, thường do Ban Giám đốc chỉ đạo trực tiếp" },
    { label: "1. Cao", color: "#f97316", desc: "Công việc quan trọng cần ưu tiên hoàn thành sớm" },
    { label: "2. Trung bình", color: "#3b82f6", desc: "Công việc nghiệp vụ bình thường theo tiến trình chuẩn" },
    { label: "3. Thấp", color: "#94a3b8", desc: "Công việc định kỳ hoặc công tác phụ hỗ trợ" }
  ];

  const handleReset = () => {
    dataService.resetData();
    onResetData(); // notify App to reload state
    setResetConfirm(false);
    alert("Hệ thống đã được khôi phục dữ liệu mẫu ban đầu thành công!");
  };

  return (
    <div className="settings-view animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      
      {/* Category 1: Statuses */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Danh mục Trạng thái Công việc</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tên trạng thái</th>
                <th>Màu sắc quy ước</th>
                <th>Mô tả nghiệp vụ</th>
              </tr>
            </thead>
            <tbody>
              {statuses.map((s) => (
                <tr key={s.name}>
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "4px 10px",
                        borderRadius: "var(--radius-full)",
                        backgroundColor: s.bg,
                        color: s.color,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        border: `1px solid ${s.color}30`
                      }}
                    >
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: s.color }}></span>
                      {s.color}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{s.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category 2: Priorities */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Danh mục Mức độ Ưu tiên</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Mức ưu tiên</th>
                <th>Màu sắc quy ước</th>
                <th>Mô tả mức độ</th>
              </tr>
            </thead>
            <tbody>
              {priorities.map((p) => (
                <tr key={p.label}>
                  <td style={{ fontWeight: 600 }}>{p.label}</td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "3px 10px",
                        borderRadius: "var(--radius-sm)",
                        backgroundColor: p.color,
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem"
                      }}
                    >
                      {p.label}
                    </span>
                  </td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Operations Panel */}
      <div className="panel" style={{ border: "1px solid rgba(220, 38, 38, 0.2)" }}>
        <div className="panel-header" style={{ backgroundColor: "rgba(254, 242, 242, 0.5)" }}>
          <h3 className="panel-title" style={{ color: "var(--status-delayed)" }}>Quản trị hệ thống</h3>
        </div>
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h4 style={{ fontSize: "0.9rem", fontWeight: 700, marginBottom: "6px" }}>Đặt lại cơ sở dữ liệu mẫu (Reset Data)</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              Hành động này sẽ xóa toàn bộ các thay đổi hiện tại (thêm mới, chỉnh sửa công việc/nhân sự) trong bộ nhớ LocalStorage 
              và đặt lại hệ thống về trạng thái ban đầu với <strong>6 công việc mẫu</strong> và <strong>10 nhân viên hành chính mẫu</strong>.
            </p>
          </div>
          
          {resetConfirm ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", backgroundColor: "#fff5f5", borderRadius: "var(--radius-sm)", border: "1px solid #fca5a5" }}>
              <span style={{ fontSize: "0.8rem", color: "#991b1b", fontWeight: 600 }}>Bạn có chắc chắn muốn xóa toàn bộ và đặt lại dữ liệu không?</span>
              <button className="btn-secondary" style={{ padding: "6px 12px", fontSize: "0.75rem" }} onClick={() => setResetConfirm(false)}>Hủy</button>
              <button className="btn-danger" style={{ padding: "6px 12px", fontSize: "0.75rem" }} onClick={handleReset}>Xác nhận Đặt lại</button>
            </div>
          ) : (
            <button className="btn-danger" style={{ alignSelf: "flex-start" }} onClick={() => setResetConfirm(true)}>
              Khôi phục dữ liệu mẫu ban đầu
            </button>
          )}
        </div>
      </div>
      
    </div>
  );
}
