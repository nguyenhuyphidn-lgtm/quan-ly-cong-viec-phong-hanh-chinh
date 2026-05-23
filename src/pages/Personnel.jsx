import React, { useState } from "react";

export default function Personnel({ staffList, onSaveStaff, onDeleteStaff }) {
  const [editingStaff, setEditingStaff] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    hoTen: "",
    mangCongViec: "",
    email: "",
    ghiChu: ""
  });
  const [errors, setErrors] = useState({});

  const handleStartAdd = () => {
    setEditingStaff(null);
    setFormData({
      hoTen: "",
      mangCongViec: "",
      email: "",
      ghiChu: ""
    });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleStartEdit = (staff) => {
    setEditingStaff(staff);
    setFormData({ ...staff });
    setErrors({});
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.hoTen.trim()) newErrors.hoTen = "Họ tên không được để trống";
    if (!formData.mangCongViec.trim()) newErrors.mangCongViec = "Mảng công việc không được để trống";
    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSaveStaff(formData);
    setIsFormOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="personnel-view animate-fade-in">
      <div className="panel">
        <div className="panel-header">
          <h3 className="panel-title">Danh sách nhân sự phòng Hành chính</h3>
          <button className="btn-primary" onClick={handleStartAdd}>
            + Thêm nhân sự
          </button>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: "60px", textAlign: "center" }}>STT</th>
                <th style={{ minWidth: "150px" }}>Họ và tên</th>
                <th style={{ minWidth: "250px" }}>Mảng công việc phụ trách</th>
                <th style={{ minWidth: "200px" }}>Email liên hệ</th>
                <th style={{ minWidth: "150px" }}>Ghi chú</th>
                <th style={{ width: "100px", textAlign: "center" }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map((s, index) => (
                <tr key={s.stt}>
                  <td style={{ fontWeight: 600, textAlign: "center" }}>{index + 1}</td>
                  <td style={{ fontWeight: 600, color: "var(--primary)" }}>{s.hoTen}</td>
                  <td>{s.mangCongViec}</td>
                  <td>
                    <span className="staff-email-badge">{s.email}</span>
                  </td>
                  <td>{s.ghiChu || "—"}</td>
                  <td style={{ textAlign: "center" }}>
                    <div className="actions-cell" style={{ justifyContent: "center" }}>
                      <button className="btn-icon edit" title="Sửa" onClick={() => handleStartEdit(s)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 20h9"/>
                          <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
                        </svg>
                      </button>
                      <button className="btn-icon delete" title="Xóa" onClick={() => onDeleteStaff(s.stt)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18"/>
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "450px" }}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingStaff ? "Chỉnh sửa nhân sự" : "Thêm nhân sự mới"}
              </h3>
              <button className="modal-close" onClick={() => setIsFormOpen(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div>
                    <label className="form-label">Họ và tên <span className="required">*</span></label>
                    <input
                      type="text"
                      name="hoTen"
                      value={formData.hoTen}
                      onChange={handleChange}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="form-control"
                    />
                    {errors.hoTen && <span style={{ color: "var(--status-delayed)", fontSize: "0.75rem" }}>{errors.hoTen}</span>}
                  </div>
                  <div>
                    <label className="form-label">Mảng công việc <span className="required">*</span></label>
                    <textarea
                      name="mangCongViec"
                      value={formData.mangCongViec}
                      onChange={handleChange}
                      placeholder="Mô tả công việc phụ trách..."
                      className="form-control"
                      style={{ height: "70px", resize: "none" }}
                    />
                    {errors.mangCongViec && <span style={{ color: "var(--status-delayed)", fontSize: "0.75rem" }}>{errors.mangCongViec}</span>}
                  </div>
                  <div>
                    <label className="form-label">Email liên hệ <span className="required">*</span></label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@sungroup.com.vn"
                      className="form-control"
                    />
                    {errors.email && <span style={{ color: "var(--status-delayed)", fontSize: "0.75rem" }}>{errors.email}</span>}
                  </div>
                  <div>
                    <label className="form-label">Ghi chú</label>
                    <input
                      type="text"
                      name="ghiChu"
                      value={formData.ghiChu}
                      onChange={handleChange}
                      placeholder="Ghi chú thêm (nếu có)"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsFormOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-primary">
                  Lưu thông tin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
