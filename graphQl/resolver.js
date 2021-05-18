const {
	User,
	Restaurant,
	TaskList,
	Block,
	Task,
} = require("../graphQl/typeResolvers");

const { Query } = require("../graphQl/Queries/query");
const { Mutation } = require("../graphQl/Mutations/mutation");

module.exports = {
	resolvers: {
		Query,
		Mutation,

		User,
		Restaurant,
		TaskList,
		Block,
		Task,
	},
};
