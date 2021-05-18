const { ObjectID } = require("mongodb");

module.exports = {
	createTaskList: async (_, { title, restaurantId }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please sign in");
		} else {
			const newTaskList = {
				title,
				restaurantId: ObjectID(restaurantId),
			};
			console.log(newTaskList);
			const result = await database
				.collection("TaskList")
				.insertOne(newTaskList);

			console.log(result.ops[0]);
			return result.ops[0];
		}
	},

	updateTaskList: async (_, { id, title }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			const result = await database
				.collection("TaskList")
				.updateOne({ _id: ObjectID(id) }, { $set: { title } });
			return await database
				.collection("TaskList")
				.findOne({ _id: ObjectID(id) });
		}
	},

	deleteTaskList: async (_, { id }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			await database
				.collection("TaskList")
				.removeOne({ _id: ObjectID(id) });
			return true;
		}
	},
};
