"use strict";

const reminderService = require("lib/reminder_service");

const runService = async (onFinish) => {
    const reminders = await reminderService.getReadyReminders();

    const reminderPromises = reminders.map(reminder => reminderService.processReminder(reminder));

    await Promise.all(reminderPromises);

    onFinish();
};

// Query and process reminders every second
// unless the previous seconds's reminders have not completed

let running = false;

setInterval(() => {
    if (running) {
        return;
    }

    running = true;

    return runService(() => { running = false; });
}, 1000);