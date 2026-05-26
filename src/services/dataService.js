import { db } from "./firebase";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc, 
  writeBatch 
} from "firebase/firestore";

// Default initial personnel data
const DEFAULT_STAFF = [
  {
    stt: 1,
    hoTen: "Đỗ Việt Phong",
    mangCongViec: "CV hành chính chung",
    email: "phongdv@sungroup.com.vn",
    ghiChu: ""
  },
  {
    stt: 2,
    hoTen: "Trần Thị Thu Phương",
    mangCongViec: "CV thư ký trợ lý",
    email: "phuongttt@sungroup.com.vn",
    ghiChu: ""
  },
  {
    stt: 3,
    hoTen: "Nguyễn Thị Cẩm Anh",
    mangCongViec: "Văn thư, pháp lý, hành chính sự kiện nội bộ, giấy tờ pháp lý",
    email: "anhntc@banahills.com.vn",
    ghiChu: ""
  },
  {
    stt: 4,
    hoTen: "Phạm Thị Vân",
    mangCongViec: "Dữ liệu công, cơm ca, công tác tâm linh",
    email: "baocombana@banahills.com.vn",
    ghiChu: ""
  },
  {
    stt: 5,
    hoTen: "Nguyễn Thị Minh Diệu",
    mangCongViec: "Đồng phục",
    email: "dieuntm@banahills.com.vn",
    ghiChu: ""
  },
  {
    stt: 6,
    hoTen: "Phạm Minh Vương",
    mangCongViec: "Bếp căng tin",
    email: "vuongpm@banahills.com.vn",
    ghiChu: ""
  },
  {
    stt: 7,
    hoTen: "Đỗ Hữu Trường",
    mangCongViec: "BQL nhà nhân viên",
    email: "truongdh01@banahills.com.vn",
    ghiChu: ""
  },
  {
    stt: 8,
    hoTen: "Nguyễn Thị Thúy Tươi",
    mangCongViec: "Face ID, giấy lên cáp",
    email: "capthe@banahills.com.vn",
    ghiChu: ""
  },
  {
    stt: 9,
    hoTen: "Phạm Nguyễn Vân Oanh",
    mangCongViec: "Đầu mối thông tin hành chính đội xe",
    email: "tv.oanhpnv@banahills.com.vn",
    ghiChu: ""
  },
  {
    stt: 10,
    hoTen: "Lê Thị Lệ Hằng",
    mangCongViec: "Liên quan đội xe",
    email: "hangltl01@banahills.com.vn",
    ghiChu: ""
  }
];

