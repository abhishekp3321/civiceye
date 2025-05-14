import mongoose from "mongoose";
import ComplaintModel from "../models/complaints.js";
import task from "../models/Task.js";

export const registerComplaint = async (req, res) => {
  try {
    const userid = req.body.userid;

    if (!userid || !mongoose.Types.ObjectId.isValid(userid)) {
      return res.status(404).json({ message: "Invalid User" });
    }


    let proof = req.file.path;
    const { description, complaint, location,
      createdAt } = req.body;
    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const newComplaint = await ComplaintModel.create({
      description,
      complaint,
      location,
      proof,
      userid,
      createdAt
    });

    return res.status(200).json({ message: "Complaint Registered", newComplaint });

  } catch (error) {
    console.error("Internal Server Error", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}


export const getComplaints = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters

    // ✅ Find complaints by `userId`
    const complaints = await ComplaintModel.find({ userid: id });
    // const updatedComplaints = complaints.map((comp) => ({
    //   ...comp._doc,
    //   proof: comp.proof ? `http://127.0.0.1:6262/uploads/${comp.proof}` : null,
    // }));

    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found" });
    }

    return res.status(200).json({ complaints });
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};




export const getallcomplaints = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the request parameters
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "User Id not provided" });
    }

    const user = await task.findById(id); // Ensure this is the correct model
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const complaints = await ComplaintModel.find();
    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found" });
    }

    return res.status(200).json(complaints); // ✅ Send response
  } catch (error) {
    console.error("Error fetching complaints:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const statusupdate = async (req, res) => {
  
  try {
      const { id } = req.params;
      const { status } = req.body;
      const selectedComplaint = await ComplaintModel.findById(id);
      if (!selectedComplaint) {
          return res.status(404).json({ message: "Complaint not found" });
      }
      if (status !== "Resolved" && status !== "Pending" && status !== "Rejected" && status !== "Approved") {
          return res.status(400).json({ message: "Invalid status" });
      }
      selectedComplaint.status = status;
      if (status === "Resolved") {
          selectedComplaint.resolvedAt = new Date().toISOString();
      } else {
          selectedComplaint.resolvedAt = null;
      }
      await selectedComplaint.save();
      return res.status(200).json({ message: "Complaint status updated", updatedComplaint: selectedComplaint });
  } catch (error) {
      console.error("Error updating complaint status:", error);
      return res.status(500).json({ message: "Internal Server Error" });
  }
};
export const statusfeed = async (req, res) => {
  try {
    const complaints = await ComplaintModel.find();
    if (!complaints.length) {
      return res.status(404).json({ message: "No complaints found" });
    }
    const totalcomplaints = complaints.length;
    const statuscount = complaints.reduce((acc, complaint) => {
      acc[complaint.status] = (acc[complaint.status] || 0) + 1;
      return acc;
    }, { Pending: 0, Approved: 0, Rejected: 0, Resolved: 0 });
    const categorystatus = complaints.reduce((acc, complaint) => {
      acc[complaint.complaint] = (acc[complaint.complaint] || 0) + 1;
      return acc;
    }, {});
    const last7dayscount= complaints.filter((complaint) => {
      const complaintDate = new Date(complaint.createdAt);  
      const sevendaysago = new Date();
      sevendaysago.setDate(sevendaysago.getDate() - 7);
      return complaintDate >= sevendaysago;
   ;
    }).length;
    const stats = {
     totalcomplaints,
      statuscount,
      categorystatus,
      last7dayscount,
  };
    return res.status(200).json(stats);
  } catch (error) {
    console.error("Error updating complaint status:", error);
    return res.status(500).json({ message: "Internal Server Error" });  
    
  }
};