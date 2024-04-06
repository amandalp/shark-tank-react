import { LinearProgress, Typography, Stack, IconButton, Box } from "@mui/material";
import React, { useState } from "react";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';

const Simulator = () => {
    const name = decodeURI(window.location.pathname).slice(1);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = null;

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
                    mediaRecorder = new MediaRecorder(streamObj);
                    mediaRecorder.start()


                })
                // Error callback
                .catch((err) => {
                console.error(`The following getUserMedia error occurred: ${err}`);
                });
        } else {
          console.log("getUserMedia not supported on your browser!");
        }
    }
    

    const handleMicClick = () => {
      setIsRecording(true)
      startRecording(true)
    }

    const handleStop = () => {
      setIsRecording(false)
      mediaRecorder.stop()
    }

      
  return (
    <>
      <Stack alignItems="center" height="100%" my={8}>
        <Typography fontFamily="Raleway" variant="h3">Start your pitch to {name}!</Typography>
          <IconButton sx={{mt: 20, mb:4}} onClick={()=>{handleMicClick()}}>
            <MicIcon sx={{fontSize: "200px"}}/>
          </IconButton>
        {isRecording && (
            <>
            <img src="recording.gif"  width="50px"></img>
            <IconButton color="darkred" onClick={()=>{handleStop()}}>
                <StopCircleIcon htmlColor="darkred" sx={{fontSize: "50px"}}/>
            </IconButton>
            </>
        )}
      </Stack>
    </>
  )
}

export default Simulator;