const { ObjectID } = require("mongodb");

module.exports = {
	createRestaurant: async (_, { title }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please sign in");
		} else {
			const newRestaurant = {
				title,
				userIds: [user._id],
			};

			const result = await database
				.collection("Restaurant")
				.insertOne(newRestaurant);
			return result.ops[0];
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
