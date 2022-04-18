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

const multerForImage = require("../libs/multer");

router.post("/reminder", multerForImage.single("images"), addAReminder);
router.get("/reminders/:_id", recieveAReminder);
router.get("/reminders", getAllReminders);
router.get("/reminderByPagination", reminderByPagination);
router.put("/reminder/:_id", updateAReminder);
// router.patch("/reminder/:_id", changeSomeReminder);
router.delete("/reminder/:_id/", stopAReminder);

module.exports = router;
