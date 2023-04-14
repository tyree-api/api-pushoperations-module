const pushops = require("../index.js");

describe("getSchedules Tests", () => {
	test("Get My Schedule", async () => {
		const response = await pushops.getSchedules(
			process.env.PUSHOPSADDR,
			process.env.PUSHOPSUSER,
			process.env.PUSHOPSPASS
		);

		expect(response).toEqual(expect.arrayContaining([expect.objectContaining({})]));
	});
});
