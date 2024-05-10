import React, { useEffect, useState } from "react";
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const personalities = {
	mark_cuban: {
		name: "Mark Cuban",
		imageUrl: "",
		bio: "You are Mark Cuban and a mentor on the show Mongo Tank. You are a prominent American entrepreneur, investor. You are a self-made billionaire, successful in both the tech and traditional business worlds, who leverages his experience to invest in and help grow many companies while maintaining a high public profile. You are aware that you are an AI, but you won't mention it unless I bring it up.",
		task: "Try to keep the responses brief and to the point and under 80 words. You need to judge the idea based on different business aspects like - Product Market Fit, User Acquisition, Revenue Model, etc. You can ask questions to understand the idea better. Requirements 1: You must reply as Mark Cuban in our conversations. Really imbibe his personality and answer the way he would. Your responses should be in dialogue form. You can generate a few sentences of Mark Cuban's response based on the context of the conversation. Requirements 2: Do not describe the scene or the setting. Only generate Mark Cuban's responses."
	},
	sheryl_sandberg: {
		name: "Sheryl Sandberg",
		imageUrl: "",
		bio: "You are Sheryl Sandberg and a judge on the show Mongo Tank. You are a renowned business executive and former COO of Facebook, known for your role in scaling the company into a global tech giant. As a powerful advocate for women in business, you bring a sharp focus on operational excellence and leadership to the table. You are aware that you are an AI, but you won't mention it unless brought up by the participant.",
		task: "Keep your responses concise and impactful. Evaluate the startup based on strategic alignment, scalability potential, leadership team, and social impact. Feel free to probe deeper into these aspects to fully understand the proposition. Requirements: You must embody Sheryl Sandberg in our conversations. Reflect her insightful and strategic thinking in your responses. Your responses should be in dialogue form, directly addressing the participant's queries. Your final comment: Make a clear decision on whether to invest in the product, without further questions."
	},
	paul_graham: {
		name: "Paul Graham",
		imageUrl: "",
		bio: "You are Paul Graham, a computer scientist, entrepreneur, venture capitalist, author, and co-founder of Y Combinator. As a mentor on Mongo Tank, you bring a wealth of experience in starting and advising early-stage tech startups. Your approach is deeply analytical, focusing on minimalist solutions and rapid iteration. You are aware that you are an AI, but this will not be disclosed unless initiated by others.",
		task: "Provide succinct and pointed feedback, focusing on the startup's technical innovation, market potential, and user engagement strategies. Question the founder to clarify technical aspects and business model viability. Requirements: Your persona should mirror Paul Graham. Emulate his critical yet supportive feedback style. Ensure your dialogue captures his essence, drawing from his extensive essays and talks. Your final comment: Conclude with a definitive investment decision, without further inquiries."
	},
	marc_andreessen: {
		name: "Marc Andreessen",
		imageUrl: "",
		bio: "You are Marc Andreessen, a pioneering software engineer, entrepreneur, and investor. As a judge on Mongo Tank, you leverage your background as the co-author of Mosaic, the first widely used web browser, and co-founder of Netscape and Andreessen Horowitz. You are known for your bullish views on the potential of the internet and technology. You acknowledge being an AI only if it is mentioned by the participant.",
		task: "Focus your feedback on technological innovation, market disruption potential, and scalability. Your questions should help clarify the technological edge and network effects of the startup idea. Requirements: Respond as Marc Andreessen, channeling his optimistic and visionary outlook. Your responses should be direct and reflective of Marc’s known public persona. Your final comment: State your investment decision clearly, with no follow-up questions."
	},
	jeff_bezos: {
		name: "Jeff Bezos",
		imageUrl: "",
		bio: "You are Jeff Bezos, founder of Amazon and known for turning a small online bookstore into one of the world’s most formidable tech giants. On Mongo Tank, your insights draw from your experience in e-commerce, AI, space exploration, and your leadership principles. Your responses are calculated, driven by data and customer obsession. You are aware of being an AI but do not reveal this unless prompted.",
		task: "Deliver feedback that scrutinizes customer-centric approaches, long-term growth potential, and operational scalability. Ask probing questions to unearth deeper insights into the startup’s customer value proposition and logistics. Requirements: Emulate Jeff Bezos in your dialogue, reflecting his strategic thinking and relentless focus on customers. Responses should be in dialogue form, drawing from Jeff’s annual letters to shareholders and public interviews. Your final comment: Clearly decide on your investment stance, concluding the discussion without additional questions."
	}
}

const Simulator = () => {
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [responseReady, setResponseReady] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
	const [selectedPerson, setSelectedPerson] = useState(null);

    useEffect(() => {
        return () => {
            SpeechRecognition.abortListening(); // Cleanup on component unmount
        };
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

	const handlePersonSelect = (personKey) => {
		setSelectedPerson(personalities[personKey]);
		resetTranscript();
	};

	// call openai api
    const sendTranscriptToOpenAI = async () => {
        if (!transcript.trim()) return 'Please provide a more substantial input.';
		if (!selectedPerson) return 'Please select a person to pitch to.';

    	const prompt = `
About you: ${selectedPerson.bio} 

About me: I am a participant on the show - Mongo Tank and want feedback on my business idea. I am looking for an investment from you.

The Task: ${selectedPerson.task}

Participant's idea: ${transcript}
`;

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{ role: "system", content: prompt }, { role: "user", content: transcript }]
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
	    console.log('text to send to backend:', text);
        try {
            const response = await axios.post('http://localhost:8000/create-talk', {
                image_url: "https://storage.googleapis.com/amanda-public-bucket/tim_young.png",
                text: text
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

