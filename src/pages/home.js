import { Box, Typography, Stack, Avatar, Link, Modal } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { personalities } from "./personalities.js";


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
