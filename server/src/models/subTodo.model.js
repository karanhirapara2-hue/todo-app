import mongoose from "mongoose";

const subTodoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [100, "Title is too long"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description is too long"],
      default: "",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
     type: Date,
     default: Date.now
    },
    priority:{
     type:String,
     default:"EASY"
    },
    parentTodoId:{
    type: mongoose.Schema.Types.ObjectId,
     ref:"Todo"  
    },
    
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const subTodo = mongoose.model("subTodo", subTodoSchema);
export default subTodo;