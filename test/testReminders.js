const assert = require("assert");
const knex = require("config/knex");

const seeder = require("seeds/seed");
const userSeeder = require("seeds/lib/seed_users");
const reminderSeeder = require("seeds/lib/seed_reminders");

const reminderRoutes = require("app/routes/reminders");

const req = {
	user: userSeeder.USER_1
};

const res = {
	responseCode: null,
	response: null,
	json: function (msg) {
		this.response = msg;
		return this;
	},
	statusCode: function (code) {
		this.responseCode = code;
		return this;
	}
};

describe("Reminder API", () => {
	beforeEach(async () => {
		await seeder.seed(knex);
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
	});

	describe("POST /reminders", () => {

	});

	describe("PUT /reminder/{id}", () => {

	});

	describe("DELETE /reminder/{id}", () => {

	});
});
