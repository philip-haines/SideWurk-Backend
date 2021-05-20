const { signUp, signIn } = require("./user");
const {
	addUserToRestaurant,
	createRestaurant,
	updateRestaurant,
} = require("./restaurant");

const {
	createTaskList,
	updateTaskList,
	deleteTaskList,
} = require("./taskList");
const { createTask, updateTask, deleteTask } = require("./task");
const { createBlock, updateBlock, deleteBlock } = require("./block");

module.exports = {
	Mutation: {
		signUp,
		signIn,

		createRestaurant,
		addUserToRestaurant,
		updateRestaurant,

		createTaskList,
		updateTaskList,
		deleteTaskList,

		createTask,
		updateTask,
		deleteTask,

		createBlock,
		updateBlock,
		deleteBlock,
	},
};
