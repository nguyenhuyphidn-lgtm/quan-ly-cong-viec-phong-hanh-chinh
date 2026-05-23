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

export default function App() {
  // Initialization & Core States
  const [currentPage, setCurrentPage] = useState("dashboard");
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

  // Initialize and load data on component mount
  useEffect(() => {
    dataService.init();
    loadAllData();
  }, []);

  const loadAllData = () => {
    const loadedTasks = dataService.getTasks();
    const loadedStaff = dataService.getStaff();
    const calculatedStats = dataService.getStats();

    setTasks(loadedTasks);
    setStaffList(loadedStaff);
    setStats(calculatedStats);
  };

  // Global Actions for Tasks
  const handleAddTaskClick = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTaskClick = (task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSaveTask = (taskData) => {
    dataService.saveTask(taskData);
    loadAllData();
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTaskClick = (stt) => {
    setDeletingTaskStt(stt);
  };

  const handleConfirmDeleteTask = () => {
    if (deletingTaskStt) {
      dataService.deleteTask(deletingTaskStt);
      loadAllData();
      setDeletingTaskStt(null);
      // Close form modal too if it was open
      setIsTaskFormOpen(false);
    }
  };

  const handleDeleteFromForm = (stt) => {
    setDeletingTaskStt(stt);
  };

  // Actions for Staff
  const handleSaveStaff = (staffData) => {
    dataService.saveStaff(staffData);
    loadAllData();
  };

  const handleDeleteStaffClick = (stt) => {
    // Check if staff has tasks assigned
    const staff = staffList.find(s => s.stt === stt);
    if (!staff) return;
    
    const staffTasks = tasks.filter(t => {
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

  const handleConfirmDeleteStaff = () => {
    if (deletingStaffStt) {
      dataService.deleteStaff(deletingStaffStt);
      loadAllData();
      setDeletingStaffStt(null);
    }
  };

  // Reload everything when system is reset to default
  const handleSystemReset = () => {
    loadAllData();
    setCurrentPage("dashboard");
  };

  // Render current page content
  const renderPageContent = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard stats={stats} onEditTask={handleEditTaskClick} />;
      case "tasks":
        return (
          <TaskList
            tasks={tasks}
            staffList={staffList}
            onEditTask={handleEditTaskClick}
            onDeleteTask={handleDeleteTaskClick}
            onAddTask={handleAddTaskClick}
          />
        );
      case "byStaff":
        return (
          <TaskByStaff
            tasks={tasks}
            staffList={staffList}
            stats={stats}
            onEditTask={handleEditTaskClick}
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

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        stats={stats}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

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
