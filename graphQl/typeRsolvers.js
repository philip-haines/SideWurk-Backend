const { ObjectID } = require("mongodb");

module.exports = {
	User: {
		id: ({ _id, id }) => _id || id,
	},

	Restaurant: {
		id: ({ _id, id }) => _id || id,
		users: async ({ userIds }, _, { database }) =>
			Promise.all(
				userIds.map((userId) =>
					database.collection("Users").findOne({ _id: userId })
				)
			),

		taskLists: async ({ _id }, _, { database }) =>
			await database
				.collection("TaskList")
				.find({ restaurantId: ObjectID(_id) })
				.toArray(),
	},
};
