const getReadyReminders = async () => {
    return [123, 456, 789];
};

const processReminder = async (reminder) => {
    console.log(reminder);
};

const runService = async (onFinish) => {
    const reminders = await getReadyReminders();

    const reminderPromises = reminders.map(reminder => processReminder(reminder));

    await Promise.all(reminderPromises);

    onFinish();
};

let running = false;
setInterval(() => {
    if (running) {
        return;
    }

    running = true;

    return runService(() => { running = false; });
}, 1000);

// export functions to test implementation
module.exports = {
    runService,
    getReadyReminders,
    processReminder
};