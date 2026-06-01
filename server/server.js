import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Interview from "./models/Interview.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Interview API Running");
});

mongoose.connect(
    process.env.MONGO_URI
)
    .then(() => {

        console.log(
            "MongoDB Connected"
        );

    })
    .catch((error) => {

        console.log(error);

    });

app.post(
    "/api/interview/save",
    async (req, res) => {

        try {

            const interview =
                await Interview.create({

                    candidateName:
                        req.body.candidateName,

                    answers:
                        req.body.answers

                });

            res.json({
                success: true,
                interview
            });

        }
        catch (error) {

            console.log(error);

            res.status(500).json({
                success: false
            });

        }

    }
);

app.get(
    "/api/interview/all",
    async (req, res) => {

        try {

            const interviews =
                await Interview.find();

            res.json(interviews);

        }
        catch (error) {

            console.log(error);

            res.status(500).json({
                success: false
            });

        }

    }
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server Running On ${PORT}`
    );

});