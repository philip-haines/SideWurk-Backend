const { ObjectID } = require("mongodb");

module.exports = {
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
