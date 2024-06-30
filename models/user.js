import { Schema, model, models } from "mongoose";

const QuickNoteSchema = new Schema({
  behavior: String,
  notes: [String]
});

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    quickNotes: [QuickNoteSchema],
    sessions: [{
        type: Schema.Types.ObjectId,
        ref: 'Sessionn'
    }]
});

const User = models.User || model('User', UserSchema);
export default User;