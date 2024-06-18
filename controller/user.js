const User = require("../models/users");
const bcrypt = require("bcryptjs");

exports.signupUser = async (req, res) => {
    try {
        var user = req.body
        var usr = new User(user);
        const token = await usr.generateAuthToken();
        await usr.save();
        res.status(201).json({ token, message: "User Sign Up Succesful" });

    } catch (e) {
        console.log(e)
        res.status(404).json(e);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const password = req.body.password;
        const email = req.body.email;

        const user = await User.findOne({ email }, { _id: 0 });

        if (!user) res.status(404).json({ message: "User not found" });
        else {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const token = await user.generateAuthToken();

                res
                    .status(200)
                    .json({ token, user: { name: user.name, email: user.email }, message: "Login Successful" });
            } else {
                res.status(400).json({ message: "Incorrect Credentials" });
            }
        }
    } catch (e) {
        console.log(e);
        res.status(404).json(e);
    }
};

exports.verifyUser = async (req, res) => {
    try {
        res.status(201).json({ user: req.user, message: "User Verified Succesfully" });
    } catch (e) {
        console.log(e)
        res.status(404).json(e);
    }
};

exports.updateUser = async (req, res) => {
    try {

        const user = await User.updateOne({ email: req.user.email }, req.body)
        res.status(201).json({ user, message: "Updated Your Account" });

    } catch (e) {
        console.log(e)
        res.status(404).json({ e, message: "The Data You Entered Already Exists" });
    }
}