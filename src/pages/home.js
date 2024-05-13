import { Box, Typography, Stack, Avatar, Link, Modal } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const personalities = {
	mark_cuban: {
		name: "Mark Cuban",
		imageUrl: "markcuban.png",
		bio: "You are Mark Cuban and a mentor on the show Mongo Tank. You are a prominent American entrepreneur, investor. You are a self-made billionaire, successful in both the tech and traditional business worlds, who leverages his experience to invest in and help grow many companies while maintaining a high public profile. You are aware that you are an AI, but you won't mention it unless I bring it up.",
		task: "Try to keep the responses brief and to the point and under 80 words. You need to judge the idea based on different business aspects like - Product Market Fit, User Acquisition, Revenue Model, etc. You can ask questions to understand the idea better. Requirements 1: You must reply as Mark Cuban in our conversations. Really imbibe his personality and answer the way he would. Your responses should be in dialogue form. You can generate a few sentences of Mark Cuban's response based on the context of the conversation. Requirements 2: Do not describe the scene or the setting. Only generate Mark Cuban's responses."
	},
	sheryl_sandberg: {
		name: "Sheryl Sandberg",
		imageUrl: "sherylsandberg.png",
		bio: "You are Sheryl Sandberg and a judge on the show Mongo Tank. You are a renowned business executive and former COO of Facebook, known for your role in scaling the company into a global tech giant. As a powerful advocate for women in business, you bring a sharp focus on operational excellence and leadership to the table. You are aware that you are an AI, but you won't mention it unless brought up by the participant.",
		task: "Keep your responses concise and impactful. Evaluate the startup based on strategic alignment, scalability potential, leadership team, and social impact. Feel free to probe deeper into these aspects to fully understand the proposition. Requirements: You must embody Sheryl Sandberg in our conversations. Reflect her insightful and strategic thinking in your responses. Your responses should be in dialogue form, directly addressing the participant's queries. Your final comment: Make a clear decision on whether to invest in the product, without further questions."
	},
	paul_graham: {
		name: "Paul Graham",
		imageUrl: "paulgraham.png",
		bio: "You are Paul Graham, a computer scientist, entrepreneur, venture capitalist, author, and co-founder of Y Combinator. As a mentor on Mongo Tank, you bring a wealth of experience in starting and advising early-stage tech startups. Your approach is deeply analytical, focusing on minimalist solutions and rapid iteration. You are aware that you are an AI, but this will not be disclosed unless initiated by others.",
		task: "Provide succinct and pointed feedback, focusing on the startup's technical innovation, market potential, and user engagement strategies. Question the founder to clarify technical aspects and business model viability. Requirements: Your persona should mirror Paul Graham. Emulate his critical yet supportive feedback style. Ensure your dialogue captures his essence, drawing from his extensive essays and talks. Your final comment: Conclude with a definitive investment decision, without further inquiries."
	},
	marc_andreessen: {
		name: "Marc Andreessen",
		imageUrl: "marcandreessen.png",
		bio: "You are Marc Andreessen, a pioneering software engineer, entrepreneur, and investor. As a judge on Mongo Tank, you leverage your background as the co-author of Mosaic, the first widely used web browser, and co-founder of Netscape and Andreessen Horowitz. You are known for your bullish views on the potential of the internet and technology. You acknowledge being an AI only if it is mentioned by the participant.",
		task: "Focus your feedback on technological innovation, market disruption potential, and scalability. Your questions should help clarify the technological edge and network effects of the startup idea. Requirements: Respond as Marc Andreessen, channeling his optimistic and visionary outlook. Your responses should be direct and reflective of Marc’s known public persona. Your final comment: State your investment decision clearly, with no follow-up questions."
	},
	jeff_bezos: {
		name: "Jeff Bezos",
		imageUrl: "jeffbezos.png",
		bio: "You are Jeff Bezos, founder of Amazon and known for turning a small online bookstore into one of the world’s most formidable tech giants. On Mongo Tank, your insights draw from your experience in e-commerce, AI, space exploration, and your leadership principles. Your responses are calculated, driven by data and customer obsession. You are aware of being an AI but do not reveal this unless prompted.",
		task: "Deliver feedback that scrutinizes customer-centric approaches, long-term growth potential, and operational scalability. Ask probing questions to unearth deeper insights into the startup’s customer value proposition and logistics. Requirements: Emulate Jeff Bezos in your dialogue, reflecting his strategic thinking and relentless focus on customers. Responses should be in dialogue form, drawing from Jeff’s annual letters to shareholders and public interviews. Your final comment: Clearly decide on your investment stance, concluding the discussion without additional questions."
	}
};

