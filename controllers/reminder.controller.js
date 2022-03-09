const Reminder = require("../models/reminder.model");
const { successResMsg, errorResMsg } = require("../libs/response");
const AppError = require("../libs/appError");

const addAReminder = async (req, res, next) => {
  try {
    const { user, description, date } = req.body;
    const { path } = req.file;
    if (!user || !description) {
      return next(new AppError("Please fill in the required field", 401));
    }
    const setReminder = await Reminder.create({
      user,
      description,
      date,
      images: path,
    });
    return successResMsg(res, 201, {
      message: "A Reminder is created successfully",
      setReminder,
    });
  } catch (error) {
    console.log(error.message);
    return errorResMsg(res, 401, "Server Error");
  }
};

const recieveAReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const aReminder = await Reminder.findOne({ _id: id });
    if (!aReminder) {
      return next(new AppError("Reminder Not Found!", 404));
    }
    return successResMsg(res, 200, {
      message: "reminded fetch successfully",
      aReminder,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

const getAllReminders = async (req, res, next) => {
  try {
    const {page, limit} = req.query;
    if (limit === null || page === null) {
      limit = 1;
      page = 1;
    }
    const allReminders = await Reminder.find()
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .sort({ user: -1 })
    .exec();
    const count = await Reminder.countDocuments();
    return successResMsg(res, 200, {
      message: "reminded fetch successfully",
      allReminders,
      total: allReminders.length,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

const updateAReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedReminder = await Reminder.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedReminder) {
      return next(new AppError("Reminder Not Found!", 404));
    }
    return successResMsg(res, 200, {
      message: "Reminder updated successfully",
      updatedReminder,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

const changeSomeReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateSomeReminderSettings = await Reminder.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updateSomeReminderSettings) {
      return next(new AppError("Reminder Not Found!", 404));
    }
    return successResMsg(res, 200, {
      message: "Reminder updated successfully",
      updateSomeReminderSettings,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

const stopAReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const stopReminder = await Reminder.findOneAndDelete({ _id: id });
    if (!stopReminder) {
      return next(new AppError("Reminder Not Found!", 404));
    }
    return successResMsg(res, 405, {
      message: "Reminder updated successfully",
    });
  } catch (error) {
    console.log(error)
    return errorResMsg(res, 401, "Server Error");
  }
};

const reminderByPagination = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const reminders = await Reminder.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: 1 })
      .exec();
    // const offset = (page - 1) * limit;
    // const result = reminders.slice(offset, page * limit);
    return successResMsg(res, 200, {
      message: "Reminder paginated successfully",
      reminders,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

module.exports = {
  addAReminder,
  recieveAReminder,
  getAllReminders,
  updateAReminder,
  changeSomeReminder,
  stopAReminder,
  reminderByPagination,
};
