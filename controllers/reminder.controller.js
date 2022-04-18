const Reminder = require("../models/reminder.model");
const client = require("../redisDB");
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

    await client.set(`${setReminder._id}`, JSON.stringify(setReminder), {
      EX: 5,
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
    const { _id } = req.params;
    let reminder = JSON.parse(await client.get(_id));
    if (!reminder) {
      reminder = await Reminder.findOne({ _id });
      await client.set(`${reminder._id}`, JSON.stringify(reminder), { EX: 5 });
    }
    return successResMsg(res, 200, {
      message: "reminded fetch successfully",
      reminder,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

const getAllReminders = async (req, res, next) => {
  try {
    let reminders = await client.get(`reminders`);

    if (reminders) {
      return successResMsg(res, 200, {
        message: "reminders fetch successfully from redis memory",
        reminders: JSON.parse(reminders),
      });
    }

    reminders = await Reminder.find();
    await client.set(`reminders`, JSON.stringify(reminders), {
      EX: 5,
    });

    return successResMsg(res, 200, {
      message: "reminders fetch successfully from the database",
      reminders,
    });
  } catch (error) {
    return errorResMsg(res, 401, "Server Error");
  }
};

//     const conditions = {};
//     if (req.query.page) {
//       conditions.page = req.query.page;
//     }
//     if (req.query.limit) {
//       conditions.limit = req.query.limit;
//     }
//     reminders = await Reminder.find(conditions).limit(10);
//     // .limit(limit * 1)
//     // .skip((page - 1) * limit)
//     // .sort({ updatedAt: -1 })
//     // .exec();

//     await client.set(`reminders`, JSON.stringify(reminders), { EX: 5 });

//     // const count = await Reminder.countDocuments();

//     return successResMsg(res, 200, {
//       message: "reminded fetch successfully from database",
//       reminders,
//       // total: allReminders.length,
//       // totalPages: Math.ceil(count / limit),
//       // currentPage: page,
//     });
//   } catch (error) {
//     console.log(error);
//     return errorResMsg(res, 401, "Server Error");
//   }
// };

const updateAReminder = async (req, res, next) => {
  try {
    const { _id } = req.params;

    const updatedReminder = await Reminder.findOneAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReminder) {
      return next(new AppError("No reminder found", 404));
    }

    await client.set(
      `${updatedReminder._id}`,
      JSON.stringify(updatedReminder),
      { EX: 5 }
    );

    return successResMsg(res, 200, {
      message: "Reminder updated successfully",
      updatedReminder,
    });
  } catch (error) {
    console.log(error);
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
    const { _id } = req.params;

    // delete the reminder from redis
    await client.del(`${_id}`);

    // delete the reminder from database
    const stopReminder = await Reminder.findOneAndDelete({ _id });

    if (!stopReminder) {
      return next(new AppError("Reminder Not Found!", 404));
    }

    return successResMsg(res, 405, {
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    console.log(error);
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
