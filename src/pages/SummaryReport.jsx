import React from "react";
import { dateUtils } from "../services/dataService";

export default function SummaryReport({ tasks, stats }) {
  
  // 1. EXPORT TO EXCEL/CSV WITH UTF-8 BOM
  const handleExportCSV = () => {
    let csvContent = "\uFEFF"; // UTF-8 BOM for Excel Vietnamese compatibility
    
    // Headers
    const headers = [
      "STT",
      "Nội dung công việc",
      "Nhân sự đầu mối",
      "Phối hợp thực hiện",
      "Ngày giao",
      "Hạn hoàn thành (Deadline)",
      "Mức ưu tiên",
      "Nguồn thông tin",
      "Trạng thái",
      "% Hoàn thành",
      "Ngân sách (VNĐ)",
      "Ghi chú",
      "Lý do chậm tiến độ"
    ];
    csvContent += headers.join(",") + "\n";

    // Rows
    tasks.forEach((t, index) => {
      const escapeCSV = (str) => {
        if (str === null || str === undefined) return "";
        const s = String(str);
        // Replace double quotes with double-double quotes, and wrap in double quotes if there are commas, quotes, or newlines
        if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      };

      const row = [
        index + 1,
        escapeCSV(t.noiDung),
        escapeCSV(t.nhanSuDauMoi),
        escapeCSV(t.phoiHop),
        escapeCSV(t.ngayGiao),
        escapeCSV(t.deadline),
        escapeCSV(t.uuTien),
        escapeCSV(t.nguonThongTin),
        escapeCSV(t.trangThai),
        t.phanTramHoanThanh,
        t.nganSach || 0,
        escapeCSV(t.ghiChu),
        escapeCSV(t.lyDoCham)
      ];

      csvContent += row.join(",") + "\n";
    });

    // Download trigger
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `BaoCao_CongViec_HanhChinh_${dateUtils.toDDMMYYYY(dateUtils.getCurrentDate()).replace(/\//g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPercentage = (value, total) => {
    if (!total) return "0%";
    return Math.round((value / total) * 100) + "%";
  };

  return (
    <div className="summary-report-view animate-fade-in">
      {/* Top Banner with Action */}
      <div className="header" style={{ marginBottom: "24px" }}>
        <div className="header-left">
          <h3 className="header-title" style={{ fontSize: "1.1rem" }}>Kết xuất dữ liệu báo cáo</h3>
          <p className="header-subtitle">Tải toàn bộ cơ sở dữ liệu công việc hiện tại về máy tính dưới định dạng file CSV tương thích Microsoft Excel</p>
        </div>
        <button className="btn-primary" onClick={handleExportCSV} style={{ backgroundColor: "#16a34a", boxShadow: "0 4px 10px rgba(22, 163, 74, 0.15)" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Xuất báo cáo (Excel/CSV)
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        
        {/* Table 1: Status Report */}
        <div className="panel">
          <div className="panel-header">
            <h4 className="panel-title">Báo cáo theo trạng thái xử lý</h4>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Trạng thái</th>
                  <th style={{ textAlign: "center" }}>Số lượng công việc</th>
                  <th style={{ textAlign: "center" }}>Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.statusCounts).map(([status, count]) => {
                  const statusClass = status === "Chưa thực hiện" ? "status-chua-thuc-hien" 
                    : status === "Đang thực hiện" ? "status-dang-thuc-hien" 
                    : status === "Hoàn thành" ? "status-hoan-thanh" 
                    : status === "Tạm dừng" ? "status-tam-dung" : "status-cham-tien-do";
                  return (
                    <tr key={status}>
                      <td style={{ fontWeight: 600 }}>
                        <span className={`badge ${statusClass}`}>{status}</span>
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>{count}</td>
                      <td style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: 600 }}>
                        {getPercentage(count, stats.totalTasks)}
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ backgroundColor: "#f8fafc", fontWeight: 700 }}>
                  <td>Tổng cộng</td>
                  <td style={{ textAlign: "center" }}>{stats.totalTasks}</td>
                  <td style={{ textAlign: "center" }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Priority Report */}
        <div className="panel">
          <div className="panel-header">
            <h4 className="panel-title">Báo cáo theo mức độ ưu tiên</h4>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Mức ưu tiên</th>
                  <th style={{ textAlign: "center" }}>Số lượng công việc</th>
                  <th style={{ textAlign: "center" }}>Tỷ lệ %</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(stats.priorityCounts).map(([prio, count]) => {
                  const prioClass = prio.includes("Khẩn cấp") ? "prio-urgent" 
                    : prio.includes("Cao") ? "prio-high" 
                    : prio.includes("Trung bình") ? "prio-medium" : "prio-low";
                  return (
                    <tr key={prio}>
                      <td style={{ fontWeight: 600 }}>
                        <span className={`badge ${prioClass}`}>{prio}</span>
                      </td>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>{count}</td>
                      <td style={{ textAlign: "center", color: "var(--text-muted)", fontWeight: 600 }}>
                        {getPercentage(count, stats.totalTasks)}
                      </td>
                    </tr>
                  );
                })}
                <tr style={{ backgroundColor: "#f8fafc", fontWeight: 700 }}>
                  <td>Tổng cộng</td>
                  <td style={{ textAlign: "center" }}>{stats.totalTasks}</td>
                  <td style={{ textAlign: "center" }}>100%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: Staff Report (Spans both columns) */}
        <div className="panel" style={{ gridColumn: "span 2" }}>
          <div className="panel-header">
            <h4 className="panel-title">Báo cáo thống kê hiệu suất theo Nhân sự</h4>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: "50px", textAlign: "center" }}>STT</th>
                  <th>Họ và tên</th>
                  <th style={{ textAlign: "center" }}>Tổng số việc</th>
                  <th style={{ textAlign: "center" }}>Đã hoàn thành</th>
                  <th style={{ textAlign: "center" }}>Đang thực hiện</th>
                  <th style={{ textAlign: "center" }}>Chậm tiến độ / Quá hạn</th>
                  <th style={{ textAlign: "center" }}>Tỷ lệ hoàn thành TB</th>
                  <th>Tình trạng đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {stats.staffStats.map((s, index) => {
                  const rate = s.avgCompletion;
                  let ratingText = "Chờ đánh giá";
                  let ratingColor = "var(--text-muted)";
                  
                  if (s.total > 0) {
                    if (rate >= 80) {
                      ratingText = "Xuất sắc";
                      ratingColor = "var(--status-completed)";
                    } else if (rate >= 50) {
                      ratingText = "Khá / Đạt";
                      ratingColor = "var(--status-progress)";
                    } else if (s.overdue > 0) {
                      ratingText = "Cần cải thiện (Có việc trễ)";
                      ratingColor = "var(--status-delayed)";
                    } else {
                      ratingText = "Trung bình";
                      ratingColor = "var(--status-paused)";
                    }
                  } else {
                    ratingText = "Chưa giao việc";
                  }

                  return (
                    <tr key={s.stt}>
                      <td style={{ textAlign: "center", fontWeight: 600 }}>{index + 1}</td>
                      <td style={{ fontWeight: 600 }}>{s.hoTen}</td>
                      <td style={{ textAlign: "center", fontWeight: 700 }}>{s.total}</td>
                      <td style={{ textAlign: "center", color: "var(--status-completed)", fontWeight: 600 }}>{s.completed}</td>
                      <td style={{ textAlign: "center", color: "var(--status-progress)", fontWeight: 600 }}>{s.inProgress}</td>
                      <td style={{ textAlign: "center", color: s.overdue > 0 ? "var(--status-delayed)" : "inherit", fontWeight: 600 }}>
                        {s.overdue}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                          <span style={{ fontWeight: 700, color: "var(--primary-accent)" }}>{rate}%</span>
                          <div style={{ width: "60px", height: "6px", backgroundColor: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                            <div style={{ width: `${rate}%`, height: "100%", backgroundColor: rate >= 80 ? "var(--status-completed)" : "var(--status-progress)" }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600, color: ratingColor }}>{ratingText}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
