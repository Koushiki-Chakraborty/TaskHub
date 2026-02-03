const Task = require("../models/Task");

// @desc    Get all user tasks
// @route   GET /api/v1/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    // Start with the base query
    const query = { user: req.user.id };

    // Add Title Search logic
    if (req.query.search) {
      // This looks for the search string anywhere inside the title
      query.title = { $regex: req.query.search, $options: "i" };
    }

    // Add Status Filter logic
    // We check if it exists and ensure it's not the 'all' placeholder
    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }

    // Execute the query with Mongoose
    const tasks = await Task.find(query).sort({ createdAt: -1 }); // Newest tasks first

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new task
// @route   POST /api/v1/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    // Add user to req.body from the auth middleware
    req.body.user = req.user.id;

    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single task by ID
// @route   GET /api/v1/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    // Find task by its ID AND ensure it belongs to the logged-in user
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found or you don't have permission to view it",
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update task
// @route   PUT /api/v1/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // User owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete task
// @route   DELETE /api/v1/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // User owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this task",
      });
    }

    await task.deleteOne();

    res.status(200).json({ success: true, message: "Task removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
