const { ApolloServer } = require("apollo-server");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const typeDefs = require("../graphQl/typeDefs");
const { Query } = require("../graphQl/Queries/query");
const { Mutation } = require("../graphQl/Mutations/mutation");
const { getUserFromToken } = require("../graphQl/Mutations/user");

const {
	User,
	Restaurant,
	TaskList,
	Block,
	Task,
} = require("../graphQl/typeResolvers");
dotenv.config();

const { DB_URI, DB_NAME } = process.env;

const resolvers = {
	Query,
	Mutation,

	User,
	Restaurant,
	TaskList,
	Block,
	Task,
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
