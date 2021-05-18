const { ObjectID } = require("mongodb");

module.exports = {
	createBlock: async (_, { title, taskListId }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please sign in");
		} else {
			const newBlock = {
				title,
				taskListId: ObjectID(taskListId),
			};

			const result = await database
				.collection("Block")
				.insertOne(newBlock);
			return result.ops[0];
		}
	},

	updateBlock: async (_, { id, title }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			const result = await database
				.collection("Block")
				.updateOne({ _id: ObjectID(id) }, { $set: { title } });
			return await database
				.collection("Block")
				.findOne({ _id: ObjectID(id) });
		}
	},

	deleteBlock: async (_, block, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			await database
				.collection("Block")
				.removeOne({ _id: ObjectID(block.id) });
			return true;
		}
	},
};
