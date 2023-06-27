const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcryptjs = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    password: {
        type: String,
        required: true,
        minLength: 5
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
      },
});

userSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('password')) {
        const saltRounds = 10
        this.password = await bcryptjs.hash(this.password, saltRounds);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function(password){
    return bcryptjs.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User