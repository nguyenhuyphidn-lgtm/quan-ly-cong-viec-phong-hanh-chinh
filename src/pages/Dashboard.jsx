import React from "react";
import { dateUtils } from "../services/dataService";

function DonutChart({ data, colors, onClickItem }) {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  
  if (total === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
        Không có dữ liệu công việc.
      </div>
    );
  }

  const radius = 25;
  const circumference = 2 * Math.PI * radius; // ~157.08
  let accumulatedCount = 0;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "24px", justifyContent: "space-between", flexWrap: "wrap", width: "100%" }}>
      {/* SVG Circle */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "140px", height: "140px", flexShrink: 0, position: "relative" }}>
        <svg width="130" height="130" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
          {data.map((item) => {
            if (item.count === 0) return null;
            
            const percentage = item.count / total;
            const strokeLength = circumference * percentage;
            const strokeGap = circumference - strokeLength;
            
            const angle = (accumulatedCount / total) * 360;
            accumulatedCount += item.count;

            return (
              <circle
                key={item.label}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={colors[item.label]}
                strokeWidth="11"
                strokeDasharray={`${strokeLength} ${strokeGap}`}
                transform={`rotate(${angle} 50 50)`}
                className="donut-segment"
                onClick={() => onClickItem && onClickItem(item.label)}
                style={{ cursor: "pointer" }}
              />
            );
          })}
          {/* Inner hole */}
          <circle cx="50" cy="50" r="18" fill="white" />
        </svg>
        {/* Central count text */}
        <div style={{ position: "absolute", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary)" }}>{total}</span>
          <span style={{ fontSize: "0.6rem", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" }}>Việc</span>
        </div>
      </div>

      {/* Legends list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "150px" }}>
        {data.map((item) => {
          const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div
              key={item.label}
              className="chart-legend-row"
              onClick={() => onClickItem && onClickItem(item.label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontSize: "0.8rem",
                padding: "4px 8px",
                borderRadius: "var(--radius-sm)",
                transition: "var(--transition-fast)"
              }}
            >
              <span style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: colors[item.label], flexShrink: 0 }}></span>
              <span style={{ flex: 1, fontWeight: 500, color: "var(--text-main)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</span>
              <span style={{ fontWeight: 700, color: "var(--primary)", width: "20px", textAlign: "right" }}>{item.count}</span>
              <span style={{ color: "var(--text-muted)", width: "35px", textAlign: "right", fontWeight: 600 }}>{percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard({ stats, onEditTask, onSelectStatusFilter, onSelectPriorityFilter, onSelectStaffFilter }) {
  const formatCurrency = (value) => {
    if (!value) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  // Get max values for charts to scale the bars correctly
  const getMaxVal = (obj) => {
    const vals = Object.values(obj);
    return vals.length > 0 ? Math.max(...vals, 1) : 1;
  };

  const statusColors = {
    "Chưa thực hiện": "var(--status-pending)",
    "Đang thực hiện": "var(--status-progress)",
    "Hoàn thành": "var(--status-completed)",
    "Tạm dừng": "var(--status-paused)",
    "Chậm tiến độ": "var(--status-delayed)"
  };

  const priorityColors = {
    "0. Khẩn cấp": "var(--prio-urgent)",
    "1. Cao": "var(--prio-high)",
    "2. Trung bình": "var(--prio-medium)",
    "3. Thấp": "var(--prio-low)"
  };

  const statusChartData = Object.entries(stats.statusCounts).map(([label, count]) => ({ label, count }));
  const priorityChartData = Object.entries(stats.priorityCounts).map(([label, count]) => ({ label, count }));

  const statusMax = getMaxVal(stats.statusCounts);
  const priorityMax = getMaxVal(stats.priorityCounts);
  
  const staffCounts = {};
  stats.staffStats.forEach(s => {
    staffCounts[s.hoTen] = s.total;
  });
  const staffMax = getMaxVal(staffCounts);

  return (
    <div className="dashboard-view animate-fade-in">
      {/* 8 Stats Cards Grid */}
      <div className="stats-grid">
        {/* Total Tasks */}
        <div className="stat-card total">
          <div className="stat-info">
            <span className="stat-label">Tổng số công việc</span>
            <span className="stat-value">{stats.totalTasks}</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
        </div>

        {/* Chưa thực hiện */}
        <div className="stat-card pending">
          <div className="stat-info">
            <span className="stat-label">Chưa thực hiện</span>
            <span className="stat-value">{stats.pendingTasks}</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" x2="12" y1="8" y2="12"/>
              <line x1="12" x2="12.01" y1="16" y2="16"/>
            </svg>
          </div>
        </div>

        {/* Đang thực hiện */}
        <div className="stat-card progress">
          <div className="stat-info">
            <span className="stat-label">Đang thực hiện</span>
            <span className="stat-value">{stats.inProgressTasks}</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
            </svg>
          </div>
        </div>

        {/* Hoàn thành */}
        <div className="stat-card completed">
          <div className="stat-info">
            <span className="stat-label">Đã hoàn thành</span>
            <span className="stat-value">{stats.completedTasks}</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
        </div>

        {/* Khẩn cấp */}
        <div className="stat-card urgent">
          <div className="stat-info">
            <span className="stat-label">Công việc khẩn cấp</span>
            <span className="stat-value">{stats.urgentTasks}</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" x2="4" y1="22" y2="15"/>
            </svg>
          </div>
        </div>

        {/* Chậm deadline */}
        <div className="stat-card delayed">
          <div className="stat-info">
            <span className="stat-label">Chậm deadline</span>
            <span className="stat-value">{stats.overdueCount}</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
        </div>

        {/* Tỷ lệ hoàn thành trung bình */}
        <div className="stat-card completion-rate">
          <div className="stat-info">
            <span className="stat-label">Tỷ lệ hoàn thành TB</span>
            <span className="stat-value">{stats.avgCompletion}%</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"/>
              <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
              <line x1="12" x2="12" y1="14" y2="20"/>
            </svg>
          </div>
        </div>

        {/* Tổng ngân sách */}
        <div className="stat-card budget">
          <div className="stat-info">
            <span className="stat-label">Tổng ngân sách dự án</span>
            <span className="stat-value" style={{ fontSize: "1.1rem" }}>{formatCurrency(stats.totalBudget)}</span>
          </div>
          <div className="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="1" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Chart 1: Status */}
        <div className="chart-card">
          <h3 className="chart-header">Số lượng công việc theo Trạng thái</h3>
          <div className="chart-container" style={{ minHeight: "180px", justifyContent: "center" }}>
            <DonutChart
              data={statusChartData}
              colors={statusColors}
              onClickItem={onSelectStatusFilter}
            />
          </div>
        </div>

        {/* Chart 2: Priority */}
        <div className="chart-card">
          <h3 className="chart-header">Số lượng công việc theo Mức ưu tiên</h3>
          <div className="chart-container" style={{ minHeight: "180px", justifyContent: "center" }}>
            <DonutChart
              data={priorityChartData}
              colors={priorityColors}
              onClickItem={onSelectPriorityFilter}
            />
          </div>
        </div>

        {/* Chart 3: Staff (Full width spanning if mobile or stacked) */}
        <div className="chart-card" style={{ gridColumn: "span 2" }}>
          <h3 className="chart-header">Công việc được giao theo Nhân sự đầu mối</h3>
          <div className="chart-container" style={{ minHeight: "280px" }}>
            {stats.staffStats.map((s) => {
              const percentage = (s.total / staffMax) * 100;
              return (
                <div key={s.stt} className="chart-row clickable" onClick={() => onSelectStaffFilter && onSelectStaffFilter(s.hoTen)}>
                  <span className="chart-label" style={{ fontWeight: 600 }}>{s.hoTen}</span>
                  <div className="chart-bar-wrapper" style={{ height: "14px" }}>
                    <div className="chart-bar generic" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="chart-value" style={{ width: "80px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    <strong>{s.total}</strong> việc ({s.avgCompletion}% xong)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Pending / Overdue Tasks table */}
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--status-delayed)" }}>
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" x2="12" y1="9" y2="13"/>
              <line x1="12" x2="12.01" y1="17" y2="17"/>
            </svg>
            <span>Công việc sắp đến hạn hoặc đã quá hạn (7 ngày tới)</span>
          </h3>
        </div>
        <div className="table-wrapper">
          {stats.upcomingTasks.length === 0 ? (
            <div style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
              Không có công việc nào sắp đến hạn hoặc quá hạn.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nội dung công việc</th>
                  <th>Nhân sự đầu mối</th>
                  <th>Hạn hoàn thành (Deadline)</th>
                  <th>Trạng thái</th>
                  <th>% Hoàn thành</th>
                  <th>Tình trạng hạn</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {stats.upcomingTasks.map((t) => {
                  const isOverdue = t.daysLeft < 0;
                  const statusClass = t.trangThai === "Chưa thực hiện" ? "status-chua-thuc-hien" 
                    : t.trangThai === "Đang thực hiện" ? "status-dang-thuc-hien" 
                    : t.trangThai === "Hoàn thành" ? "status-hoan-thanh" 
                    : t.trangThai === "Tạm dừng" ? "status-tam-dung" : "status-cham-tien-do";
                  return (
                    <tr key={t.stt} className={isOverdue ? "row-overdue" : ""}>
                      <td style={{ fontWeight: 500 }}>{t.noiDung}</td>
                      <td>{t.nhanSuDauMoi}</td>
                      <td>{t.deadline}</td>
                      <td>
                        <span className={`badge ${statusClass}`}>{t.trangThai}</span>
                      </td>
                      <td>
                        <div className="progress-bar-container">
                          <div className="progress-track">
                            <div className="progress-fill" style={{ width: `${t.phanTramHoanThanh}%`, backgroundColor: t.phanTramHoanThanh >= 80 ? "var(--status-completed)" : "var(--secondary)" }}></div>
                          </div>
                          <span className="progress-text">{t.phanTramHoanThanh}%</span>
                        </div>
                      </td>
                      <td style={{ fontWeight: 600 }}>
                        {isOverdue ? (
                          <span className="overdue-badge-inline">
                            Quá hạn {Math.abs(t.daysLeft)} ngày
                          </span>
                        ) : t.daysLeft === 0 ? (
                          <span style={{ color: "var(--prio-urgent)" }}>Hạn hôm nay!</span>
                        ) : (
                          <span style={{ color: "var(--prio-high)" }}>Còn {t.daysLeft} ngày</span>
                        )}
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
    </div>
  );
}
