const moment = require("moment");

class RemindOnCalculator {
    constructor(schedule) {
        this.schedule = schedule;

        this.today = this.setToday(moment());
    }

    setToday(date) {
        this.today = date;
    }

    getNextReminderDate() {
        let date;
        const dates = [];

        // add possible remind dates based on schedules
        if (this.schedule.dayOf) {
            date = this.getScheduledDate();

            dates.push(this.addYearIfPastToday(date));
        }

        if (this.schedule.startOfMonth) {
            date = this.getScheduledDate().startOf("month");

            dates.push(this.addYearIfPastToday(date));
        }

        for (const day of this.schedule.daysPrior) {
            date = this.getScheduledDate().subtract(day, "day");

            dates.push(this.addYearIfPastToday(date));
        }

        for (const week of this.schedule.weeksPrior) {
            date = this.getScheduledDate().subtract(week, "week");

            dates.push(this.addYearIfPastToday(date));
        }

        if (dates.length === 0) {
            console.error("No current scheduled date selected. Setting date to time in past");
            return moment("1970-01-01")
        }

        // sort through possible remind dates
        dates.sort((a, b) => {
            return a.isBefore(b) ? -1 : 1;
        });

        // pluck the first index, aka the earliest date
        return dates[0];
    }

    getScheduledDate() {
        return this.today.clone().set({
            month: this.schedule.month,
            date: this.schedule.day
        });
    }

    addYearIfPastToday(date) {
        if (
            date.isSame(this.today, "day")
            || date.isBefore(this.today)
        ) {
            date.add(1, "year");
        }

        return date;
    }
}

module.exports = RemindOnCalculator;