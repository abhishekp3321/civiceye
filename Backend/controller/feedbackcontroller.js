import mongoose from "mongoose";
import feedback from "../models/feedbackschema.js";
import task from "../models/Task.js";


export async function postfeedback(req, res) {
    try{
        let userid = req.body.userid;
        let { description,timestamp }=req.body;
        if(!userid||!mongoose.Types.ObjectId.isValid(userid)){
            return res.status(400).json({ message: "Invalid User ID format" });

        }
        let userexists = await task.findOne({_id: userid})
        if(!userexists){
            return res.status(404).json({ message: "User Not Found" });

        }
        const response =await feedback.create({userid,description,timestamp})
        return res.status(200).json({message: "Feedback Posted", response});
    }
    catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Error Occured" });
    }
}
export async function getfeedback(req, res) {
    try {
        const feedbacks = await feedback.find()
           

        if (!feedbacks.length) {
            return res.status(404).json({ message: "No feedback found" });
        }

        // Format the response for table-like structure
const formattedFeedback = await Promise.all(feedbacks.map(async fb => {
    const user = await task.findById(fb.userid).select("username email");
    return {
        _id: fb._id,
        userid: fb.userid._id,
        username: user ? user.username : "Unknown"   ,
        email: user ? user.email : "Unknown",
        description: fb.description,
        timestamp: fb.timestamp,
        status: fb.status
    };
}));

        return res.status(200).json({ feedbacks: formattedFeedback });

    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Error Occurred" });
    }
}
export async function feedbackupdate(req,res){
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || !status) {
            return res.status(400).json({ message: "Please provide feedback ID and status" });
        }
        const updatedFeedback = await feedback.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }
        return res.status(200).json({ message: "Feedback updated", updatedFeedback });
    } catch (error) {
        console.error("Internal Server Error", error);
        return res.status(500).json({ message: "Error Occurred" });
    }
}
