import "../../index.css";
import * as React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useColors } from "../../context/ColorContext";
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AiFillGithub, AiFillLinkedin } from 'react-icons/ai';
import ILogin from '../../types/ILogin';
import { useNavigate } from "react-router-dom";
import Api from '../../services/Api';
import Auth from '../../context/Auth';
import CustomAlert from "../../components/CustomAlert";
import CustomLink from "../../components/CustomLink";
import FormInput from "../../components/FormInput";
import LanguageFloatingButton from "../../components/LanguageFloatingBtn";
import LoadingButton from "../../components/LoadingButton";

export default function Login() {
  const { strings } = useLanguage();
  const { colors } = useColors();

  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLogging, setIsLogging] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');

  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const Login = async (event: React.FormEvent<HTMLFormElement>) => {
    setIsLogging(true);
    setShowAlert(false);

    const login: ILogin = {
      username: username,
      password: password
    };

    Api.Login(login)
      .then((result) => {
        Auth.login(result);
        setIsLogging(false);
        navigate("/Notes");
      })
      .catch((e) => {
        setAlertMessage(strings.login_AccountNotFound);
        setShowAlert(true);
        setIsLogging(false);
      });

    event.preventDefault();
  }

  return (

    <div className='app-unique-containers'>
      {showAlert && <CustomAlert message={alertMessage} severity="error" />}

      <AnimatePresence key='divLogin'>
        <motion.div className='app-unique-container login-container' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} >
          <span className='login-txtTitulo'>{strings.login_title}</span>

          <form onSubmit={Login}>
            <FormInput label={strings.login_username || "Username"} type='text' required width="80%"
              onChange={(e) => { setUsername(e.target.value) }}
            />

            <FormInput label={strings.login_password} required width="80%"
              onChange={(e) => { setPassword(e.target.value) }}
              type={
                showPassword ? 'text' : 'password'
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end" >
                    {showPassword ? <VisibilityOff style={{ color: colors.primary }} /> : <Visibility style={{ color: colors.primary }} />}
                  </IconButton>
                </InputAdornment>
              }
            />

            <br />
            <LoadingButton 
              type='submit' 
              className='login-btnAcessar' 
              variant="contained" 
              width="80%"
              isLoading={isLogging}
            >
              {strings.login_btnLogin}
            </LoadingButton>
          </form>

          <div className="login-redirects">
            <CustomLink to="/AddAccount" className='login-txtCriar'>{strings.login_create}</CustomLink>
            <CustomLink to="/RecoveryAccount" className='login-txtRecuperar'>{strings.login_recovery}</CustomLink>
          </div>

          <div className='login-rightsContainer'>
            <span>
              <a href='https://www.linkedin.com/in/thaleslj' className='no-decoration'>
                <AiFillLinkedin className='login-rightsLinkedin' />
              </a>
              <a href='https://github.com/ThalesLJ' className='no-decoration'>
                <AiFillGithub className='login-rightsLinkedin' />
              </a>
            </span>
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
