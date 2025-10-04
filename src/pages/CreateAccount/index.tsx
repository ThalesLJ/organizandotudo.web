import "../../index.css";
import { useLanguage } from '../../context/LanguageContext';
import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useNavigate } from "react-router-dom";
import Api from '../../services/Api';
import IUserData from "../../types/IUserData";
import CustomLink from "../../components/CustomLink";
import LanguageFloatingButton from "../../components/LanguageFloatingBtn";
import FormInput from "../../components/FormInput";
import CustomAlert from "../../components/CustomAlert";
import LoadingButton from "../../components/LoadingButton";

export default function CreateAccount() {
  const { strings } = useLanguage();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSigningUp, setIsSigningUp] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error' | 'info' | 'warning'>('error');

  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const SignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Clear previous alerts
    setShowAlert(false);
    
    // Validate password length
    if (password.length < 6) {
      setAlertMessage(strings.createAccount_passwordError);
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    setIsSigningUp(true);

    let newUser: IUserData = {
      username: username,
      email: email,
      password: password
    };

    Api.CreateAccount(newUser)
      .then((response) => {
        setIsSigningUp(false);
        
        // Check if the response indicates success
        if (response.pt.code === "Success") {
          setAlertMessage(strings.createAccount_success);
          setAlertSeverity('success');
          setShowAlert(true);
          
          // Navigate after showing success message
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          // Handle API error responses
          let errorMessage = strings.createAccount_errorGeneric;
          
          // Check the error message from API to determine the type
          if (response.pt.message.includes('already exists') || response.pt.message.includes('já existe')) {
            errorMessage = strings.createAccount_errorUserExists;
          } else if (response.pt.message.includes('invalid') || response.pt.message.includes('inválido')) {
            errorMessage = strings.createAccount_errorBadRequest;
          }
          
          setAlertMessage(errorMessage);
          setAlertSeverity('error');
          setShowAlert(true);
        }
      })
      .catch((error) => {
        setIsSigningUp(false);
        setAlertMessage(strings.createAccount_errorGeneric);
        setAlertSeverity('error');
        setShowAlert(true);
      });
  }

  return (
    <div className='app-unique-containers'>
      {showAlert && <CustomAlert message={alertMessage} severity={alertSeverity} />}
      
      <AnimatePresence key='divCreateAccount'>
        <motion.div className='app-unique-container create-user-container' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
          <span className='login-txtTitulo'>{strings.createAccount_title}</span>

          <form onSubmit={SignUp}>
            <FormInput label={strings.login_username} type='text' required width="80%"
              onChange={(e) => { setUsername(e.target.value) }}
            />

            <FormInput label={strings.createAccount_email} type='text' required width="80%"
              onChange={(e) => { setEmail(e.target.value) }}
            />

            <FormInput label={strings.login_password} required width="80%"
              onChange={(e) => { 
                setPassword(e.target.value);
                // Clear alert when user starts typing a valid password
                if (e.target.value.length >= 6 && showAlert && alertSeverity === 'error') {
                  setShowAlert(false);
                }
              }}
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <br />
            <LoadingButton 
              type='submit' 
              variant="contained" 
              width="80%"
              isLoading={isSigningUp}
            >
              {strings.createAccount_title}
            </LoadingButton>
          </form>

          <div className="login-redirects">
            <CustomLink to="/" className='login-txtCriar'>{strings.createAccount_accessAccount}</CustomLink>
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence key='divLoginFloatingButton'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <LanguageFloatingButton className="custom-select" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
