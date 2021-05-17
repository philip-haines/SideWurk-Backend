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
};
