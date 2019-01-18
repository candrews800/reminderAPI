const reminderRoutes = require("routes/reminders");

// app/routes.js
module.exports = function(app, passport) {
    require("app/routes/auth")(app, passport);

    app.get("/reminders", reminderRoutes.getReminders);
    app.post("/reminders", reminderRoutes.postReminder);
};

