"use strict";

const reminderRoutes = require("app/routes/reminders");

// app/routes.js
module.exports = function(app, passport) {
    require("app/routes/auth")(app, passport);

    app.get("/reminders", reminderRoutes.getReminders);
    app.post("/reminders", reminderRoutes.postReminder);
    app.put("/reminders", reminderRoutes.putReminder);
    app.delete("/reminders", reminderRoutes.deleteReminder);
};

