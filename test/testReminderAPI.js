const assert = require("assert");
const moment = require("moment");

const knex = require("config/knex");
const seeder = require("seeds/seed");
const userSeeder = require("seeds/lib/seed_users");
const reminderSeeder = require("seeds/lib/seed_reminders");
const reminderRoutes = require("app/routes/reminders");

const DATE_FORMAT = "YYYY-MM-DD";

let req, res;

const getDefaultReq = () => {
	return {
		user: userSeeder.USER_1
	};
};

const getDefaultRes = () => {
	return {
		responseCode: null,
		response: null,
		json: function (msg) {
			this.response = msg;
			return this;
		},
		send: function (msg) {
			this.response = msg;
			return this;
		},
		statusCode: function (code) {
			this.responseCode = code;
			return this;
		}
	};
};

describe("Reminder API", () => {
	beforeEach(async () => {
		await seeder.seed(knex);
		req = getDefaultReq();
		res = getDefaultRes();
	});

	after(async () => {
		// release pg connections or tests will not complete
		await knex.destroy();
	});

	describe("GET /reminders", () => {
		it("should return 200 status code", async () => {
			await reminderRoutes.getReminders(req, res);

			assert.equal(res.responseCode, 200);
		});

		it("should return list of seeded reminders", async () => {
			await reminderRoutes.getReminders(req, res);

			assert.equal(res.response.length, reminderSeeder.REMINDERS.length);
		});

		it("should return list of seeded reminders only for requested user", async () => {
			const changedUserReq = Object.assign({}, req, {
				user: Object.assign({}, userSeeder.USER_1, { id: 100 })
			});

			await reminderRoutes.getReminders(changedUserReq, res);

			assert.equal(res.response.length, 0);
		});

		it("should return 400 status code if no user is in request", async () => {
			const noUserReq = Object.assign({}, req);

			delete noUserReq.user;

			await reminderRoutes.getReminders(noUserReq, res);

			assert.equal(res.responseCode, 400);
		});
	});

	describe("POST /reminders", () => {
		it("should return 200 status code when provided with valid reminder object", async () => {
			const reminder = {
				remind_on: "2019-04-01",
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await reminderRoutes.postReminder(reqWithReminderAttached, res);

			assert.equal(res.responseCode, 200);
		});

		it("should respond with created reminder object when provided with valid reminder object", async () => {
			const reminder = {
				remind_on: moment("2019-04-01").format(DATE_FORMAT)
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await reminderRoutes.postReminder(reqWithReminderAttached, res);

			const response = res.response;
			assert.equal(moment(response.remind_on).format(DATE_FORMAT), reminder.remind_on);
			assert.equal(response.user_id, reqWithReminderAttached.user.id);
			assert.equal(response.hasOwnProperty("id"), true, "should have id attached");
		});

		it("should respond with 400 status code when called without the user object", async () => {
			const reqWithNoUser = Object.assign({}, req, {
				user: null
			});

			await reminderRoutes.postReminder(reqWithNoUser, res);

			assert.equal(res.responseCode, 400);
		});

		it("should respond with 400 status code if id is already set", async () => {
			const reminder = {
				id: 100,
				remind_on: moment("2019-04-01").format(DATE_FORMAT)
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await reminderRoutes.postReminder(reqWithReminderAttached, res);

			assert.equal(res.responseCode, 400);
		});

		it("should respond with 400 status code if remind_on is not set", async () => {
			const reminder = {
				remind_on: "not a real date"
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await reminderRoutes.postReminder(reqWithReminderAttached, res);

			assert.equal(res.responseCode, 400);
		});

		it("should respond with 400 status code if remind_on is a bad format", async () => {
			const reminder = {
				remind_on: "not a real date"
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await reminderRoutes.postReminder(reqWithReminderAttached, res);

			assert.equal(res.responseCode, 400);
		});
	});

	describe("PUT /reminder/{id}", () => {
		it("should return 200 status code when provided with valid reminder object", async () => {
			const reminder = {
				remind_on: "2019-04-01",
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1
				}
			});

			await reminderRoutes.putReminder(reqEditReminder, res);

			assert.equal(res.responseCode, 200);
		});
	});

	describe("DELETE /reminder/{id}", () => {

	});
});