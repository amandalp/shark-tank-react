import { Button, Typography, Stack, IconButton, CircularProgress, Box } from "@mui/material";
import React, { useState } from "react";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const Simulator = () => {
    const name = decodeURI(window.location.pathname).slice(1);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [responseReady, setResponseReady] = useState(false);
    // const mediaRecorder = null;

    const startRecording = () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            console.log("getUserMedia supported.");
            navigator.mediaDevices
                .getUserMedia(
                // constraints - only audio needed for this app
                {
                    audio: true,
                },
                )
                // Success callback
                .then((streamObj) => {
                    // const mimeType = 'audio/webm';
                    const mediaRecorder = new MediaRecorder(streamObj);
                    mediaRecorder.start()
                    setIsRecording(true)
                    console.log("test:", mediaRecorder)


                })
                // Error callback
                .catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
                });
        } else {
          console.log("getUserMedia not supported on your browser!");
        }
    }

    const handleStop = () => {
      setIsRecording(false)
      setIsLoading(true)
      setTimeout(()=>{
        setIsLoading(false)
        setResponseReady(true)
      }, 2000)
    //   mediaRecorder.stop()
    }

      
  return (
    <>
      <Stack alignItems="center" height="100%" my={8}>
        <Typography fontFamily="Raleway" variant="h3">Make your pitch to {name}!</Typography>
        <Typography fontFamily="Raleway" variant="h6" fontWeight={300} mt={4}>Click on the mic to start</Typography>
        {!isLoading && !responseReady && (
        <IconButton sx={{mt: 15, mb:4}} onClick={()=>{startRecording(true)}}>
          <MicIcon sx={{fontSize: "200px"}}/>
        </IconButton>
        )}
        {isRecording && (
            <>
            <img src="recording.gif"  width="50px"></img>
            <IconButton color="darkred" onClick={()=>{handleStop()}}>
                <StopCircleIcon htmlColor="darkred" sx={{fontSize: "50px"}}/>
            </IconButton>
            </>
        )}
        {isLoading && <Box sx={{ display: 'flex' }}><CircularProgress size="large" color="secondary"/></Box>}
        {responseReady && (
            <>
            <Box>
            <video width="700" controls autoplay>
            <source src="mark1.mp4" type="video/mp4"></source>
            <source src="mark1.ogg" type="video/ogg"></source>
            </video>
            </Box>
            <Button variant="contained" sx={{backgroundColor: "grey", mt:5}} onClick={()=>{setResponseReady(false)}}>Respond to Mark</Button>
            </>
        )}
      </Stack>
    </>
  )
}

export default Simulator;