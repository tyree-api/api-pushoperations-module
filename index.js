const NodeCache = require("node-cache");
const Cache = new NodeCache();
const axios = require("axios");
const Logger = require("@tyree-api/api-logging-module");

const getUserData = async (baseurl, username, password) => {
	const response = await axios.post(
		baseurl + "/api/v1/ios/login",
		{
			userName: username,
			passWord: password,
		},
		{
			headers: {
				"User-Agent": "PushScheduler/132 CFNetwork/1408.0.1 Darwin/22.5.0",
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
	Cache.set(
		"login",
		{
			companyId: response.data.data[0].companyId,
			employeeId: response.data.data[0].userableId,
			token: response.data.token,
		},
		60 * 60
	);
	return response.data;
};

const getMySchedulesEndpoint = async (baseurl, companyId, employeeId, token) => {
	const response = await axios.get(
		`${baseurl}/api/v1/ios/getMySchedules?companyId=${companyId}&employeeId=${employeeId}&token=${token}}`,
		{
			headers: {
				"User-Agent": "PushScheduler/132 CFNetwork/1408.0.1 Darwin/22.5.0",
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		}
	);
	return response.data;
};

module.exports = {
	getSchedules: async (baseurl, username, password) => {
		const userData = Cache.get("login");
		if (userData) {
			Logger.cache("Using Cached Data");
			const response = await getMySchedulesEndpoint(
				baseurl,
				userData.companyId,
				userData.employeeId,
				userData.token
			);
			const schedules = response.mySchedules;

			const startTimes = [];

			for (const key in schedules) {
				if (schedules.hasOwnProperty(key)) {
					const schedule = schedules[key];
					startTimes.push({
						scheduled_start: schedule.scheduled_start_str,
						scheduled_end: schedule.scheduled_end_str,
					});
				}
			}

			return startTimes;
		} else {
			Logger.data("Fetching Data");
			const userData = await getUserData(baseurl, username, password);
			const response = await getMySchedulesEndpoint(
				baseurl,
				userData.data[0].companyId,
				userData.data[0].userableId,
				userData.token
			);
			const schedules = response.mySchedules;

			const startTimes = [];

			for (const key in schedules) {
				if (schedules.hasOwnProperty(key)) {
					const schedule = schedules[key];
					startTimes.push({
						scheduled_start: schedule.scheduled_start_str,
						scheduled_end: schedule.scheduled_end_str,
					});
				}
			}

			return startTimes;
		}
	},
};
