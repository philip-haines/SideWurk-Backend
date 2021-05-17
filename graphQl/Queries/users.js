module.exports = {
	getUsers: async (_, { input }, { database, user }) => {
		if (!user) {
			throw new Error("Authentication Error. Please sign in");
		} else {
			if (input.text === "") {
				return [];
			} else {
				const foundUsers =
					(await database.collection("Users").find({
						email: { $regex: input.text, $options: "i" },
					})) ||
					(await database.collection("Users").find({
						name: { $regex: input.text, $options: "i" },
					}));
				return foundUsers ? foundUsers.toArray() : [];
			}
		}
	},
};
