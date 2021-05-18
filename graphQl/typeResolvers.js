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

	TaskList: {
		id: ({ _id, id }) => _id || id,
		users: async ({ userIds }, _, { database }) =>
			Promise.all(
				userIds.map((userId) =>
					database.collection("Users").findOne({ _id: userId })
				)
			),

		blocks: async ({ _id }, _, { database }) =>
			await database
				.collection("Block")
				.find({ taskListId: ObjectID(_id) })
				.toArray(),

		restaurant: async ({ restaurantId }, _, { database }) => {
			return await database
				.collection("Restaurant")
				.findOne({ _id: ObjectID(restaurantId) });
		},
	},

	Block: {
		id: ({ _id, id }) => _id || id,

		progress: async ({ _id }, _, { database }) => {
			const tasks = await database
				.collection("Task")
				.find({ blockId: ObjectID(_id) })
				.toArray();
			const completed = tasks.filter((task) => task.isComplete);
			if (tasks.length === 0) {
				return 0;
			} else {
				const result = 100 * (completed.length / tasks.length);
				return result;
			}
		},
		taskList: async ({ taskListId }, _, { database }) => {
			return await database
				.collection("TaskList")
				.findOne({ _id: ObjectID(taskListId) });
		},
		tasks: async ({ _id }, _, { database }) =>
			await database
				.collection("Task")
				.find({ blockId: ObjectID(_id) })
				.toArray(),
	},

	Task: {
		id: ({ _id, id }) => _id || id,
		block: async ({ blockId }, _, { database }) => {
			return await database
				.collection("Block")
				.findOne({ _id: ObjectID(blockId) });
		},
	},
};