// Default initial task data
const DEFAULT_TASKS = [
  {
    stt: 1,
    noiDung: "Cải tạo chất lượng sóng Wifi tại Sunhome Bà Nà",
    nhanSuDauMoi: "Đỗ Hữu Trường",
    phoiHop: "Anh Vinh IT",
    ngayGiao: "17/05/2026",
    deadline: "30/05/2026",
    uuTien: "0. Khẩn cấp",
    nguonThongTin: "Chỉ đạo TQL",
    trangThai: "Chưa thực hiện",
    phanTramHoanThanh: 50,
    nganSach: 0,
    ghiChu: "11",
    lyDoCham: ""
  },
  {
    stt: 2,
    noiDung: "Chuẩn bị Lễ Phật Đản",
    nhanSuDauMoi: "Phạm Thị Vân",
    phoiHop: "Bảo trì XD",
    ngayGiao: "23/05/2026",
    deadline: "30/05/2026",
    uuTien: "1. Cao",
    nguonThongTin: "TBP triển khai",
    trangThai: "Đang thực hiện",
    phanTramHoanThanh: 10,
    nganSach: 0,
    ghiChu: "Mời thầy (6-8 thầy)",
    lyDoCham: ""
  },
  {
    stt: 3,
    noiDung: "Mua xe 7 chỗ Toyota Fortuner Legender 2.7AT 4x2 màu đen",
    nhanSuDauMoi: "Phạm Nguyễn Vân Oanh",
    phoiHop: "Cung ứng Tập đoàn",
    ngayGiao: "15/05/2026",
    deadline: "15/06/2026",
    uuTien: "2. Trung bình",
    nguonThongTin: "BP. An toàn",
    trangThai: "Hoàn thành",
    phanTramHoanThanh: 100,
    nganSach: 1200000000,
    ghiChu: "",
    lyDoCham: ""
  },
  {
    stt: 4,
    noiDung: "Mua sắm các thiết bị bếp căng tin",
    nhanSuDauMoi: "Phạm Minh Vương",
    phoiHop: "BP cung ứng",
    ngayGiao: "10/05/2026",
    deadline: "15/06/2026",
    uuTien: "2. Trung bình",
    nguonThongTin: "TBP triển khai",
    trangThai: "Đang thực hiện",
    phanTramHoanThanh: 5,
    nganSach: 45000000,
    ghiChu: "",
    lyDoCham: ""
  },
  {
    stt: 5,
    noiDung: "Thực hiện đơn hàng đồng phục Lễ hội beer",
    nhanSuDauMoi: "Nguyễn Thị Minh Diệu",
    phoiHop: "BP cung ứng",
    ngayGiao: "10/05/2026",
    deadline: "15/06/2026",
    uuTien: "1. Cao",
    nguonThongTin: "Ban Ẩm thực",
    trangThai: "Đang thực hiện",
    phanTramHoanThanh: 10,
    nganSach: 150000000,
    ghiChu: "",
    lyDoCham: ""
  },
  {
    stt: 6,
    noiDung: "Giấy phép VSATTP Xưởng bánh mỳ Eric Kayser",
    nhanSuDauMoi: "Nguyễn Thị Cẩm Anh",
    phoiHop: "Ban Ẩm thực",
    ngayGiao: "21/05/2026",
    deadline: "30/05/2026",
    uuTien: "0. Khẩn cấp",
    nguonThongTin: "Ban Ẩm thực",
    trangThai: "Đang thực hiện",
    phanTramHoanThanh: 10,
    nganSach: 0,
    ghiChu: "",
    lyDoCham: ""
  }
];

// Date utilities
export const dateUtils = {
  // Parse DD/MM/YYYY into a Date object
  parseDDMMYYYY(dateStr) {
    if (!dateStr || typeof dateStr !== "string") return null;
    const parts = dateStr.split("/");
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  },

  // Convert Date object to DD/MM/YYYY string
  toDDMMYYYY(date) {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  },

  // Convert YYYY-MM-DD string to DD/MM/YYYY string
  isoToDDMMYYYY(isoStr) {
    if (!isoStr) return "";
    const parts = isoStr.split("-");
    if (parts.length !== 3) return isoStr;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  },

  // Convert DD/MM/YYYY string to YYYY-MM-DD string
  ddmmyyyyToISO(dateStr) {
    if (!dateStr) return "";
    const parts = dateStr.split("/");
    if (parts.length !== 3) return "";
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  },

  // Get current date representation for comparison
  getCurrentDate() {
    const d = new Date();
    if (d.getFullYear() < 2026) {
      return new Date(2026, 4, 23); // 23 May 2026
    }
    return d;
  },

  // Calculate days between two dates (date2 - date1)
  getDaysDifference(date1, date2) {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diffTime = d2.getTime() - d1.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  },

  // Check if task is overdue
  isOverdue(task) {
    if (task.trangThai === "Hoàn thành") return false;
    const deadlineDate = this.parseDDMMYYYY(task.deadline);
    if (!deadlineDate) return false;
    const today = this.getCurrentDate();
    return this.getDaysDifference(deadlineDate, today) > 0;
  }
};

