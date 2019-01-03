var mongoose = require('mongoose');

const config = require('../helpers/config');
const {
    Schema
} = mongoose;

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, "can't be blank"],
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            trim: true,
            required: [true, "first name needed"]
        },
        middle: {
            type: String,
            trim: true,
            require: false
        },
        last: {
            type: String,
            trim : true,
            required: false
        }
    },
    year: {
        type: Number,
        required: [true, "Year of joining RAE required"]
    },
    role: {
        type: Number,
        default: config.ROLE.USER,
    },
    reset: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
    },
    mobile: {
        type: Number,
        trim: true
    },
    registrar : {
        type : String,
        required : true
    }
}, {
    timestamps: true
});

const User = mongoose.model('users', UserSchema);

module.exports = User;