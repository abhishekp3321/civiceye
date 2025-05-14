import mongoose from "mongoose";

const feedbackschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        require: true
    },
    description: {
        type: String,
        require: true
    },
    timestamp: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
    }
});

const feedback = mongoose.model("feedback", feedbackschema);
export default feedback;