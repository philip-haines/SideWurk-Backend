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
};
