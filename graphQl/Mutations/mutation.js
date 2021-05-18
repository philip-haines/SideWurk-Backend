const { signUp, signIn } = require("./user");
const { addUserToRestaurant, createRestaurant } = require("./restaurant");

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
