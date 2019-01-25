const assert = require("assert");
const moment = require("moment");

const knex = require("config/knex");

const seeder = require("seeds/seed");
const userSeeder = require("seeds/lib/seed_users");
const reminderSeeder = require("seeds/lib/seed_reminders");
const reminderRoutes = require("app/routes/reminders");

const NotAuthorizedError = require("app/lib/errors/NotAuthorizedError");
const ValidationError = require("app/lib/errors/ValidationError");
const NotFoundError = require("app/lib/errors/NotFoundError");

const DATE_FORMAT = "YYYY-MM-DD";

let req, res;

const getDefaultReq = () => {
	return {
		params: {},
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

const assertThrowsAsync = async (fn, _Class) => {
	let f = () => {};
	try {
		await fn();
	} catch(e) {
		f = () => {throw e};
	} finally {
		assert.throws(f, _Class);
	}
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

		it("should throw not authorized error if no user is in request", async () => {
			const noUserReq = Object.assign({}, req);

			delete noUserReq.user;

			await assertThrowsAsync(reminderRoutes.getReminders.bind(this, noUserReq, res), NotAuthorizedError);
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

		it("should throw not authorized error when called without the user object", async () => {
			const reqWithNoUser = Object.assign({}, req, {
				user: null
			});

			await assertThrowsAsync(reminderRoutes.postReminder.bind(this, reqWithNoUser, res), NotAuthorizedError);
		});

		it("should throw validation error if id is already set", async () => {
			const reminder = {
				id: 100,
				remind_on: moment("2019-04-01").format(DATE_FORMAT)
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await assertThrowsAsync(reminderRoutes.postReminder.bind(this, reqWithReminderAttached, res), ValidationError);
		});

		it("should throw validation error if remind_on is not set", async () => {
			const reminder = {
				remind_on: "not a real date"
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await assertThrowsAsync(reminderRoutes.postReminder.bind(this, reqWithReminderAttached, res), ValidationError);
		});

		it("should throw validation error if remind_on is a bad format", async () => {
			const reminder = {
				remind_on: "not a real date"
			};

			const reqWithReminderAttached = Object.assign({}, req, {
				body: reminder
			});

			await assertThrowsAsync(reminderRoutes.postReminder.bind(this, reqWithReminderAttached, res), ValidationError);
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

		it("should throw not found error when provided with id that does not match anything", async () => {
			const reminder = {
				remind_on: "2019-04-01",
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1234567890
				}
			});

			await assertThrowsAsync(reminderRoutes.putReminder.bind(this, reqEditReminder, res), NotFoundError);
		});

		it("should save new reminder details in db", async () => {
			const REMINDER_ID = 1;
			const REMINDER_DATE = "2020-04-01";
			const reminder = {
				remind_on: REMINDER_DATE,
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: REMINDER_ID
				}
			});

			await reminderRoutes.putReminder(reqEditReminder, res);

			const actualReminder = await knex("reminders")
				.where("id", REMINDER_ID)
				.first();

			assert.equal(moment(actualReminder.remind_on).format(DATE_FORMAT), REMINDER_DATE);
		});

		it("should throw validation error if remind_on is not set", async () => {
			const reminder = {

			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1
				}
			});

			await assertThrowsAsync(reminderRoutes.putReminder.bind(this, reqEditReminder, res), ValidationError);
		});

		it("should throw validation error if remind_on is a bad format", async () => {
			const reminder = {
				remind_on: "a bad date format"
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1
				}
			});

			await assertThrowsAsync(reminderRoutes.putReminder.bind(this, reqEditReminder, res), ValidationError);
		});

		it("should throw not authorized error if no user is in request", async () => {
			const reminder = {
				remind_on: "2019-04-01",
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1
				},
				user: null
			});

			await assertThrowsAsync(reminderRoutes.putReminder.bind(this, reqEditReminder, res), NotAuthorizedError);
		});

		it("should throw not authorized error when user tries to edit reminder not owned by them", async () => {
			const reminder = {
				remind_on: "2019-04-01",
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1
				},
				user: {
					id: 123456
				}
			});


			await assertThrowsAsync(reminderRoutes.putReminder.bind(this, reqEditReminder, res), NotAuthorizedError);
		});

		it("should keep reminder info the same, when user tries to edit reminder not owned by them", async () => {
			const REMINDER_ID = 1;
			const START_DATE = reminderSeeder.REMINDERS[REMINDER_ID - 1].remind_on;
			const reminder = {
				remind_on: "2020-09-10",
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: REMINDER_ID
				},
				user: {
					id: 123456
				}
			});

			try {
				await reminderRoutes.putReminder(reqEditReminder, res);
			} catch (e) {
				// ignore
			}

			const actualReminder = await knex("reminders")
				.where("id", REMINDER_ID)
				.first();

			assert.equal(moment(actualReminder.remind_on).format(DATE_FORMAT), START_DATE);
		});

		it("should throw validation error, when user tries to set id", async () => {
			const reminder = {
				id: 1234,
				remind_on: "2019-04-01",
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1
				}
			});

			await assertThrowsAsync(reminderRoutes.putReminder.bind(this, reqEditReminder, res), ValidationError);
		});

		it("should throw validation error, when user tries to set user_id", async () => {
			const reminder = {
				user_id: 1234,
				remind_on: "2019-04-01",
			};

			const reqEditReminder = Object.assign({}, req, {
				body: reminder,
				params: {
					id: 1
				}
			});

			await assertThrowsAsync(reminderRoutes.putReminder.bind(this, reqEditReminder, res), ValidationError);
		});
	});

	describe("DELETE /reminder/{id}", () => {
		it("should return 200 when id exists", async () => {
			const reqDeleteReminder = Object.assign({}, req, {
				params: {
					id: 1
				}
			});

			await reminderRoutes.deleteReminder(reqDeleteReminder, res);

			assert.equal(res.responseCode, 200);
		});

		it("should throw not found error when id does not exist", async () => {
			const reqDeleteReminder = Object.assign({}, req, {
				params: {
					id: 123456789
				}
			});

			await assertThrowsAsync(reminderRoutes.deleteReminder.bind(this, reqDeleteReminder, res), NotFoundError);
		});

		it("should throw not authorized error when no user provided", async () => {
			const reqDeleteReminder = Object.assign({}, req, {
				user: null,
				params: {
					id: 1
				}
			});

			await assertThrowsAsync(reminderRoutes.deleteReminder.bind(this, reqDeleteReminder, res), NotAuthorizedError);
		});

		it("should throw not authorized error when trying to delete reminder that does not belong to user", async () => {
			const reqDeleteReminder = Object.assign({}, req, {
				user: {
					id: 123456
				},
				params: {
					id: 1
				}
			});

			await assertThrowsAsync(reminderRoutes.deleteReminder.bind(this, reqDeleteReminder, res), NotAuthorizedError);
		});

		it("should delete reminder on good request", async () => {
			// check that reminder exists before requesting delete to ensure db state changes
			const REMINDER_ID = 1;
			let reminder = await knex("reminders")
				.where("id", REMINDER_ID)
				.first();

			assert.equal(reminder.id, REMINDER_ID);

			const reqDeleteReminder = Object.assign({}, req, {
				params: {
					id: REMINDER_ID
				}
			});

			await reminderRoutes.deleteReminder(reqDeleteReminder, res);

			reminder = await knex("reminders")
				.where("id", REMINDER_ID)
				.first();

			assert.equal(reminder, undefined);
		});
	});
});