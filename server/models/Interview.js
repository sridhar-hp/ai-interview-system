import mongoose from "mongoose";

const interviewSchema =
new mongoose.Schema({

    candidateName: {

        type: String,

        required: true

    },

    answers: [

        {

            question: String,

            answer: String

        }

    ],

    createdAt: {

        type: Date,

        default: Date.now

    }

});

const Interview =
mongoose.model(
    "Interview",
    interviewSchema
);

export default Interview;