import { Schema, model, models} from "mongoose";

const DoingSchema = new Schema({
    text: String
})

const Doing = models.Doing || model('Doing', DoingSchema);

export default Doing;