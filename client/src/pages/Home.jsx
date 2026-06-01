import { useRef } from "react";
import { useState } from "react";
import axios from "axios";

function Home() {

    const [
        candidateName,
        setCandidateName
    ] = useState("");

    const [
        interviews,
        setInterviews
    ] = useState([]);

    const questions = [

        "Tell me about yourself",

        "What is React?",

        "What is MongoDB?",

        "Explain useState Hook",

        "Why should we hire you?"

    ];

    const [
        currentQuestionIndex,
        setCurrentQuestionIndex
    ] = useState(0);

    const [
        answer,
        setAnswer
    ] = useState("");

    const [
        answers,
        setAnswers
    ] = useState([]);



    const videoRef = useRef();
    const mediaRecorderRef = useRef();

    const chunksRef = useRef([]);

    const recordedVideoRef = useRef();

    const startCamera = async () => {

        try {

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });

            videoRef.current.srcObject = stream;

        }
        catch (error) {

            console.log(error);

            alert(
                "Camera or microphone permission denied"
            );

        }

    };

    const getInterviews =
        async () => {

            try {

                const response =
                    await axios.get(
                        "https://ai-interview-system-lc2w.onrender.com/api/interview/all"
                    );

                setInterviews(
                    response.data
                );

            }
            catch (error) {

                console.log(error);

            }

        };

    const startRecording = () => {

        const stream = videoRef.current.srcObject;

        if (!stream) {

            alert("Please start camera first");

            return;

        }

        const mediaRecorder =
            new MediaRecorder(stream);

        mediaRecorderRef.current = mediaRecorder;

        chunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {

            if (event.data.size > 0) {

                chunksRef.current.push(event.data);

            }

        };

        mediaRecorder.start();

        alert("Recording Started");

    };

    const stopRecording = () => {

        mediaRecorderRef.current.stop();

        mediaRecorderRef.current.onstop = () => {

            const blob = new Blob(
                chunksRef.current,
                {
                    type: "video/webm"
                }
            );

            const videoURL =
                URL.createObjectURL(blob);

            recordedVideoRef.current.src =
                videoURL;

            alert("Recording Saved");

        };

    };

    const saveInterview = async () => {

        if (!candidateName.trim()) {

            alert("Enter Candidate Name");

            return;
        }

        try {

            await axios.post(
                "https://ai-interview-system-lc2w.onrender.com/api/interview/save",
                {
                    candidateName,
                    answers
                }
            );

            alert("Interview Saved");
            setCandidateName("");
            setAnswers([]);
            setCurrentQuestionIndex(0);
            setAnswer("");

        }
        catch (error) {

            console.log(error);

        }

    };

    const nextQuestion = () => {

        const updatedAnswers = [

            ...answers,

            {
                question:
                    questions[
                    currentQuestionIndex
                    ],

                answer
            }

        ];

        setAnswers(
            updatedAnswers
        );

        if (

            currentQuestionIndex <
            questions.length - 1

        ) {

            setCurrentQuestionIndex(

                currentQuestionIndex + 1

            );

            setAnswer("");

        }
        else {

            alert(
                "Interview Completed"
            );

            console.log(
                updatedAnswers
            );

        }

    };
    const totalQuestions =
        interviews.reduce(
            (total, item) =>
                total + item.answers.length,
            0
        );

    return (

        <div className="container mt-5">
            <div className="card shadow-sm p-4 mb-4">

                <h4 className="mb-3">

                    Candidate Information

                </h4>

                <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Candidate Name"
                    value={candidateName}
                    onChange={(e) =>
                        setCandidateName(
                            e.target.value
                        )
                    }
                />

            </div>

            <div className="text-center mb-5">

                <h1 className="display-4 fw-bold">

                    AI Video Interview System

                </h1>

                <p className="text-muted">

                    Automated Candidate Screening Platform

                </p>

            </div>

            <div className="card shadow-sm p-4 mb-4">

                <h3>

                    Question
                    {
                        currentQuestionIndex + 1
                    }

                </h3>

                <h5>

                    {
                        questions[
                        currentQuestionIndex
                        ]
                    }

                </h5>

            </div>
            <textarea

                className="form-control"

                rows="4"

                placeholder="Enter your answer"

                value={answer}

                onChange={(e) =>
                    setAnswer(
                        e.target.value
                    )
                }

            />

            <button

                className="btn btn-info mt-3"

                onClick={nextQuestion}

            >

                Next Question

            </button>

            <button
                className="btn btn-primary ms-2 mt-3"
                onClick={startCamera}
            >
                Start Interview

            </button>

            <button
                className="btn btn-success ms-2 mt-3"
                onClick={startRecording}
            >
                Start Recording
            </button>

            <button
                className="btn btn-danger ms-2 mt-3"
                onClick={stopRecording}
            >
                Stop Recording
            </button>

            <div className="card shadow-sm p-4 mt-4">

                <h3 className="mb-4 text-center">

                    Interview Recording

                </h3>

                <h5>
                    Live Camera
                </h5>

                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-100"
                />

                <h5 className="mt-4">
                    Recorded Video
                </h5>

                <video
                    ref={recordedVideoRef}
                    controls
                    width="600"
                    height="400"
                    style={{
                        border: "2px solid green"
                    }}
                />

            </div>

            <button
                className="btn btn-warning ms-2"
                onClick={saveInterview}
            >
                Save Session
            </button>

            <button
                className="btn btn-dark ms-2"
                onClick={getInterviews}
            >
                View Interviews
            </button>

            <h3 className="mt-4">

                Interview Answers

            </h3>

            {
                answers.map(

                    (item, index) => (

                        <div
                            key={index}
                            className="border p-2 mb-2"
                        >

                            <strong>

                                {item.question}

                            </strong>

                            <p>

                                {item.answer}

                            </p>

                        </div>

                    )

                )
            }

            <div className="row mt-4 mb-4">

                <div className="col-md-4">

                    <div className="card shadow-sm text-center p-3">

                        <h5>Total Interviews</h5>

                        <h2>
                            {interviews.length}
                        </h2>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow-sm text-center p-3">

                        <h5>Total Answers</h5>

                        <h2>
                            {totalQuestions}
                        </h2>

                    </div>

                </div>

                <div className="col-md-4">

                    <div className="card shadow-sm text-center p-3">

                        <h5>Current Question</h5>

                        <h2>
                            {currentQuestionIndex + 1}
                        </h2>

                    </div>

                </div>

            </div>

            <h2 className="mt-5 mb-4 text-center">
                Interview History
            </h2>

            {
                interviews.map((item) => (

                    <div
                        key={item._id}
                        className="card p-3 mt-3"
                    >

                        <h4>
                            {item.candidateName}
                        </h4>

                        {
                            item.answers?.map(
                                (answer, index) => (

                                    <div key={index}>

                                        <strong>
                                            {answer.question}
                                        </strong>

                                        <p>
                                            {answer.answer}
                                        </p>

                                    </div>

                                )
                            )
                        }

                    </div>

                ))
            }

        </div>

    );

}

export default Home;