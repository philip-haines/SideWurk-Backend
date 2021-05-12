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

	addUserToRestaurant: async (
		_,
		{ restaurantId, userId },
		{ database, user }
	) => {
		if (!user) {
			throw new Error("Authentication Error. Please log in");
		} else {
			const restaurant = await database
				.collection("Restaurant")
				.findOne({ _id: ObjectID(restaurantId) });
			if (!restaurant) {
				return restaurant;
			} else {
				const foundUser = restaurant.userIds.find(
					(databaseId) => databaseId.toString() === userId.toString()
				);
				if (!foundUser) {
					await database.collection("Restaurant").updateOne(
						{ _id: ObjectID(restaurantId) },
						{
							$push: {
								userIds: ObjectID(userId),
							},
						}
					);
					restaurant.userIds.push(ObjectID(userId));
					return restaurant;
				} else {
					return restaurant;
				}
			}
		}
	},
};
