import React, { useContext, useState } from "react";
import axios from "axios";
import AppleIcon from "@mui/icons-material/Apple";
import AndroidIcon from "@mui/icons-material/Android";
import DownloadIcon from '@mui/icons-material/Download';
import { InputAdornment, IconButton, Snackbar, Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import { AppContext } from "../context";
import { TOKEN, USER } from "../constant";
import api from "../api";

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
};

const LOGIN = 1;
const REGISTER = 2;
const FORGOT_PASSWORD = 3;
const RESET_PASSWORD = 4;

const Login = () => {
  const [content, setContent] = useState(LOGIN);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerGmail, setRegisterGmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for Snackbar

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const appContext = useContext(AppContext);
  const { setUser } = appContext;

  const renderContent = () => {
    if (content === LOGIN) {
      return (
        <>
          <Typography variant="h3">Sign In</Typography>
          <TextField
            label="Email address or username"
            variant="outlined"
            className="w-full rounded-full"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Password"
            variant="outlined"
            className="w-full"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="large"
            className="bg-[#5BE260] w-full text-center text-black"
            onClick={handleLogin}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Login
          </Button>
          <Button
            variant="contained"
            className="bg-[#0E0F131C] w-full text-[#08174E]"
            onClick={() => (handleShowForgotPassword(), setOpenModal(true))}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            I forgot my password
          </Button>
        </>
      );
    }

    if (content === REGISTER) {
      return (
        <>
          <Typography variant="h4" style={{ fontSize: '40px', fontWeight: 'bold' }}>Create Account</Typography>
          <TextField
            label="User name"
            variant="outlined"
            className="w-full rounded-full"
            value={registerName}
            onChange={(e) => setRegisterName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email address"
            variant="outlined"
            className="w-full"
            type="email"
            value={registerGmail}
            onChange={(e) => setRegisterGmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="User name"
            variant="outlined"
            className="w-full"
            value={registerUsername}
            onChange={(e) => setRegisterUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            className="w-full"
            type="password"
            value={registerPassword}
            onChange={(e) => setRegisterPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="large"
            className="bg-[#5BE260] w-full text-center text-black"
            onClick={handleRegister}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Register
          </Button>
          <Button
            variant="contained"
            className="bg-[#CBCDCF] w-full text-[#08174E]"
            onClick={handleShowLogin}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            I already have an account
          </Button>
        </>
      );
    }

    if (content === FORGOT_PASSWORD) {
      return (
        <>
          <Typography variant="h3" style={{ fontSize: '30px', fontWeight: 'bold' }}>Forgot Your Password?</Typography>
          <Typography>
            Please enter your email below and we will send you a password reset
            via email.
          </Typography>
          <TextField
            label="Email address"
            variant="outlined"
            className="w-full rounded-full"
            type="email"
            value={forgotPassword}
            onChange={(e) => setForgotPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="large"
            className="bg-[#5BE260] w-full text-center text-black"
            onClick={handleForgotPassword}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Submit
          </Button>
        </>
      );
    }
    
    if (content === RESET_PASSWORD) {
      return (
        <>
          <Typography variant="h4" style={{ fontSize: '30px', fontWeight: 'bold' }}>Reset Your Password</Typography>
          <Typography>Please type in your new password below.</Typography>
          <TextField
            label="New password"
            variant="outlined"
            className="w-full rounded-full"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Confirm new password"
            variant="outlined"
            className="w-full rounded-full"
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            size="large"
            className="bg-[#5BE260] w-full text-center text-black"
            onClick={handleResetPassword}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Submit
          </Button>
        </>
      );
    }
  };

  const handleShowRegister = () => {
    setContent(REGISTER);
    setOpenModal(true);
  };

  const handleShowLogin = () => {
    setContent(LOGIN);
    setOpenModal(true);
  };

  const handleShowForgotPassword = () => {
    setContent(FORGOT_PASSWORD);
    setOpenModal(true);
  };

  const handleShowResetPassword = () => {
    setContent(RESET_PASSWORD);
    setOpenModal(true);
  };

  const handleRegister = () => {
    const payload = {
      name: registerName,
      gmail: registerGmail,
      user_name: registerUsername,
      password: registerPassword,
    };
    setRegisterName("");
    setRegisterGmail("");
    setRegisterUsername("");
    setRegisterPassword("");
    console.log(payload);
    const createAccount = async () => {
      try {
        await api.post(`https://samnote.mangasocial.online/register`, payload);
        setOpenDialog(true);
      } catch (err) {
        console.log(err);
      }
    };
    createAccount();
  };

  const handleLogin = async () => {
    const payload = {
      user_name: userName,
      password,
    };
    try {
      const res = await api.post(`/login`, payload);
      setUser(res.data.user);
      localStorage.setItem(USER, JSON.stringify(res.data.user));
      localStorage.setItem(TOKEN, res.data.jwt);
      setUserName("");
      setPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleForgotPassword = () => {
    const forgotPass = async () => {
      try {
        await api.post(`/resetPasswork`, {
          gmail: forgotPassword,
        });
        setForgotPassword("");
        setSnackbarOpen(true); // Hiển thị Snackbar khi thành công
      } catch (err) {
        console.log(err);
      }
    };
    forgotPass();
  };

  const handleResetPassword = () => {
    const resetPassword = async () => {
      try {
        await api.patch(`/resetPasswork/change`, {
          new_password: newPassword,
          confirm_new_password: confirmNewPassword,
        });
        setNewPassword("");
        setConfirmNewPassword("");
      } catch (err) {
        console.log(err);
      }
    };
    resetPassword();
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    handleShowResetPassword(); // Chuyển sang trang Reset Password sau khi đóng Snackbar
  };

  return (
    <Box className="h-screen w-screen bg-[url(/loginBackground.png)] bg-cover">
      <Box className="flex flex-col gap-12 top-0 left-0 w-full h-full justify-center items-center text-center">
        <Box className="flex items-center gap-4">
          <img src="/public/logo.png" alt="" className="w-[80px] h-[70px]" style={{marginTop: '-10px'}} />
          <Typography className="uppercase font-bold text-white text-[70px]" style={{ marginTop: '-10px' }}>
            samnotes
          </Typography>
        </Box>
        <Typography className="text-3xl text-white" style={{ margin: '-30px' }}>
          A place to store and share your ideas. Anytime, anywhere.
        </Typography>
        <Box className="flex gap-12 justify-center">
          <Button
            variant="contained"
            className="w-[330px] h-[60px] bg-[#5BE260] text-2xl text-black rounded-[20px]"
            onClick={handleShowRegister}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Get started
          </Button>
          <Button
            variant="contained"
            className="w-[330px] h-[60px] text-2xl bg-[#DADADA] text-black rounded-[20px]"
            onClick={handleShowLogin}
            style={{ textTransform: 'none', fontWeight: 'bold' }}
          >
            Login
          </Button>
          <Modal
            open={openModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={styleModal}
              className="opacity-95 rounded-[30px] border-none flex flex-col gap-4 items-center relative"
            >
              <ClearIcon
                className="absolute top-4 right-5 p-2 cursor-pointer text-zinc-500 hover:text-black"
                onClick={handleCloseModal}
              />
              {renderContent()}
            </Box>
          </Modal>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Account Created</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                We have sent a confirmation letter to your email address. Please
                check your email and access the link. If you haven't received
                our letter, please click the button below to resend.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Box className="w-full flex justify-center gap-3">
                <Button
                  variant="contained"
                  onClick={() => (handleCloseDialog(), setContent(LOGIN))}
                  className="bg-[#5BE260] text-black flex-1"
                  style={{ textTransform: 'none' }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCloseDialog}
                  className="text-black bg-[#DADADA] flex-1"
                  style={{ textTransform: 'none', color: '' }}
                >
                  Resend confirmation mail
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </Box>
        <Box className="fixed bottom-0 left-0 p-4 flex items-center gap-4">
          <img src="/public/logo.png" alt="" className="w-[80px] h-[70px]" />
          <Typography className=" font-bold text-white text-[20px]">
            Now available on IOS and Android platform. Download now
          </Typography>
          <Box className="ApleDownload">
            <div>
              <AppleIcon style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <div>
              <a href="">
                <DownloadIcon style={{ color: 'white', fontSize: '32px' }} />
              </a>
            </div>
          </Box>
          <Box className="AndroidDownload">
            <div>
              <AndroidIcon style={{ color: 'white', fontSize: '32px' }} />
            </div>
            <div>
              <a href="">
                <DownloadIcon style={{ color: 'white', fontSize: '32px' }} />
              </a>
            </div>
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
          Password reset email sent!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
