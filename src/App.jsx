import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ConfirmModal from "./components/ConfirmModal";
import TaskForm from "./components/TaskForm";

// Pages
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TaskByStaff from "./pages/TaskByStaff";
import TaskByPriority from "./pages/TaskByPriority";
import OverdueTasks from "./pages/OverdueTasks";
import Personnel from "./pages/Personnel";
import SummaryReport from "./pages/SummaryReport";
import Settings from "./pages/Settings";

// Services
import { dataService } from "./services/dataService";
import { db } from "./services/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function App() {
  // Initialization & Core States
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    pausedTasks: 0,
    delayedTasksStatus: 0,
    urgentTasks: 0,
    overdueCount: 0,
    avgCompletion: 0,
    totalBudget: 0,
    statusCounts: {},
    priorityCounts: {},
    staffStats: [],
    upcomingTasks: []
  });

  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals state
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Confirm delete states
  const [deletingTaskStt, setDeletingTaskStt] = useState(null);
  const [deletingStaffStt, setDeletingStaffStt] = useState(null);

  // Lọc nâng cao cho trang danh sách công việc
  const [taskFilters, setTaskFilters] = useState({
    searchTerm: "",
    filterStaff: "",
    filterStatus: "",
    filterPriority: "",
    filterDeadline: "all"
  });

  // Nhân viên được chọn để hiển thị chi tiết bên trang Công việc theo nhân sự
  const [selectedStaff, setSelectedStaff] = useState(null);

  // Authentication States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("isLoggedIn") === "true";
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("PhongHC2023@gmail.com");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError("");

    if (loginEmail.trim() === "PhongHC2023@gmail.com" && loginPassword === "Phonghanhchinh23") {
      setIsLoggingIn(true);
      setTimeout(() => {
        setIsLoggedIn(true);
        setIsLoggingIn(false);
        sessionStorage.setItem("isLoggedIn", "true");
        setLoginPassword("");
      }, 800);
    } else {
      setLoginError("Email hoặc mật khẩu không chính xác.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      sessionStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      setSidebarOpen(false);
    }
  };

  // Initialize and load data on component mount (with real-time sync)
  useEffect(() => {
    // Set initial page from URL hash on load
    const hash = window.location.hash.replace("#", "");
    const validPages = ["dashboard", "tasks", "byStaff", "byPriority", "overdue", "staff", "reports", "settings"];
    if (validPages.includes(hash)) {
      setCurrentPage(hash);
    } else {
      window.location.hash = "dashboard";
    }

    // Listen to browser Back/Forward events (e.g. hash changes)
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace("#", "");
      if (validPages.includes(currentHash)) {
        setCurrentPage(currentHash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    // Setup realtime listeners for Tasks and Staff
    let tasksLoaded = false;
    let staffLoaded = false;

    const checkLoadingState = (tLoaded, sLoaded) => {
      if (tLoaded && sLoaded) {
        setIsLoading(false);
      }
    };

    const unsubscribeTasks = onSnapshot(collection(db, "phc_tasks"), (snapshot) => {
      const loadedTasks = [];
      snapshot.forEach((docSnap) => {
        loadedTasks.push(docSnap.data());
      });
      loadedTasks.sort((a, b) => a.stt - b.stt);
      setTasks(loadedTasks);
      tasksLoaded = true;

      if (loadedTasks.length === 0) {
        // Trigger seeding
        dataService.getTasks();
      }

      setStaffList(prevStaff => {
        const calculatedStats = dataService.getStats(loadedTasks, prevStaff);
        setStats(calculatedStats);
        return prevStaff;
      });

      checkLoadingState(tasksLoaded, staffLoaded);
    }, (error) => {
      console.error("Tasks subscription error:", error);
      setIsLoading(false);
    });

    const unsubscribeStaff = onSnapshot(collection(db, "phc_staff"), (snapshot) => {
      const loadedStaff = [];
      snapshot.forEach((docSnap) => {
        loadedStaff.push(docSnap.data());
      });
      loadedStaff.sort((a, b) => a.stt - b.stt);
      setStaffList(loadedStaff);
      staffLoaded = true;

      if (loadedStaff.length === 0) {
        // Trigger seeding
        dataService.getStaff();
      }

      setTasks(prevTasks => {
        const calculatedStats = dataService.getStats(prevTasks, loadedStaff);
        setStats(calculatedStats);
        return prevTasks;
      });

      checkLoadingState(tasksLoaded, staffLoaded);
    }, (error) => {
      console.error("Staff subscription error:", error);
      setIsLoading(false);
    });

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      unsubscribeTasks();
      unsubscribeStaff();
    };
  }, []);

  // Sync state changes to browser hash (for native back button history)
  useEffect(() => {
    if (window.location.hash.replace("#", "") !== currentPage) {
      window.location.hash = currentPage;
    }
  }, [currentPage]);

  // Global Actions for Tasks
  const handleAddTaskClick = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      await dataService.saveTask(taskData);
      setIsTaskFormOpen(false);
      setEditingTask(null);
    } catch (e) {
      alert("Lỗi khi lưu công việc: " + e.message);
    }
  };

  const handleDeleteTaskClick = (stt) => {
    setDeletingTaskStt(stt);
  };

  const handleConfirmDeleteTask = async () => {
    if (deletingTaskStt) {
      try {
        await dataService.deleteTask(deletingTaskStt);
        setDeletingTaskStt(null);
        // Close form modal too if it was open
        setIsTaskFormOpen(false);
      } catch (e) {
        alert("Lỗi khi xóa công việc: " + e.message);
      }
    }
  };

  const handleDeleteFromForm = (stt) => {
    setDeletingTaskStt(stt);
  };

  // Actions for Staff
  const handleSaveStaff = async (staffData) => {
    try {
      await dataService.saveStaff(staffData);
    } catch (e) {
      alert("Lỗi khi lưu nhân viên: " + e.message);
    }
  };

  const handleDeleteStaffClick = (stt) => {
    // Check if staff has tasks assigned
    const staff = staffList.find(s => s.stt === stt);
    if (!staff) return;
    
    const staffTasks = tasks.filter(t => {
      if (!t.nhanSuDauMoi) return false;
      const lead = t.nhanSuDauMoi.toLowerCase();
      const name = staff.hoTen.toLowerCase();
      const lastName = staff.hoTen.split(" ").pop().toLowerCase();
      return lead === name || lead === lastName;
    });

    if (staffTasks.length > 0) {
      alert(`Không thể xóa nhân sự này vì ${staff.hoTen} đang đầu mối phụ trách ${staffTasks.length} công việc. Vui lòng bàn giao công việc trước khi xóa.`);
      return;
    }

    setDeletingStaffStt(stt);
  };

  const handleConfirmDeleteStaff = async () => {
    if (deletingStaffStt) {
      try {
        await dataService.deleteStaff(deletingStaffStt);
        setDeletingStaffStt(null);
      } catch (e) {
        alert("Lỗi khi xóa nhân viên: " + e.message);
      }
    }
  };

  // Reload everything when system is reset to default
  const handleSystemReset = () => {
    setCurrentPage("dashboard");
  };

  // Điều hướng lọc từ Dashboard
  const handleSelectStatusFilter = (status) => {
    setTaskFilters({
      searchTerm: "",
      filterStaff: "",
      filterStatus: status,
      filterPriority: "",
      filterDeadline: "all"
    });
    setCurrentPage("tasks");
  };

  const handleSelectPriorityFilter = (priority) => {
    setTaskFilters({
      searchTerm: "",
      filterStaff: "",
      filterStatus: "",
      filterPriority: priority,
      filterDeadline: "all"
    });
    setCurrentPage("tasks");
  };

  const handleSelectStaffFilter = (staffName) => {
    const staff = staffList.find(s => s.hoTen.toLowerCase() === staffName.toLowerCase());
    setSelectedStaff(staff || null);
    setCurrentPage("byStaff");
  };

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            stats={stats}
            onEditTask={handleEditTaskClick}
            onSelectStatusFilter={handleSelectStatusFilter}
            onSelectPriorityFilter={handleSelectPriorityFilter}
            onSelectStaffFilter={handleSelectStaffFilter}
          />
        );
      case "tasks":
        return (
          <TaskList
            tasks={tasks}
            staffList={staffList}
            onEditTask={handleEditTaskClick}
            onDeleteTask={handleDeleteTaskClick}
            onAddTask={handleAddTaskClick}
            filters={taskFilters}
            setFilters={setTaskFilters}
          />
        );
      case "byStaff":
        return (
          <TaskByStaff
            tasks={tasks}
            staffList={staffList}
            stats={stats}
            onEditTask={handleEditTaskClick}
            selectedStaff={selectedStaff}
            setSelectedStaff={setSelectedStaff}
          />
        );
      case "byPriority":
        return <TaskByPriority tasks={tasks} onEditTask={handleEditTaskClick} />;
      case "overdue":
        return (
          <OverdueTasks
            tasks={tasks}
            onEditTask={handleEditTaskClick}
            onSaveTask={handleSaveTask}
          />
        );
      case "staff":
        return (
          <Personnel
            staffList={staffList}
            onSaveStaff={handleSaveStaff}
            onDeleteStaff={handleDeleteStaffClick}
          />
        );
      case "reports":
        return <SummaryReport tasks={tasks} stats={stats} />;
      case "settings":
        return <Settings onResetData={handleSystemReset} />;
      default:
        return <Dashboard stats={stats} onEditTask={handleEditTaskClick} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <div className="login-card animate-fade-in">
          <div className="login-logo-section" style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center", marginBottom: "20px" }}>
            <div className="logo-icon" style={{ width: "42px", height: "42px", fontSize: "1.3rem" }}>HC</div>
            <div className="logo-text" style={{ textAlign: "left" }}>
              <h1 style={{ fontSize: "1rem", fontWeight: 700, color: "white", margin: 0, letterSpacing: "1px" }}>HÀNH CHÍNH</h1>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 600 }}>BÀ NÀ HILLS</span>
            </div>
          </div>
          
          <h2 className="login-title" style={{ fontSize: "1.2rem", fontWeight: 700, textAlign: "center", color: "white", marginBottom: "8px" }}>Đăng Nhập Hệ Thống</h2>
          <p className="login-subtitle" style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginBottom: "24px", lineHeight: "1.4" }}>
            Vui lòng đăng nhập để truy cập Cổng quản lý công việc Phòng Hành chính
          </p>
          
          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", textAlign: "left" }}>Email tài khoản</label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="form-control"
                style={{ padding: "10px 12px", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white", borderRadius: "var(--radius-md)" }}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "rgba(255, 255, 255, 0.8)", textAlign: "left" }}>Mật khẩu</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="form-control"
                style={{ padding: "10px 12px", backgroundColor: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)", color: "white", borderRadius: "var(--radius-md)" }}
                autoComplete="new-password"
                required
              />
            </div>

            {loginError && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f87171", fontSize: "0.8rem", backgroundColor: "rgba(239, 68, 68, 0.1)", padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <span>{loginError}</span>
              </div>
            )}

            <button type="submit" disabled={isLoggingIn} className="btn-primary" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", padding: "12px", marginTop: "8px", borderRadius: "var(--radius-md)", fontSize: "0.9rem" }}>
              {isLoggingIn ? (
                <div className="spinner-sm" style={{ width: "20px", height: "20px", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }}></div>
              ) : (
                <span>Đăng nhập</span>
              )}
            </button>
          </form>
          
          <div style={{ marginTop: "32px", fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.4)", textAlign: "center" }}>
            © 2026 Bản quyền thuộc Sun Group Bà Nà Hills
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "var(--bg-main)", color: "white", gap: "16px" }}>
        <div className="spinner" style={{ width: "50px", height: "50px", border: "4px solid rgba(255,255,255,0.1)", borderTopColor: "var(--primary-light)", borderRadius: "50%", animation: "spin 1s linear infinite" }}></div>
        <div style={{ fontSize: "0.9rem", fontWeight: 500, color: "var(--text-muted)" }}>Đang đồng bộ dữ liệu trực tuyến...</div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        stats={stats}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {/* Sidebar Backdrop Overlay on Mobile */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Floating Action Button (FAB) on Mobile */}
      {currentPage !== "reports" && currentPage !== "settings" && currentPage !== "staff" && (
        <button className="mobile-fab" onClick={handleAddTaskClick} title="Thêm công việc mới">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
            <line x1="12" x2="12" y1="5" y2="19" />
            <line x1="5" x2="19" y1="12" y2="12" />
          </svg>
        </button>
      )}

      {/* Main Content Area */}
      <div className="main-content">
        {/* Mobile Header Toggle */}
        <div className="mobile-header">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button className="mobile-menu-toggle" onClick={() => setSidebarOpen(prev => !prev)}>
              ☰
            </button>
            <strong style={{ fontSize: "0.9rem", letterSpacing: "0.5px" }}>QUẢN LÝ CÔNG VIỆC HC</strong>
          </div>
          <span style={{ fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.6)" }}>Bà Nà Hills</span>
        </div>

        {/* Global Page Header */}
        <Header
          currentPage={currentPage}
          onAddTask={handleAddTaskClick}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Page Body */}
        {renderPageContent()}
      </div>

      {/* MODALS */}
      {/* 1. Global Task Form Modal (Add/Edit) */}
      <TaskForm
        isOpen={isTaskFormOpen}
        task={editingTask}
        staffList={staffList}
        onSave={handleSaveTask}
        onCancel={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onDelete={handleDeleteFromForm}
      />

      {/* 2. Confirm Delete Task Modal */}
      <ConfirmModal
        isOpen={deletingTaskStt !== null}
        title="Xác nhận xóa công việc"
        message="Bạn có chắc chắn muốn xóa vĩnh viễn công việc này khỏi hệ thống? Dữ liệu đã xóa sẽ không thể khôi phục."
        onConfirm={handleConfirmDeleteTask}
        onCancel={() => setDeletingTaskStt(null)}
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy bỏ"
      />

      {/* 3. Confirm Delete Staff Modal */}
      <ConfirmModal
        isOpen={deletingStaffStt !== null}
        title="Xác nhận xóa nhân sự"
        message="Bạn có chắc chắn muốn xóa nhân viên này khỏi danh mục của phòng? Mọi mảng công việc phụ trách của họ sẽ bị gỡ bỏ."
        onConfirm={handleConfirmDeleteStaff}
        onCancel={() => setDeletingStaffStt(null)}
        confirmText="Xóa nhân sự"
        cancelText="Hủy bỏ"
      />
    </div>
  );
}
