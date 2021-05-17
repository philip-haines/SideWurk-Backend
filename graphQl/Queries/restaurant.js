const { ObjectID } = require("mongodb");

module.exports = {
	myRestaurants: async (_, __, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please sign in");
		} else {
			const restaurants = await database
				.collection("Restaurant")
				.find({ userIds: user._id })
				.toArray();
			return restaurants;
		}
	},

	getRestaurant: async (_, { id }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			return await database
				.collection("Restaurant")
				.findOne({ _id: ObjectID(id) });
		}
	},
};
