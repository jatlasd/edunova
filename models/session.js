import { Schema, model, models } from "mongoose";

const SessionSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    behaviors: [{
        behaviorDetails: {
            type: Schema.Types.ObjectId,
            ref: 'Behavior'
        },
        behavior: {
            type: String,
            required: true
        },
    }]

})

const Session = models.Session || model('Session', SessionSchema);

export default Session;