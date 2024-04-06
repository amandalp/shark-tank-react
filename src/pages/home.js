import { Box, Typography, Stack, Avatar, Badge } from "@mui/material";
import React, { useState } from "react";

// const StyledAvatar = (props) => {
//   const {name, src} = props
//   const [person, setPerson] = useState("")
//   return (
//     <Stack
//       alignItems="center"
//       onMouseEnter={() => {setPerson(name)}}
//       onMouseLeave={() => {setPerson("")}}
//     >
//       <Avatar sx={{ width: 200, height: 200, backgroundColor: "grey", ':hover': {background: "linear-gradient(#2c2c2c, #808080)", } }} alt={name} src={src} />
//       <Typography fontFamily="Raleway"  sx={{transform: "rotate(0deg)", display: "auto", mt: "-20px", ":hover":{ display: "auto"}}}>{name}</Typography>
//     </Stack>
//   )
// } 


const HomePage = () => {

  const [person, setPerson] = useState("")
  const StyledAvatar = (props) => {
    const {name, src} = props
    return (
      <Stack
        alignItems="center"
        onMouseEnter={() => {setPerson(name)}}
        onMouseLeave={() => {setPerson("")}}
      >
        <Avatar sx={{ width: 200, height: 200, backgroundColor: "grey", ':hover': {background: "linear-gradient(#2c2c2c, #808080)", cursor: 'pointer' } }} alt={name} src={src} />
      </Stack>
    )
  } 
  return (
    <Stack alignItems="center" height="100%" my={5}>
      <img src="logo.png" width="500px"></img>
      <Stack direction="row" my={10}>
        <Typography fontFamily="Raleway" fontWeight="500" variant="h3" mr={3}>Try pitching your idea to</Typography>
        <Box borderBottom="3px solid" minWidth={430}>
          <Typography fontFamily="Raleway" fontWeight="500" variant="h3" display="inline" ml={3}>{person}</Typography>
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="center" spacing={6} mt={6} flexWrap="wrap" maxWidth={1000}>
        <StyledAvatar name="Mark Cuban" src="markcuban.png" />
        <StyledAvatar name="Sheryl Sandberg" src="sherylsandberg.png" />
        <StyledAvatar name="Paul Graham" src="paulgraham.png" />
        <StyledAvatar name="Joshua Rahn" src="josh.png" />
        <StyledAvatar name="Sam Altman" src="samaltman.png" />
        <StyledAvatar name="Ethan Steininger" src="ethan.png" />
        <StyledAvatar name="Marc Andreessen" src="marcandreessen.png" />
      </Stack>
    </Stack>

  )
}

export default HomePage;