const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
// Apply authentication middleware to all routes defined below
router.use(protect);

router
  .route("/")
  .get(getTasks) // GET /api/v1/tasks
  .post(createTask); // POST /api/v1/tasks

router
  .route("/:id")
  .get(protect, getTask) // Get single task
  .put(updateTask) // Update task
  .delete(deleteTask); // Delete task

module.exports = router;
