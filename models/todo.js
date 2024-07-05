import { Schema, model, models} from "mongoose";

const TodoSchema = new Schema({
    type: String,
    item: String,
    description: String,
    status: String,
    path: String,
    user: {
        id: String,
        name: String,
        role: String
    },
    notes: String
})

const Todo = models.Todo || model('Todo', TodoSchema);

export default Todo;