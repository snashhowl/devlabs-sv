import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  user: mongoose.Schema.Types.ObjectId;
  dueDate: Date;
  subtasks: mongoose.Schema.Types.ObjectId;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dueDate: { type: Date, required: false },
  subtasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
});

export default mongoose.model<ITask>("Task", TaskSchema);
