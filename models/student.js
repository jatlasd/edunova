import { Schema, model, models } from "mongoose";

const StudentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  behaviors: [{
      behavior: String,
      description: String,
  }],
  sessions: [{
    type: Schema.Types.ObjectId,
    ref: 'Session'
  }]
});

const Student = models.Student || model('Student', StudentSchema);

export default Student;