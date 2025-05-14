import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    complaint: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    proof: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    createdAt: {

        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending","Approved", "Resolved", "Rejected"],
        default: "Pending"
    },
    resolvedAt: {
        type: String,
        required: false
    },
})
const complaint = mongoose.model('complaint', complaintSchema)
export default complaint;
