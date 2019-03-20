const assert = require("assert");
const moment = require("moment");

const RemindOnCalculator = require("index");
const DATE_FORMAT = "YYYY-MM-DD";

const testScenarios = scenarios => {
    for (const scenario of scenarios) {
        it(scenario.testLabel, () => {
            const remindOnCalc = new RemindOnCalculator(scenario.schedule);
            remindOnCalc.setToday(moment(scenario.currentDate));

            assert.equal(remindOnCalc.getNextReminderDate().format(DATE_FORMAT), scenario.expectedRemindOn);
        });
    }
};

describe("calcRemindOn.getNextReminderDate()", () => {
    describe("dayOf only schedules", () => {
        const scenarios = [
            {
                testLabel: "should return correct date when dayOf selected only and today is prior to month/day",
                currentDate: "2019-01-19",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: true,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: []
                },
                expectedRemindOn: "2019-03-19"
            },
            {
                testLabel: "should return correct date when dayOf selected only and today is the scheduled day",
                currentDate: "2019-03-19",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: true,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: []
                },
                expectedRemindOn: "2020-03-19"
            },
            {
                testLabel: "should return correct date when dayOf selected only and today is past scheduled day",
                currentDate: "2019-04-19",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: true,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: []
                },
                expectedRemindOn: "2020-03-19"
            },
        ];

        testScenarios(scenarios);
    });

    describe("startOfMonth only schedules", () => {
        const scenarios = [
            {
                testLabel: "should return correct date when startOfMonth selected only and today is prior to month/day",
                currentDate: "2019-02-20",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: true,
                    weeksPrior: [],
                    daysPrior: []
                },
                expectedRemindOn: "2019-03-01"
            },
            {
                testLabel: "should return correct date when startOfMonth selected only and today is the scheduled day",
                currentDate: "2019-03-01",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: true,
                    weeksPrior: [],
                    daysPrior: []
                },
                expectedRemindOn: "2020-03-01"
            },
            {
                testLabel: "should return correct date when startOfMonth selected only and is past scheduled day",
                currentDate: "2019-04-19",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: true,
                    weeksPrior: [],
                    daysPrior: []
                },
                expectedRemindOn: "2020-03-01"
            },
        ];

        testScenarios(scenarios);
    });

    describe("daysPrior only schedules", () => {
        const scenarios = [
            {
                testLabel: "should return correct date when daysPrior is 1",
                currentDate: "2019-02-20",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: [1]
                },
                expectedRemindOn: "2019-03-18"
            },
            {
                testLabel: "should return correct date when daysPrior is 5",
                currentDate: "2019-02-20",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: [5]
                },
                expectedRemindOn: "2019-03-14"
            },
            {
                testLabel: "should return correct date when daysPrior makes the date the previous year",
                currentDate: "2019-02-20",
                schedule: {
                    month: 0,
                    day: 3,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: [5]
                },
                expectedRemindOn: "2019-12-29"
            },
            {
                testLabel: "should return correct date when daysPrior has multiple days and currentDate is before all",
                currentDate: "2019-02-20",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: [1, 5]
                },
                expectedRemindOn: "2019-03-14"
            },
            {
                testLabel: "should return correct date when daysPrior has multiple days and currentDate is between them",
                currentDate: "2019-03-17",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: [1, 5]
                },
                expectedRemindOn: "2019-03-18"
            },
            {
                testLabel: "should return correct date when daysPrior has multiple days and currentDate is after them",
                currentDate: "2019-04-17",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [],
                    daysPrior: [1, 5]
                },
                expectedRemindOn: "2020-03-14"
            },
        ];

        testScenarios(scenarios);
    });

    describe("weeksPrior only schedules", () => {
        const scenarios = [
            {
                testLabel: "should return correct date when weeksPrior is 1",
                currentDate: "2019-01-20",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [1],
                    daysPrior: []
                },
                expectedRemindOn: "2019-03-12"
            },
            {
                testLabel: "should return correct date when weeksPrior is 5",
                currentDate: "2019-01-20",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [5],
                    daysPrior: []
                },
                expectedRemindOn: "2019-02-12"
            },
            {
                testLabel: "should return correct date when weeksPrior makes the date the previous year",
                currentDate: "2019-02-20",
                schedule: {
                    month: 0,
                    day: 3,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [1],
                    daysPrior: []
                },
                expectedRemindOn: "2019-12-27"
            },
            {
                testLabel: "should return correct date when weeksPrior has multiple days and currentDate is before all",
                currentDate: "2019-01-20",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [1, 5],
                    daysPrior: []
                },
                expectedRemindOn: "2019-02-12"
            },
            {
                testLabel: "should return correct date when weeksPrior has multiple days and currentDate is between them",
                currentDate: "2019-03-01",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [1, 5],
                    daysPrior: []
                },
                expectedRemindOn: "2019-03-12"
            },
            {
                testLabel: "should return correct date when weeksPrior has multiple days and currentDate is between them",
                currentDate: "2019-04-17",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: false,
                    startOfMonth: false,
                    weeksPrior: [1, 5],
                    daysPrior: []
                },
                expectedRemindOn: "2020-02-12"
            }
        ];

        testScenarios(scenarios);
    });

    describe("mix of schedule scenarios", () => {
        const scenarios = [
            {
                testLabel: "scenario #1",
                currentDate: "2019-01-19",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: true,
                    startOfMonth: false,
                    weeksPrior: [2],
                    daysPrior: [3, 13]
                },
                expectedRemindOn: "2019-03-05"
            },
            {
                testLabel: "scenario #2",
                currentDate: "2019-01-19",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: true,
                    startOfMonth: true,
                    weeksPrior: [2],
                    daysPrior: [3, 13]
                },
                expectedRemindOn: "2019-03-01"
            },
            {
                testLabel: "scenario #3",
                currentDate: "2019-04-19",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: true,
                    startOfMonth: true,
                    weeksPrior: [2],
                    daysPrior: [3, 13]
                },
                expectedRemindOn: "2020-03-01"
            },
            {
                testLabel: "scenario #4",
                currentDate: "2019-03-11",
                schedule: {
                    month: 2,
                    day: 19,
                    dayOf: true,
                    startOfMonth: true,
                    weeksPrior: [2],
                    daysPrior: [3, 13]
                },
                expectedRemindOn: "2019-03-16"
            },
        ];

        testScenarios(scenarios);
    });
});