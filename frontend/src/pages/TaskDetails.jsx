import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import taskService from "../services/task.service";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await taskService.getSingleTask(id);
        if (res.success) {
          setTask(res.data);
        } else {
          navigate("/tasks");
        }
      } catch (err) {
        console.error(err);
        navigate("/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );

  if (!task)
    return <div className="p-8 text-center text-gray-500">Task not found</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        to="/tasks"
        className="flex items-center text-sm text-gray-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Task List
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="mr-2 h-4 w-4" />
                  Created on {new Date(task.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Tag className="mr-2 h-4 w-4" />
                  ID: {task._id.slice(-6).toUpperCase()}
                </div>
              </div>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : task.status === "in-progress"
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-yellow-100 text-yellow-700 border-yellow-200"
              }`}
            >
              {task.status.replace("-", " ")}
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Description
            </h3>
            <div className="bg-gray-50 rounded-lg p-6 text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[150px]">
              {task.description || "No description provided for this task."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
