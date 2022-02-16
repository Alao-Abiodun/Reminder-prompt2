const express = require("express");
const router = express.Router();

const {
  addAReminder,
  recieveAReminder,
  getAllReminders,
  updateAReminder,
  changeSomeReminder,
  stopAReminder,
  reminderByPagination,
} = require("../controllers/reminder.controller");

router.post("/reminder", addAReminder);
router.get("/reminders/:id", recieveAReminder);
router.get("/reminders", getAllReminders);
router.get("/reminderByPagination", reminderByPagination);
router.put("/reminder/:id", updateAReminder);
router.patch("/reminder/:id", changeSomeReminder);
router.delete("/reminders/:id", stopAReminder);

module.exports = router;
