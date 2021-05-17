const { ObjectID } = require("mongodb");

module.exports = {
	myTaskLists: async (_, { restaurantId }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please sign in");
		} else {
			const taskLists = await database
				.collection("TaskList")
				.find({ restaurantId: ObjectID(restaurantId) })
				.toArray();
			return taskLists;
		}
	},
};