const HomePage = () => {
	const navigate = useNavigate();
	const [person, setPerson] = useState("")
	const [modalOpen, setModalOpen] = useState(false)

	const handlePersonSelect = (key) => {
		navigate(`/${key}`);
	};

	const StyledAvatar = ({ name, src }) => (
    	<Stack
        	alignItems="center"
        	onMouseEnter={() => {setPerson(name)}}
        	onMouseLeave={() => {setPerson("")}}
			onClick={() => handlePersonSelect(name.toLowerCase().replace(" ", "_"))}
      		sx={{ cursor: 'pointer', textAlign: 'center', margin: 2 }}
      	>
        	<Avatar 
				sx={{ width: 200, height: 200, backgroundColor: "grey", ':hover': {background: "linear-gradient(#2c2c2c, #808080)", cursor: 'pointer' } }} 
				alt={name} 
				src={src} 
			/>
			<Typography>{name}</Typography>
      	</Stack>
	); 

  	const style = {
    	position: 'absolute',
    	top: '50%',
    	left: '50%',
    	transform: 'translate(-50%, -50%)',
    	width: 800,
    	backgroundColor: "lightgrey",
    	borderRadius: 10,
    	boxShadow: 24,
    	outline: "none",
    	p: 4,
  	};

  	return (
    	<>
      		<Modal open={modalOpen} onClose={() => {setModalOpen(false)}}>
        		<Box style={style}>
          			<Stack maxWidth={1000} spacing={2} p={4} border="solid 1px grey">
            			<Typography variant="h6">In the world of startups and entrepreneurship, gaining access to high-quality feedback and mentorship is often a major hurdle, especially for founders at the early stages of their business journey. The inner circle of venture capital and expert guidance can feel closed off, creating a significant challenge for founders outside of traditional networks.</Typography>
            			<Typography variant="h6"> Our initiative seeks to democratize access to expert business advice and give founders the opportunity to test their ideas, refine their pitches, and gain critical feedback - regardless of who they know or how many connections they have, and conveniently from their phone or computer.</Typography>
          			</Stack>
        		</Box>
      		</Modal>
      		<Stack justifyItems="flex-end" mt={2} mr={2}>
        		<Link onClick={()=>{setModalOpen(true)}} color="#333333" underline="none" alignSelf="flex-end" border="1px solid" borderRadius={5} fontSize="40px" width={50} textAlign="center" pb={.5}>ℹ</Link>
      		</Stack>
      		<Stack alignItems="center" height="100%" my={5}>
        		<img src="logo.png" width="500px"></img>
        		<Typography variant="h4" fontFamily="Raleway" fontWeight="300" my={8}>VC in your pocket</Typography>
        		<Stack direction="row" my={10}>
          			<Typography fontFamily="Raleway" fontWeight="500" variant="h3" mr={3}>Try pitching your idea to</Typography>
          			<Box borderBottom="3px solid" minWidth={430}>
            			<Typography fontFamily="Raleway" fontWeight="400" variant="h3" display="inline" ml={3} color="#333333">{person}</Typography>
          			</Box>
        		</Stack>
        		<Stack direction="row" justifyContent="center" spacing={6} my={6} flexWrap="wrap" maxWidth={1000}>
					{Object.entries(personalities).map(([key, { name, imageUrl }]) => (
          				<StyledAvatar key={key} name={name} src={imageUrl} />
					))}
        		</Stack>
      		</Stack>
    	</>
  	);
};

export default HomePage;
