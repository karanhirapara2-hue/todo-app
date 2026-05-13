import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
     profilePicture: {
      type: String,
       default:null,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      default: '69ef2a4ada34aed37b8cd1a6'
    },
    is_banned:{
      type: Boolean,
      default:false
    },
    parentUser:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null
    },
    access:[{
    type:String
    }],
    credentialMail:{
    type:String
    },
    credentialPassword:{
    type:String
    },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// 🔐 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔑 Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;