const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const { JWT_SECRET } = process.env;

const getToken = (user) => {
	return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30 days" });
};

module.exports = {
	signUp: async (_, { input }, { database }) => {
		const hashedPassword = bcrypt.hashSync(input.password);
		const newUser = {
			...input,
			password: hashedPassword,
		};

		const result = await database.collection("Users").insertOne(newUser);
		const user = result.ops[0];
		return {
			user,
			token: getToken(user),
		};
	},

	signIn: async (_, { input }, { database }) => {
		const user = await database
			.collection("Users")
			.findOne({ email: input.email });
		if (!user) {
			throw new Error("Invalid Credentials");
		} else {
			const isPasswordCorrect = bcrypt.compareSync(
				input.password,
				user.password
			);
			if (!isPasswordCorrect) {
				throw new Error("Invalid Credentials");
			} else {
				return {
					user,
					token: getToken(user),
				};
			}
		}
	},
};
