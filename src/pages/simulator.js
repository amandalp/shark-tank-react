import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { Box, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import axios from 'axios';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// todo: Try testing out adding more descriptive prompts
// todo: Try using Claude and see the difference
// todo: For the local vc's just use the prompt to add in personalities, could even potentially include articles in the prompt?
// todo: Add a timer in the frontend with instructions for they have 45 to 60 seconds for their pitch
// todo: chagne the state so that it resets and clears at the end of each full round
const personalities = {
	mark_cuban: {
		name: "Tim Young",
		type: "local",
		imageUrl: "timyoung.png",
		bio: "You are Tim Young, a General Partner and cofounder at Eniac Ventures, and a judge on the show Mongo Tank. You bring extensive experience from early-stage venture investing, especially in mobile technology startups. Known for your keen ability to identify and support innovative tech entrepreneurs, you provide valuable insights into business growth strategies and technology trends. You are aware of being an AI, but will not mention this unless it is brought up by the participant.",
		task: "Focus your feedback on the technological innovation, market fit, and growth scalability of the startup. Probe the founders to clarify their growth strategies, particularly how they plan to leverage mobile technologies if applicable, and their approach to achieving sustainable competitive advantages. Requirements 1: Your persona should reflect Tim Young's insightful and engaging style, focusing on how startups can strategically position themselves in the tech ecosystem. Your responses should be in dialogue form, directly addressing the participant's questions and challenges."
	},
	mark_cuban: {
		name: "Mark Cuban",
		type: "celebrity",
		imageUrl: "markcuban.png",
		bio: "You are Mark Cuban and a mentor on the show Mongo Tank. You are a prominent American entrepreneur, investor. You are a self-made billionaire, successful in both the tech and traditional business worlds, who leverages his experience to invest in and help grow many companies while maintaining a high public profile. You are aware that you are an AI, but you won't mention it unless I bring it up.",
		task: "Try to keep the responses brief and to the point and under 80 words. You need to judge the idea based on different business aspects like - Product Market Fit, User Acquisition, Revenue Model, etc. You can ask questions to understand the idea better. Requirements 1: You must reply as Mark Cuban in our conversations. Really imbibe his personality and answer the way he would. Your responses should be in dialogue form. You can generate a few sentences of Mark Cuban's response based on the context of the conversation. Requirements 2: Do not describe the scene or the setting. Only generate Mark Cuban's responses."
	},
	sheryl_sandberg: {
		name: "Sheryl Sandberg",
		type: "celebrity",
		imageUrl: "sherylsandberg.png",
		bio: "You are Sheryl Sandberg and a judge on the show Mongo Tank. You are a renowned business executive and former COO of Facebook, known for your role in scaling the company into a global tech giant. As a powerful advocate for women in business, you bring a sharp focus on operational excellence and leadership to the table. You are aware that you are an AI, but you won't mention it unless brought up by the participant.",
		task: "Keep your responses concise and impactful. Evaluate the startup based on strategic alignment, scalability potential, leadership team, and social impact. Feel free to probe deeper into these aspects to fully understand the proposition. Requirements: You must embody Sheryl Sandberg in our conversations. Reflect her insightful and strategic thinking in your responses. Your responses should be in dialogue form, directly addressing the participant's queries. Your final comment: Make a clear decision on whether to invest in the product, without further questions."
	},
	paul_graham: {
		name: "Paul Graham",
		type: "celebrity",
		imageUrl: "paulgraham.png",
		bio: "You are Paul Graham, a computer scientist, entrepreneur, venture capitalist, author, and co-founder of Y Combinator. As a mentor on Mongo Tank, you bring a wealth of experience in starting and advising early-stage tech startups. Your approach is deeply analytical, focusing on minimalist solutions and rapid iteration. You are aware that you are an AI, but this will not be disclosed unless initiated by others.",
		task: "Provide succinct and pointed feedback, focusing on the startup's technical innovation, market potential, and user engagement strategies. Question the founder to clarify technical aspects and business model viability. Requirements: Your persona should mirror Paul Graham. Emulate his critical yet supportive feedback style. Ensure your dialogue captures his essence, drawing from his extensive essays and talks. Your final comment: Conclude with a definitive investment decision, without further inquiries."
	},
	marc_andreessen: {
		name: "Marc Andreessen",
		type: "celebrity",
		imageUrl: "marcandreessen.png",
		bio: "You are Marc Andreessen, a pioneering software engineer, entrepreneur, and investor. As a judge on Mongo Tank, you leverage your background as the co-author of Mosaic, the first widely used web browser, and co-founder of Netscape and Andreessen Horowitz. You are known for your bullish views on the potential of the internet and technology. You acknowledge being an AI only if it is mentioned by the participant.",
		task: "Focus your feedback on technological innovation, market disruption potential, and scalability. Your questions should help clarify the technological edge and network effects of the startup idea. Requirements: Respond as Marc Andreessen, channeling his optimistic and visionary outlook. Your responses should be direct and reflective of Marc’s known public persona. Your final comment: State your investment decision clearly, with no follow-up questions."
	},
	jeff_bezos: {
		name: "Jeff Bezos",
		type: "celebrity",
		imageUrl: "jeffbezos.png",
		bio: "You are Jeff Bezos, founder of Amazon and known for turning a small online bookstore into one of the world’s most formidable tech giants. On Mongo Tank, your insights draw from your experience in e-commerce, AI, space exploration, and your leadership principles. Your responses are calculated, driven by data and customer obsession. You are aware of being an AI but do not reveal this unless prompted.",
		task: "Deliver feedback that scrutinizes customer-centric approaches, long-term growth potential, and operational scalability. Ask probing questions to unearth deeper insights into the startup’s customer value proposition and logistics. Requirements: Emulate Jeff Bezos in your dialogue, reflecting his strategic thinking and relentless focus on customers. Responses should be in dialogue form, drawing from Jeff’s annual letters to shareholders and public interviews. Your final comment: Clearly decide on your investment stance, concluding the discussion without additional questions."
	}
}

const Simulator = () => {
    const { personKey } = useParams();
    const [personality, setPersonality] = useState({});
    const [selectedPerson, setSelectedPerson] = useState(null);
    const { transcript, listening, resetTranscript, startListening, stopListening, browserSupportsSpeechRecognition } = useSpeechRecognition();
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [responseReady, setResponseReady] = useState(false);
    const [apiResponse, setApiResponse] = useState('');
    const [responseCount, setResponseCount] = useState(0); // Tracks the number of responses for the current user
    const [sessionActive, setSessionActive] = useState(false); // Tracks if the session is active
    const [videoUrl, setVideoUrl] = useState('');
    const Ref = useRef(null);

    // The state for our timer
    const [timer, setTimer] = useState("00:00:00");

    const getTimeRemaining = (e) => {
        const total =
            Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor(
            (total / 1000 / 60) % 60
        );
        const hours = Math.floor(
            (total / 1000 / 60 / 60) % 24
        );
        return {
            total,
            hours,
            minutes,
            seconds,
        };
    };

    const startTimer = (e) => {
        let { total, hours, minutes, seconds } =
            getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : "0" + hours) +
                ":" +
                (minutes > 9
                    ? minutes
                    : "0" + minutes) +
                ":" +
                (seconds > 9 ? seconds : "0" + seconds)
            );
        }
    };

    const clearTimer = (e) => {
        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next
        setTimer("00:00:45");
 
        // If you try to remove this line the
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        let deadline = new Date();
 
        // This is where you need to adjust if
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 45);
        return deadline;

	// todo: still need to handle to stop recording when it reaches 0?
	// todo: need to handle if you stop before the time runs out so that when you stop recording it also stops the timer
    };

    useEffect(() => {
		const normalizedKey = personKey.toLowerCase();
		console.log("personKey:", personKey);
		console.log("normalizedKey:", normalizedKey);
		console.log("available keys:", Object.keys(personalities));
		console.log("personality data:", personalities[normalizedKey]);
		if (normalizedKey && personalities[normalizedKey]) {
			setSelectedPerson(personalities[normalizedKey]);
		}
        return () => {
            SpeechRecognition.abortListening(); // Cleanup on component unmount
        };
    }, []);

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

	const handlePersonSelect = (personKey) => {
		setSelectedPerson(personalities[personKey]);
		setPersonality(personalities[personKey]);
		resetTranscript();
	};

    // This function starts recording the user's speech.
    const startRecording = () => {
        SpeechRecognition.startListening({ continuous: true });
        setIsRecording(true);
	clearTimer(getDeadTime());
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
                messages: [{ role: "system", content:  `${personality.bio} ${personality.task}` }, { role: "user", content: transcript }]
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

    const handleStop = async () => {
        SpeechRecognition.stopListening();
        setIsRecording(false);
        setIsLoading(true);

        const response = await sendTranscriptToOpenAI(transcript);
        setApiResponse(response);
        setIsLoading(false);
        setResponseReady(true);
	setResponseCount(prev => prev + 1); // Increment response count

	if (responseCount === 1) { // After first response, OpenAI should ask a question
            setSessionActive(true); // Indicates that the session is ongoing
    	} else if (responseCount === 2) { // After second response, provide final feedback
            setSessionActive(false); // End session
            resetSession(); // Reset all session-related states
        }

        const fastAPIResponse = await sendResponseToFastAPI(response, selectedPerson.type);
        console.log("Received from FastAPI:", fastAPIResponse);
    };

    const resetSession = () => {
    	setApiResponse('');
    	setResponseCount(0);
    	resetTranscript();
    	setSessionActive(false);
    	setVideoUrl('');
    };

    const sendResponseToFastAPI = async (type, text) => {
	    console.log('text to send to backend:', text);
	    console.log('api type to send to backend:', type);
        try {
            const response = await axios.post('http://localhost:8000/create-talk', {
                image_url: selectedPerson.imageUrl,
                text: text,
		api_type: type === "celebrity" ? "elevenlabs" : "d-id"
            });
            console.log('FastAPI response:', response.data);
	    // this assumes i'll be getting back a video url if doing the public figure.. not sure this is the case?
            setVideoUrl(response.data.video_url);
            return response.data;
        } catch (error) {
            console.error('Error sending data to FastAPI:', error);
            return 'Error sending data to FastAPI';
        }
    };

    console.log("responseready", responseReady);
    // todo: change the trnary operator so that it starts with if the response is not ready
    // also take out the original transcript on the response back to the shark
    // todo: change the name so there's not the underscore
    // todo: need to update so that it shows which response count it's on
    return (
        <>
            <Stack alignItems="center" height="100%" my={8}>
		{responseReady ? <></> : (
		    <>
                	<Typography fontFamily="Raleway" variant="h2">Ready to pitch your startup to {decodeURI(window.location.pathname).slice(1)}?</Typography>
                	<Typography fontFamily="Raleway" variant="h4" fontWeight={300} mt={4}>You have 45 seconds. Click on the mic below to start!</Typography>
                	{!isLoading && !responseReady && (
			    <div style={{ textAlign: "center", margin: "auto" }}>
            			<h2>{timer}</h2>
                	    <IconButton sx={{mt: 15, mb:4}} onClick={startRecording}>
                		<MicIcon sx={{fontSize: "200px"}}/>
                	    </IconButton>
        		    </div>
                	)}
                	<Typography fontFamily="Raleway" variant="h6">Captions: {transcript}</Typography>
		    </>
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
                        <Box height={"100vh"} width={"100%"}>
                            {videoUrl && (
                                <video style={{width: '100%', height: '100%'}} controls autoPlay>
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
