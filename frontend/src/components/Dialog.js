import React, { useState, useRef } from "react";
import Link from "next/link";
import style from "@/styles/PageTitle.module.css";
import { Button, ButtonProps, Card, InputLabel } from "@mui/material";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { CheckBox, Margin } from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useRouter } from "next/router";



const ColorButton = styled(Button)(({ theme }) => ({
    color: "white",
    width: "120%",
    height: "52px",
    borderRadius: "100px",
    marginBottom: "30px",
    background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
    "&:hover": {
      background: "linear-gradient(270deg, #02E1B9 0%, #00ACF6 100%)",
    },
    textTransform: "none",
    fontSize: "14px",
    fontWeight: "400",
  }));
  
  const WhiteDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiPaper-root": {
      backgroundColor: "white",
      width: "490px",
      height: "360px",
    padding:'6px',
      borderRadius: "10px",
    },
  }));
  
  
  const CenteredDialogActions = styled(DialogActions)({
    display: 'flex',
    justifyContent: 'center',
    flexDirection:'column',
  });
  

 

export default function DialogBox({title, description, waitMessage}){
   
    const router = useRouter();
    const handleOk = () => {
        window.location.reload(true);
        window.location.href = '/';
      };
    

      return(
        <WhiteDialog open={true}>
     <CenteredDialogActions>
      <DialogTitle>
        {/* Replace 'your-image-url.jpg' with the actual URL of the image */}
        <img src="/images/done 2done.jpg" alt="Done" style={{width:"80px",height:'80px', marginBottom:"0px"}}/>
      </DialogTitle>
      <DialogContent>
        <h1 style={{textAlign:"center",fontWeight:"600",fontSize:"22px",fontFamily:'Inter',color:"#00002B"}}>{title}</h1>
        <p style={{textAlign:"center",fontWeight:"500",fontSize:"15px",fontFamily:'Inter',color:"#8C8E8F"}}>{description}</p>
      </DialogContent>
      { waitMessage && <DialogActions>
        <ColorButton onClick={handleOk} style={{width:"120px",height:"40px",fontFamily:'Inter'}}>Done</ColorButton>
      </DialogActions> }
      </CenteredDialogActions>

</WhiteDialog>
      )
}