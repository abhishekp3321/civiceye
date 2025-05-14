import express from "express"
import { feedbackupdate, getfeedback, postfeedback } from "../controller/feedbackcontroller.js"

const feedbackrouter = express.Router()

feedbackrouter.post('/post',postfeedback)
feedbackrouter.get('/get',getfeedback)
feedbackrouter.put('/update/:id',feedbackupdate)

export default feedbackrouter