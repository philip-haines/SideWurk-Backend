const { ApolloServer } = require("apollo-server");
const { MongoClient, ObjectID } = require("mongodb");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const typeDefs = require("../graphQl/typeDefs");
const { signUp, signIn } = require("../graphQl/Mutations/user");
const {
	addUserToRestaurant,
	createRestaurant,
} = require("../graphQl/Mutations/restaurant");
const {
	myRestaurants,
	getRestaurant,
} = require("../graphQl/Queries/restaurant");
const { myTaskLists, getTaskList } = require("../graphQl/Queries/taskList");
const { createTaskList } = require("../graphQl/Mutations/taskList");
const { getUsers } = require("../graphQl/Queries/users");
dotenv.config();

const { DB_URI, DB_NAME, JWT_SECRET } = process.env;

const getUserFromToken = async (token, database) => {
	if (!token) {
		return null;
	} else {
		const tokenData = jwt.verify(token, JWT_SECRET);
		if (!tokenData.id) {
			return null;
		} else {
			const user = await database
				.collection("Users")
				.findOne({ _id: ObjectID(tokenData.id) });
			return user;
		}
	}
};

const resolvers = {
	Query: {
		myRestaurants,
		getRestaurant,
		myTaskLists,
		getUsers,
		getTaskList,
	},

	Mutation: {
		signUp,
		signIn,

		createRestaurant,
		addUserToRestaurant,

		createTaskList,
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

		createTask: async (_, { content, blockId }, { database, user }) => {
			if (!user) {
				throw new Error("Authentication Error. Please sign in");
			} else {
				const newTask = {
					blockId: ObjectID(blockId),
					content,
					isComplete: false,
				};

				const result = await database
					.collection("Task")
					.insertOne(newTask);
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
	},

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

const start = async () => {
	const client = new MongoClient(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await client.connect();
	const database = client.db(DB_NAME);

	const context = {
		database,
	};

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		context: async ({ req }) => {
			const user = await getUserFromToken(
				req.headers.authorization,
				database
			);
			return {
				database,
				user,
			};
		},
	});

	server.listen().then(({ url }) => {
		console.log(`🚀  Server ready at ${url}`);
	});
};

start();
