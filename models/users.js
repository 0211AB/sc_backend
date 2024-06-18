const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is Required']
    },
    password: {
        type: String,
        required: [true, 'Password is Required'],
        minlength: 8,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        required: [true, 'Email is Required'],
        unique: true,
        validate: {
            validator: async function (value) {
                const count = await this.constructor.countDocuments({ email: value });
                return count === 0;
            },
            message: '"Email Already Exists"',
        },
    },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            },
        },
    ],
});

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.generateAuthToken = async function () {
    try {
        if (this.tokens.length > 1) this.tokens.splice(0, 1);
        const token = jwt.sign({ email: this.email }, process.env.JWT_SECRET_KEY, { expiresIn: '30d' });
        this.tokens.push({ token: token });
        return token;
    } catch (e) {
        return e;
    }
};

const User = new mongoose.model("user", UserSchema);

module.exports = User;