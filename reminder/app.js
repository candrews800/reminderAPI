const getReadyReminders = require("lib/get_ready_reminders");

const processReminder = async (reminder) => {
    // TODO: SEND EMAIL
    console.log(reminder);
};

const runService = async (onFinish) => {
    const reminders = await getReadyReminders();

    const reminderPromises = reminders.map(reminder => processReminder(reminder));

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