// Data service main object
export const dataService = {
  // INITIALIZATION (Not strictly needed anymore, handled lazily, but kept for compatibility)
  async init() {
    // Lazily initialized in getTasks and getStaff
  },

  // SEEDERS
  async seedDefaultTasks() {
    try {
      const batch = writeBatch(db);
      DEFAULT_TASKS.forEach((t) => {
        const docRef = doc(db, "phc_tasks", String(t.stt));
        batch.set(docRef, t);
      });
      await batch.commit();
      console.log("Firestore phc_tasks seeded successfully.");
    } catch (e) {
      console.error("Error seeding default tasks", e);
    }
  },

  async seedDefaultStaff() {
    try {
      const batch = writeBatch(db);
      DEFAULT_STAFF.forEach((s) => {
        const docRef = doc(db, "phc_staff", String(s.stt));
        batch.set(docRef, s);
      });
      await batch.commit();
      console.log("Firestore phc_staff seeded successfully.");
    } catch (e) {
      console.error("Error seeding default staff", e);
    }
  },

  // TASKS API
  async getTasks() {
    try {
      const querySnapshot = await getDocs(collection(db, "phc_tasks"));
      const tasks = [];
      querySnapshot.forEach((docSnap) => {
        tasks.push(docSnap.data());
      });
      if (tasks.length === 0) {
        console.log("Firestore phc_tasks is empty. Seeding defaults...");
        await this.seedDefaultTasks();
        return DEFAULT_TASKS;
      }
      return tasks.sort((a, b) => a.stt - b.stt);
    } catch (e) {
      console.error("Error reading tasks from Firestore", e);
      return [];
    }
  },

  async saveTask(task) {
    if (task.trangThai === "Hoàn thành") {
      task.phanTramHoanThanh = 100;
    }

    let taskDoc;
    if (task.stt) {
      taskDoc = { ...task };
    } else {
      const tasks = await this.getTasks();
      const nextStt = tasks.length > 0 ? Math.max(...tasks.map(t => t.stt)) + 1 : 1;
      taskDoc = {
        ...task,
        stt: nextStt,
        phanTramHoanThanh: task.trangThai === "Hoàn thành" ? 100 : (Number(task.phanTramHoanThanh) || 0),
        nganSach: Number(task.nganSach) || 0
      };
    }
    
    try {
      const docRef = doc(db, "phc_tasks", String(taskDoc.stt));
      await setDoc(docRef, taskDoc);
      return taskDoc;
    } catch (e) {
      console.error("Error saving task to Firestore", e);
      throw e;
    }
  },

  async deleteTask(stt) {
    try {
      const docRef = doc(db, "phc_tasks", String(stt));
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Error deleting task from Firestore", e);
      throw e;
    }
  },

  // STAFF API
  async getStaff() {
    try {
      const querySnapshot = await getDocs(collection(db, "phc_staff"));
      const staff = [];
      querySnapshot.forEach((docSnap) => {
        staff.push(docSnap.data());
      });
      if (staff.length === 0) {
        console.log("Firestore phc_staff is empty. Seeding defaults...");
        await this.seedDefaultStaff();
        return DEFAULT_STAFF;
      }
      return staff.sort((a, b) => a.stt - b.stt);
    } catch (e) {
      console.error("Error reading staff from Firestore", e);
      return [];
    }
  },

  async saveStaff(staffMember) {
    let staffDoc;
    if (staffMember.stt) {
      staffDoc = { ...staffMember };
    } else {
      const staff = await this.getStaff();
      const nextStt = staff.length > 0 ? Math.max(...staff.map(s => s.stt)) + 1 : 1;
      staffDoc = {
        ...staffMember,
        stt: nextStt
      };
    }
    
    try {
      const docRef = doc(db, "phc_staff", String(staffDoc.stt));
      await setDoc(docRef, staffDoc);
      return staffDoc;
    } catch (e) {
      console.error("Error saving staff to Firestore", e);
      throw e;
    }
  },

  async deleteStaff(stt) {
    try {
      const docRef = doc(db, "phc_staff", String(stt));
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Error deleting staff from Firestore", e);
      throw e;
    }
  },

  // STATS & COMPUTATIONS
  getStats(tasks = [], staff = []) {
    const today = dateUtils.getCurrentDate();

    // 1. Core counters
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.trangThai === "Chưa thực hiện").length;
    const inProgressTasks = tasks.filter(t => t.trangThai === "Đang thực hiện").length;
    const completedTasks = tasks.filter(t => t.trangThai === "Hoàn thành").length;
    const pausedTasks = tasks.filter(t => t.trangThai === "Tạm dừng").length;
    const delayedTasksStatus = tasks.filter(t => t.trangThai === "Chậm tiến độ").length;

    // 2. Urgent
    const urgentTasks = tasks.filter(t => t.uuTien.startsWith("0") || t.uuTien.includes("Khẩn cấp")).length;

    // 3. Overdue
    const overdueTasksList = tasks.filter(t => dateUtils.isOverdue(t));
    const overdueCount = overdueTasksList.length;

    // 4. Average Completion Rate
    const totalCompletion = tasks.reduce((sum, t) => sum + (Number(t.phanTramHoanThanh) || 0), 0);
    const avgCompletion = totalTasks > 0 ? Math.round(totalCompletion / totalTasks) : 0;

    // 5. Total Budget
    const totalBudget = tasks.reduce((sum, t) => sum + (Number(t.nganSach) || 0), 0);

    // 6. Tasks by status
    const statusCounts = {
      "Chưa thực hiện": pendingTasks,
      "Đang thực hiện": inProgressTasks,
      "Hoàn thành": completedTasks,
      "Tạm dừng": pausedTasks,
      "Chậm tiến độ": delayedTasksStatus
    };

    // 7. Tasks by priority
    const priorityCounts = {
      "0. Khẩn cấp": 0,
      "1. Cao": 0,
      "2. Trung bình": 0,
      "3. Thấp": 0
    };
    tasks.forEach(t => {
      let uutien = t.uuTien;
      if (uutien.includes("Khẩn cấp") || uutien.startsWith("0")) priorityCounts["0. Khẩn cấp"]++;
      else if (uutien.includes("Cao") || uutien.startsWith("1")) priorityCounts["1. Cao"]++;
      else if (uutien.includes("Trung bình") || uutien.startsWith("2")) priorityCounts["2. Trung bình"]++;
      else if (uutien.includes("Thấp") || uutien.startsWith("3")) priorityCounts["3. Thấp"]++;
    });

    // 8. Tasks by staff
    const staffStats = staff.map(s => {
      const staffTasks = tasks.filter(t => {
        if (!t.nhanSuDauMoi) return false;
        const lead = t.nhanSuDauMoi.toLowerCase();
        const fullName = s.hoTen.toLowerCase();
        const lastName = s.hoTen.split(" ").pop().toLowerCase();
        return lead === fullName || lead === lastName;
      });

      const total = staffTasks.length;
      const completed = staffTasks.filter(t => t.trangThai === "Hoàn thành").length;
      const inProgress = staffTasks.filter(t => t.trangThai === "Đang thực hiện").length;
      const overdue = staffTasks.filter(t => dateUtils.isOverdue(t) || t.trangThai === "Chậm tiến độ").length;
      const staffCompletion = staffTasks.reduce((sum, t) => sum + (Number(t.phanTramHoanThanh) || 0), 0);
      const avg = total > 0 ? Math.round(staffCompletion / total) : 0;

      return {
        stt: s.stt,
        hoTen: s.hoTen,
        mangCongViec: s.mangCongViec,
        email: s.email,
        total,
        completed,
        inProgress,
        overdue,
        avgCompletion: avg
      };
    });

    // 9. Top upcoming or overdue tasks
    const upcomingTasks = tasks
      .filter(t => {
        if (t.trangThai === "Hoàn thành") return false;
        const deadlineDate = dateUtils.parseDDMMYYYY(t.deadline);
        if (!deadlineDate) return false;
        const diff = dateUtils.getDaysDifference(today, deadlineDate);
        return diff <= 7;
      })
      .map(t => {
        const deadlineDate = dateUtils.parseDDMMYYYY(t.deadline);
        const diff = dateUtils.getDaysDifference(today, deadlineDate);
        return {
          ...t,
          daysLeft: diff
        };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);

    return {
      totalTasks,
      pendingTasks,
      inProgressTasks,
      completedTasks,
      pausedTasks,
      delayedTasksStatus,
      urgentTasks,
      overdueCount,
      avgCompletion,
      totalBudget,
      statusCounts,
      priorityCounts,
      staffStats,
      upcomingTasks
    };
  },

  // Reset to default
  async resetData() {
    try {
      const tasksSnap = await getDocs(collection(db, "phc_tasks"));
      const taskBatch = writeBatch(db);
      tasksSnap.forEach((docSnap) => {
        taskBatch.delete(docSnap.ref);
      });
      await taskBatch.commit();

      const staffSnap = await getDocs(collection(db, "phc_staff"));
      const staffBatch = writeBatch(db);
      staffSnap.forEach((docSnap) => {
        staffBatch.delete(docSnap.ref);
      });
      await staffBatch.commit();

      await this.seedDefaultTasks();
      await this.seedDefaultStaff();
    } catch (e) {
      console.error("Error resetting Firestore database", e);
      throw e;
    }
  }
};
