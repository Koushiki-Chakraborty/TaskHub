import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  Eye,
} from "lucide-react";
import taskService from "../services/task.service";
import TaskModal from "../components/TaskModal";
import ConfirmModal from "../components/ConfirmModal";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";
import { clsx } from "clsx";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== "all") params.status = statusFilter;

      const response = await taskService.getAllTasks(params);

      if (response.success && Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        if (Array.isArray(response)) setTasks(response);
        else setTasks([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleSaveTask = async (taskData) => {
    setIsModalLoading(true);
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask._id, taskData);
        toast.success("Task updated");
      } else {
        await taskService.createTask(taskData);
        toast.success("Task created");
      }
      setIsTaskModalOpen(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.message || "Failed to save task");
    } finally {
      setIsModalLoading(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsDeleteLoading(true);
    try {
      await taskService.deleteTask(taskToDelete._id);
      toast.success("Task deleted");
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      toast.error(error.message || "Failed to delete task");
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your tasks and track progress.
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-6">
            <div className="rounded-full bg-gray-100 p-3">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-gray-900">
              No tasks found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
            <Button
              variant="link"
              onClick={openCreateModal}
              className="mt-2 text-blue-600"
            >
              Create Task
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 font-bold">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 font-bold">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 font-bold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="hover:bg-gray-50/80 transition-colors last:border-0"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900">
                          {task.title}
                        </span>
                        {task.description && (
                          <span className="text-sm text-gray-500 truncate max-w-xs">
                            {task.description}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={clsx(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wider",
                          task.status === "completed" &&
                            "bg-green-100 text-green-700 border border-green-200",
                          task.status === "in-progress" &&
                            "bg-blue-100 text-blue-700 border border-blue-200",
                          task.status === "pending" &&
                            "bg-yellow-100 text-yellow-700 border border-yellow-200",
                        )}
                      >
                        {task.status.replace("-", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => navigate(`/tasks/${task._id}`)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-green-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(task)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(task)}
                          className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        task={editingTask}
        onSave={handleSaveTask}
        isLoading={isModalLoading}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteTask}
        title="Delete Task"
        message="This action cannot be undone."
        isLoading={isDeleteLoading}
      />
    </div>
  );
};

export default Tasks;
