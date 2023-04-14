const pushops = require("../index.js");

describe("getWhosWorking Tests", () => {
	// wwt = whos working today
	test("Get Whos Working Today", async () => {
		const response = await pushops.getWhosWorkingToday(
			process.env.PUSHOPSADDR,
			process.env.PUSHOPSUSER,
			process.env.PUSHOPSPASS
		);

		expect(response).toEqual(expect.arrayContaining([expect.objectContaining({})]));
	});
});
