const { ApolloServer } = require("apollo-server");
const { MongoClient } = require("mongodb");

const { getUserFromToken } = require("../graphQl/Mutations/user");

const typeDefs = require("../graphQl/typeDefs");
const { resolvers } = require("../graphQl/resolver");

const dotenv = require("dotenv");
dotenv.config();

const { DB_URI, DB_NAME } = process.env;

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
