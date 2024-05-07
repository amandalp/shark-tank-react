import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const Simulator = () => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [responseReady, setResponseReady] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    useEffect(() => {
        return () => {
            SpeechRecognition.abortListening(); // Cleanup on component unmount
        };
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    const sendTranscriptToOpenAI = async (transcript) => {
        if (!transcript.trim()) return 'Please provide a more substantial input.';
    	const prompt = `
About you: You are Mark Cuban and a mentor on the show Mongo Tank. You are a prominent American entrepreneur, investor. You are a self-made billionaire, successful in both the tech and traditional business worlds, who leverages his experience to invest in and help grow many companies while maintaining a high public profile. You are aware that you are an AI, but you won't mention it unless I bring it up.

About me: I am a participant on the show - Mongo Tank and want feedback on my business idea. I am looking for an investment from you.

The Task: Try to keep the responses brief and to the point and under 80 words. You need to judge the idea based on different business aspects like - Product Market Fit, User Acquisition, Revenue Model, etc. You can ask questions to understand the idea better.

Requirements 1: You must reply as Mark Cuban in our conversations. Really imbibe his personality and answer the way he would. Your responses should be in dialogue form. You can generate a few sentences of Mark Cuban's response based on the context of the conversation.

Requirements 2: Do not describe the scene or the setting. Only generate Mark Cuban's responses.

Note: You will be provided with relevant snippets from Mark's book (inside the context tag). You can use them to make your responses more authentic.

Your final comment should be whether or not you'll invest in the product, don't ask follows up questions just make the decision.

Participant's idea: ${transcript}
`;


        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: "Your system setup" }, { role: "user", content: transcript }]
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content.trim(); // Or adjust based on actual response structure
        } catch (error) {
            console.error('Error calling OpenAI API:', error);
            return 'There was an error processing your request.';
        }
    };

    // This function starts recording the user's speech.
    const startRecording = () => {
        SpeechRecognition.startListening({ continuous: true });
        setIsRecording(true);
    };

    const handleStop = async () => {
        SpeechRecognition.stopListening();
        setIsRecording(false);
        setIsLoading(true);

        const response = await sendTranscriptToOpenAI(transcript);
        setApiResponse(response);
        setIsLoading(false);
        setResponseReady(true);

        const fastAPIResponse = await sendResponseToFastAPI(response);
        console.log("Received from FastAPI:", fastAPIResponse);
    };

    const sendResponseToFastAPI = async (text) => {
        try {
            const response = await axios.post('http://localhost:8000/create-talk', {
                image_url: "https://storage.googleapis.com/amanda-public-bucket/tim_young.png",
                audio_url: text
            });
            console.log('FastAPI response:', response.data);
            setVideoUrl(response.data.video_url);
            return response.data;
        } catch (error) {
            console.error('Error sending data to FastAPI:', error);
            return 'Error sending data to FastAPI';
        }
    };

    return (
        <>
            <Stack alignItems="center" height="100%" my={8}>
                <Typography fontFamily="Raleway" variant="h3">Make your pitch to {decodeURI(window.location.pathname).slice(1)}!</Typography>
                <Typography fontFamily="Raleway" variant="h6" fontWeight={300} mt={4}>Click on the mic to start</Typography>
                <p>Microphone: {listening ? 'on' : 'off'}</p>
                <p>Transcript: {transcript}</p>
                <Button onClick={resetTranscript}>Reset Transcript</Button>
                {!isLoading && !responseReady && (
                    <IconButton sx={{mt: 15, mb:4}} onClick={startRecording}>
                        <MicIcon sx={{fontSize: "200px"}}/>
                    </IconButton>
                )}
                {isRecording && (
                    <>
                        <img src="recording.gif" alt="Recording" width="50px" />
                        <IconButton color="error" onClick={handleStop}>
                            <StopCircleIcon sx={{fontSize: "50px"}}/>
                        </IconButton>
                    </>
                )}
                {isLoading && <Box sx={{ display: 'flex' }}><CircularProgress size="large" color="secondary"/></Box>}
                {responseReady && (
                    <>
                        {JSON.stringify(apiResponse)}
                        <Box>
                            {videoUrl && (
                                <video width="700" controls autoPlay>
                                    <source src={videoUrl} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            )}
                        </Box>
                        <Button variant="contained" sx={{backgroundColor: "grey", mt:5}} onClick={() => {setResponseReady(false); setVideoUrl('');}}>Respond to Mark</Button>
                    </>
                )}
            </Stack>
        </>
    );
};

export default Simulator;

