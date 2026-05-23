import React, { useState, useEffect } from "react";
import { dateUtils } from "../services/dataService";

export default function TaskForm({ isOpen, task, staffList, onSave, onCancel, onDelete }) {
  const [formData, setFormData] = useState({
    noiDung: "",
    nhanSuDauMoi: "",
    phoiHop: "",
    ngayGiao: "",
    deadline: "",
    uuTien: "2. Trung bình",
    nguonThongTin: "",
    trangThai: "Chưa thực hiện",
    phanTramHoanThanh: 0,
    nganSach: "",
    ghiChu: "",
    lyDoCham: ""
  });

  const [errors, setErrors] = useState({});
  const [isOverdueWarning, setIsOverdueWarning] = useState(false);

  // Initialize form with task data (if editing) or empty fields (if adding)
  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        ngayGiao: dateUtils.ddmmyyyyToISO(task.ngayGiao),
        deadline: dateUtils.ddmmyyyyToISO(task.deadline),
        nganSach: task.nganSach || "",
        lyDoCham: task.lyDoCham || ""
      });
    } else {
      // Default dates for new task
      const today = dateUtils.getCurrentDate();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const pad = (n) => String(n).padStart(2, "0");
      const todayISO = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      const nextWeekISO = `${nextWeek.getFullYear()}-${pad(nextWeek.getMonth() + 1)}-${pad(nextWeek.getDate())}`;

      setFormData({
        noiDung: "",
        nhanSuDauMoi: staffList.length > 0 ? staffList[0].hoTen : "",
        phoiHop: "",
        ngayGiao: todayISO,
        deadline: nextWeekISO,
        uuTien: "2. Trung bình",
        nguonThongTin: "",
        trangThai: "Chưa thực hiện",
        phanTramHoanThanh: 0,
        nganSach: "",
        ghiChu: "",
        lyDoCham: ""
      });
    }
    setErrors({});
  }, [task, isOpen, staffList]);

  // Handle status changing logic: auto 100% completed
  const handleStatusChange = (status) => {
    setFormData(prev => {
      const updated = { ...prev, trangThai: status };
      if (status === "Hoàn thành") {
        updated.phanTramHoanThanh = 100;
      } else if (status === "Chưa thực hiện") {
        updated.phanTramHoanThanh = 0;
      }
      return updated;
    });
  };

  // Check deadline warning in real time
  useEffect(() => {
    if (!formData.deadline || formData.trangThai === "Hoàn thành") {
      setIsOverdueWarning(false);
      return;
    }

    const today = dateUtils.getCurrentDate();
    const parts = formData.deadline.split("-");
    if (parts.length === 3) {
      const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
      // Compare ignoring hours
      deadlineDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        setIsOverdueWarning(true);
      } else {
        setIsOverdueWarning(false);
      }
    }
  }, [formData.deadline, formData.trangThai]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePercentChange = (e) => {
    let val = parseInt(e.target.value, 10);
    if (isNaN(val)) val = 0;
    if (val < 0) val = 0;
    if (val > 100) val = 100;

    setFormData(prev => {
      const updated = { ...prev, phanTramHoanThanh: val };
      // Sync status
      if (val === 100 && prev.trangThai !== "Hoàn thành") {
        updated.trangThai = "Hoàn thành";
      } else if (val < 100 && prev.trangThai === "Hoàn thành") {
        updated.trangThai = "Đang thực hiện";
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.noiDung.trim()) newErrors.noiDung = "Nội dung công việc không được để trống";
    if (!formData.nhanSuDauMoi) newErrors.nhanSuDauMoi = "Vui lòng chọn nhân sự đầu mối";
    if (!formData.ngayGiao) newErrors.ngayGiao = "Ngày giao không được để trống";
    if (!formData.deadline) newErrors.deadline = "Hạn hoàn thành không được để trống";
    if (!formData.trangThai) newErrors.trangThai = "Vui lòng chọn trạng thái";

    // Date logical validation
    if (formData.ngayGiao && formData.deadline) {
      const start = new Date(formData.ngayGiao);
      const end = new Date(formData.deadline);
      if (end < start) {
        newErrors.deadline = "Hạn hoàn thành không thể trước ngày giao";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare save data (convert ISO dates back to DD/MM/YYYY)
    const dataToSave = {
      ...formData,
      ngayGiao: dateUtils.isoToDDMMYYYY(formData.ngayGiao),
      deadline: dateUtils.isoToDDMMYYYY(formData.deadline),
      nganSach: formData.nganSach ? Number(formData.nganSach) : 0,
      phanTramHoanThanh: Number(formData.phanTramHoanThanh) || 0
    };

    onSave(dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h3 className="modal-title">
            {task ? "Chỉnh Sửa Công Việc" : "Thêm Công Việc Mới"}
          </h3>
          <button className="modal-close" onClick={onCancel}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Warning Message */}
            {isOverdueWarning && (
              <div className="form-alert">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" x2="12" y1="9" y2="13" />
                  <line x1="12" x2="12.01" y1="17" y2="17" />
                </svg>
                <span><strong>Cảnh báo:</strong> Công việc này đã quá hạn hoàn thành so với ngày hiện tại nhưng chưa đạt trạng thái "Hoàn thành"!</span>
              </div>
            )}

            <div className="form-grid">
              {/* Nội dung công việc */}
              <div className="form-grid-full">
                <label className="form-label">
                  Nội dung công việc <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="noiDung"
                  value={formData.noiDung}
                  onChange={handleChange}
                  placeholder="Nhập nội dung công việc được giao..."
                  className={`form-control ${errors.noiDung ? "error-border" : ""}`}
                />
                {errors.noiDung && <span style={{ color: "var(--status-delayed)", fontSize: "0.75rem" }}>{errors.noiDung}</span>}
              </div>

              {/* Nhân sự đầu mối */}
              <div>
                <label className="form-label">
                  Nhân sự đầu mối <span className="required">*</span>
                </label>
                <select
                  name="nhanSuDauMoi"
                  value={formData.nhanSuDauMoi}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="">-- Chọn nhân sự --</option>
                  {staffList.map(s => (
                    <option key={s.stt} value={s.hoTen}>
                      {s.hoTen} - {s.mangCongViec.substring(0, 30)}...
                    </option>
                  ))}
                </select>
                {errors.nhanSuDauMoi && <span style={{ color: "var(--status-delayed)", fontSize: "0.75rem" }}>{errors.nhanSuDauMoi}</span>}
              </div>

              {/* Phối hợp */}
              <div>
                <label className="form-label">Bộ phận / cá nhân phối hợp</label>
                <input
                  type="text"
                  name="phoiHop"
                  value={formData.phoiHop}
                  onChange={handleChange}
                  placeholder="Ví dụ: Anh Vinh IT, BP cung ứng..."
                  className="form-control"
                />
              </div>

              {/* Ngày giao */}
              <div>
                <label className="form-label">
                  Ngày giao <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="ngayGiao"
                  value={formData.ngayGiao}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.ngayGiao && <span style={{ color: "var(--status-delayed)", fontSize: "0.75rem" }}>{errors.ngayGiao}</span>}
              </div>

              {/* Deadline */}
              <div>
                <label className="form-label">
                  Hạn hoàn thành (Deadline) <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="form-control"
                />
                {errors.deadline && <span style={{ color: "var(--status-delayed)", fontSize: "0.75rem" }}>{errors.deadline}</span>}
              </div>

              {/* Mức ưu tiên */}
              <div>
                <label className="form-label">
                  Mức ưu tiên <span className="required">*</span>
                </label>
                <select
                  name="uuTien"
                  value={formData.uuTien}
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="0. Khẩn cấp">0. Khẩn cấp</option>
                  <option value="1. Cao">1. Cao</option>
                  <option value="2. Trung bình">2. Trung bình</option>
                  <option value="3. Thấp">3. Thấp</option>
                </select>
              </div>

              {/* Trạng thái */}
              <div>
                <label className="form-label">
                  Trạng thái <span className="required">*</span>
                </label>
                <select
                  name="trangThai"
                  value={formData.trangThai}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="form-control"
                >
                  <option value="Chưa thực hiện">Chưa thực hiện</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                  <option value="Chậm tiến độ">Chậm tiến độ</option>
                </select>
              </div>

              {/* % Hoàn thành */}
              <div>
                <label className="form-label">% Hoàn thành (0 - 100)</label>
                <input
                  type="number"
                  name="phanTramHoanThanh"
                  value={formData.phanTramHoanThanh}
                  onChange={handlePercentChange}
                  min="0"
                  max="100"
                  className="form-control"
                />
              </div>

              {/* Ngân sách */}
              <div>
                <label className="form-label">Ngân sách (VNĐ)</label>
                <input
                  type="number"
                  name="nganSach"
                  value={formData.nganSach}
                  onChange={handleChange}
                  placeholder="Nhập số tiền..."
                  className="form-control"
                />
              </div>

              {/* Nguồn thông tin */}
              <div className="form-grid-full">
                <label className="form-label">Nguồn thông tin / Chỉ đạo</label>
                <input
                  type="text"
                  name="nguonThongTin"
                  value={formData.nguonThongTin}
                  onChange={handleChange}
                  placeholder="Ví dụ: Chỉ đạo TQL, TBP triển khai, Ban Ẩm thực..."
                  className="form-control"
                />
              </div>

              {/* Ghi chú */}
              <div className="form-grid-full">
                <label className="form-label">Ghi chú</label>
                <textarea
                  name="ghiChu"
                  value={formData.ghiChu}
                  onChange={handleChange}
                  placeholder="Nhập các ghi chú thêm..."
                  className="form-control"
                  style={{ height: "60px", resize: "vertical" }}
                />
              </div>

              {/* Lý do chậm / Đề xuất hành động */}
              {(formData.trangThai === "Chậm tiến độ" || isOverdueWarning) && (
                <div className="form-grid-full" style={{ padding: "12px", border: "1px dashed var(--status-delayed-border)", borderRadius: "var(--radius-sm)", backgroundColor: "#fffafb" }}>
                  <label className="form-label" style={{ color: "var(--status-delayed)" }}>
                    Lý do chậm tiến độ & Đề xuất hành động tiếp theo
                  </label>
                  <textarea
                    name="lyDoCham"
                    value={formData.lyDoCham}
                    onChange={handleChange}
                    placeholder="Ghi nhận lý do chậm và phương hướng giải quyết..."
                    className="form-control"
                    style={{ height: "60px", resize: "vertical", borderColor: "var(--status-delayed-border)" }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            {task && onDelete && (
              <button
                type="button"
                className="btn-danger"
                style={{ marginRight: "auto" }}
                onClick={() => onDelete(task.stt)}
              >
                Xóa công việc
              </button>
            )}
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="btn-primary">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
