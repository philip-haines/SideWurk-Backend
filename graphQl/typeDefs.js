const { gql } = require("apollo-server");

module.exports = gql`
	type Query {
		myRestaurants: [Restaurant]
		myTaskLists(restaurantId: ID!): [TaskList]
		getTaskList(id: ID!): TaskList!
		getUsers(input: GetUserSearch): [User]
		getRestaurant(id: ID!): Restaurant!
	}

	type Mutation {
		signUp(input: SignUpInput!): AuthenticateUser!
		signIn(input: SignInInput!): AuthenticateUser!

		createRestaurant(title: String!): Restaurant!
		addUserToRestaurant(restaurantId: ID!, userId: ID!): Restaurant!

		createTaskList(restaurantId: ID!, title: String!): TaskList!
		updateTaskList(id: ID!, title: String!): TaskList!
		deleteTaskList(id: ID!): Boolean!
		addUserToTaskList(taskListId: ID!, userId: ID!): TaskList!

		createTask(content: String!, blockId: ID!): Task!
		updateTask(id: ID!, content: String, isComplete: Boolean): Task!
		deleteTask(id: ID!): Boolean!

		createBlock(title: String!, taskListId: ID!): Block!
		updateBlock(id: ID!, title: String!): Block!
		deleteBlock(id: ID!): Boolean!
	}

	input SignUpInput {
		email: String!
		password: String!
		name: String!
		avatar: String
		role: String
	}

	input SignInInput {
		email: String!
		password: String!
	}

	input GetUserSearch {
		text: String
	}

	type AuthenticateUser {
		user: User!
		token: String!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		avatar: String
		role: String
	}

	type Restaurant {
		id: ID!
		title: String!

		users: [User!]!
		taskLists: [TaskList!]!
	}

	type TaskList {
		id: ID!
		title: String!

		users: [User!]!
		blocks: [Block!]!

		restaurant: Restaurant!
	}

	type Block {
		id: ID!
		title: String!
		progress: Float!

		taskList: TaskList!
		tasks: [Task!]!
	}

	type Task {
		id: ID!
		content: String!
		isComplete: Boolean!

		block: Block!
	}
`;
