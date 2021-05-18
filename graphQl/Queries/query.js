const { myRestaurants, getRestaurant } = require("./restaurant");
const { myTaskLists, getTaskList } = require("./taskList");
const { getUsers } = require("./users");

module.exports = {
	Query: {
		myRestaurants,
		getRestaurant,
		myTaskLists,
		getUsers,
		getTaskList,
	},
};
