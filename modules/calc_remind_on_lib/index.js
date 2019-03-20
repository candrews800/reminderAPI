const moment = require("moment");

const CURRENT_YEAR = moment().format("YYYY");
const NEXT_YEAR = moment().add(1, "year").format("YYYY");

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
            date = this.today.clone().set({
                month: this.schedule.month,
                date: this.schedule.day
            });

            if (
                date.isSame(this.today, "day")
                || date.isBefore(this.today)
            ) {
                date.add(1, "year");
            }

            dates.push(date);
        }

        if (this.schedule.startOfMonth) {
            date = this.today.clone().set("month", this.schedule.month).startOf("month");

            if (
                date.isSame(this.today, "day")
                || date.isBefore(this.today)
            ) {
                date.add(1, "year");
            }

            dates.push(date);
        }

        for (const day of this.schedule.daysPrior) {
            date = this.today.clone().set({
                month: this.schedule.month,
                date: this.schedule.day
            }).subtract(day, "day");

            if (
                date.isSame(this.today, "day")
                || date.isBefore(this.today)
            ) {
                date.add(1, "year");
            }

            dates.push(date);
        }

        for (const week of this.schedule.weeksPrior) {
            date = this.today.clone().set({
                month: this.schedule.month,
                date: this.schedule.day
            }).subtract(week, "week");

            if (
                date.isSame(this.today, "day")
                || date.isBefore(this.today)
            ) {
                date.add(1, "year");
            }

            dates.push(date);
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
}

module.exports = RemindOnCalculator;