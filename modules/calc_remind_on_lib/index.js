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
        // add possible remind dates based on schedules
        const dates = this.getDayOfDates()
            .concat(this.getStartOfMonthDates())
            .concat(this.getWeeksPriorDates())
            .concat(this.getDaysPriorDates());

        if (dates.length === 0) {
            console.error("No current scheduled date selected. Setting date to time in past");
            return moment("1970-01-01")
        }

        // sort possible remind dates in ascending order, earliest first
        dates.sort((a, b) => {
            return a.isBefore(b) ? -1 : 1;
        });

        // pluck the first index, aka the earliest date
        return dates[0];
    }

    getDayOfDates() {
        const dates = [];

        if (this.schedule.dayOf) {
            dates.push(this.addYearIfPastToday(this.getScheduledDate()));
        }

        return dates;
    }

    getStartOfMonthDates() {
        const dates = [];

        if (this.schedule.startOfMonth) {
            const date = this.getScheduledDate().startOf("month");

            dates.push(this.addYearIfPastToday(date));
        }

        return dates;
    }

    getWeeksPriorDates() {
        const dates = [];

        for (const week of this.schedule.weeksPrior) {
            const date = this.getScheduledDate().subtract(week, "week");

            dates.push(this.addYearIfPastToday(date));
        }

        return dates;
    }

    getDaysPriorDates() {
        const dates = [];

        for (const day of this.schedule.daysPrior) {
            const date = this.getScheduledDate().subtract(day, "day");

            dates.push(this.addYearIfPastToday(date));
        }

        return dates;
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