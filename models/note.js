import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
    text: String
})

const Note = models.Note || model('Note', NoteSchema);

export default Note;