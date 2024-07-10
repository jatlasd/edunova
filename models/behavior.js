import { Schema, model, models } from "mongoose";

const BehaviorSchema = new Schema({
  behavior: {
    type: String,
    required: true
  }
}, { collection: 'Behavior' }); 

const Behavior = models.Behavior || model('Behavior', BehaviorSchema);

export default Behavior;