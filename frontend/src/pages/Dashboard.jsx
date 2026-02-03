import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import taskService from "../services/task.service";
import TaskModal from "../components/TaskModal";
import {
  LayoutDashboard,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await taskService.getAllTasks();
      if (res.success && res.data) {
        const tasks = res.data;
        setStats({
          total: tasks.length,
          pending: tasks.filter((t) => t.status === "pending").length,
          inProgress: tasks.filter((t) => t.status === "in-progress").length,
          completed: tasks.filter((t) => t.status === "completed").length,
        });
        // Show the 3 most recent
        setRecentTasks(tasks.slice(0, 3));
      }
    } catch (error) {
      console.error("Dashboard fetch error", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handle creating a task directly from Dashboard
  const handleCreateTask = async (taskData) => {
    setIsModalLoading(true);
    try {
      const res = await taskService.createTask(taskData);
      if (res.success) {
        toast.success("Task created successfully!");
        setIsTaskModalOpen(false);
        fetchDashboardData(); // Refresh stats immediately
      }
    } catch (error) {
      toast.error(error.message || "Failed to create task");
    } finally {
      setIsModalLoading(false);
    }
  };

  const completionRate =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Workspace Overview
          </h1>
          <p className="text-sm text-gray-500">Welcome back, {user?.name}!</p>
        </div>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="mr-2 h-4 w-4" /> New Task
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<LayoutDashboard className="text-blue-600" />}
          label="Total"
          value={stats.total}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Clock className="text-yellow-600" />}
          label="Pending"
          value={stats.pending}
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<AlertCircle className="text-orange-600" />}
          label="In Progress"
          value={stats.inProgress}
          bgColor="bg-orange-50"
        />
        <StatCard
          icon={<CheckCircle className="text-green-600" />}
          label="Completed"
          value={stats.completed}
          bgColor="bg-green-50"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Progress Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Overall Progress
          </h3>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100">
                Task Completion
              </span>
              <span className="text-sm font-semibold text-blue-600">
                {completionRate}%
              </span>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-50">
              <div
                style={{ width: `${completionRate}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {stats.completed} of {stats.total} tasks completed.
            </p>
          </div>
        </div>

        {/* Recent Tasks Preview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Tasks
            </h3>
            <Link
              to="/tasks"
              className="text-sm text-blue-600 hover:underline flex items-center"
            >
              View All <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-gray-400">Loading tasks...</p>
            ) : recentTasks.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No tasks yet.</p>
            ) : (
              recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0"
                >
                  <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                    {task.title}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold 
                    ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : task.status === "in-progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task Modal Integration */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleCreateTask}
        isLoading={isModalLoading}
      />
    </div>
  );
};

const StatCard = ({ icon, label, value, bgColor }) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm flex items-center">
    <div className={`p-3 rounded-lg ${bgColor}`}>{icon}</div>
    <div className="ml-4">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default Dashboard;
