import { Schema, model, models } from "mongoose";


const SessionSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
      },
    createdDate: {
        type: String
    },
    finishedDate: {
        type: String
    },
    scheduledDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending',
        required: true
    },
    staff: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    behaviors: [{
        behavior: {
            type: String,
        },
        count: {
            type: Number,
            default: 0
        },
        timestamps: [{
            time: {
                type: String
            },
            notes: {
                type: String
            }
        }],

    }],
    notes: {
        type: String
    }

})

const Session = models.Session || model('Session', SessionSchema);

export default Session;