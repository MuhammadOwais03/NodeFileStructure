import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const { Schema } = mongoose;

const UserSchema = new Schema ({
    UserSchemaname: {
        type:'String',
        required: true,
        unique: true,
    },
    
    email: {
        type:'String',
        required: true,
        unique: true,
    },

    firstName: {
        type:'String',
        required: true,
    },

    lastName: {
        type:'String',
        required: true,
    },

    password: {
        type: 'String',
        required: 'true',
    },

    bio: {
        type: 'String'
    },

    profileImage: {
        type: 'String'
    },

    refreshToken: {
        type: 'String',
        default: null
    },

    userRole: {
        type: 'String',
        required: true
    }
    
})


UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };


