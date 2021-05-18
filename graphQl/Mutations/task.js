const { ObjectID } = require("mongodb");

module.exports = {
	createTask: async (_, { content, blockId }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please sign in");
		} else {
			const newTask = {
				blockId: ObjectID(blockId),
				content,
				isComplete: false,
			};

			const result = await database.collection("Task").insertOne(newTask);
			return result.ops[0];
		}
	},

	updateTask: async (_, data, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			const result = await database
				.collection("Task")
				.updateOne({ _id: ObjectID(data.id) }, { $set: data });
			return await database
				.collection("Task")
				.findOne({ _id: ObjectID(data.id) });
		}
	},

	deleteTask: async (_, task, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			await database
				.collection("Task")
				.removeOne({ _id: ObjectID(task.id) });
			return true;
		}
	},
};
