const Reminder = require("../models/reminder.model");
const { successResMsg, errorResMsg } = require("../libs/response");
const AppError = require("../libs/appError");

exports.addAReminder = async (req, res, next) => {
  try {
    const { user, description, date } = req.body;
    if (!user || !description) {
      return next(new AppError("Please fill in the required field", 401));
    }
    const setReminder = await Reminder.create({
      user,
      description,
      date,
    });
    return successResMsg(res, 201, {
      message: "A Reminder is created successfully",
      setReminder,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

exports.recieveAReminder = async (req, res, next) => {
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

exports.getAllReminders = async (req, res, next) => {
  try {
    const allReminders = await Reminder.find();
    return successResMsg(res, 200, {
      message: "reminded fetch successfully",
      allReminders,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

exports.updateAReminder = async (req, res, next) => {
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

exports.changeSomeReminder = async (req, res, next) => {
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

exports.stopAReminder = async (req, res, next) => {
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
    return errorResMsg(res, 401, "Server Error");
  }
};