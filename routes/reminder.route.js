const express = require("express");
const router = express.Router();

const reminderController = require("../controllers/reminder.controller");

router.post("/reminder", reminderController.addAReminder);
router.get("/reminders/:id", reminderController.recieveAReminder);
router.get("/reminders", reminderController.getAllReminders);
router.put("/reminder/:id", reminderController.updateAReminder);
router.patch("/reminder/:id", reminderController.changeSomeReminder);
router.delete("/reminders/:id", reminderController.stopAReminder);

module.exports = router;
