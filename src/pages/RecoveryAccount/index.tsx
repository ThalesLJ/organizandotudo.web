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
import { useNavigate } from "react-router-dom";
import Api from '../../services/Api';
import CustomAlert from "../../components/CustomAlert";
import CustomLink from "../../components/CustomLink";
import FormInput from "../../components/FormInput";
import LanguageFloatingButton from "../../components/LanguageFloatingBtn";
import LoadingButton from "../../components/LoadingButton";
import ISendCode from '../../types/ISendCode';
import IVerifyCode from '../../types/IVerifyCode';

export default function RecoveryAccount() {
  const { strings } = useLanguage();
  const { colors } = useColors();

  const [step, setStep] = React.useState(1);
  const [email, setEmail] = React.useState('');
  const [code, setCode] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showAlert, setShowAlert] = React.useState(false);
  const [alertMessage, setAlertMessage] = React.useState('');
  const [alertSeverity, setAlertSeverity] = React.useState<'success' | 'error'>('error');

  const navigate = useNavigate();
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword((show) => !show);

  // Limpa os campos quando muda para a etapa 2
  React.useEffect(() => {
    if (step === 2) {
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
    }
  }, [step]);

  const handleSendCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setShowAlert(false);

    const sendCodeData: ISendCode = {
      email: email
    };

    try {
      const result = await Api.SendCode(sendCodeData);
      if (result.pt.code === "Success") {
        setAlertMessage(strings.recoveryAccount_success);
        setAlertSeverity('success');
        setShowAlert(true);
        setStep(2);
      } else {
        setAlertMessage(result.pt.message);
        setAlertSeverity('error');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage(strings.recoveryAccount_error);
      setAlertSeverity('error');
      setShowAlert(true);
    }

    setIsLoading(false);
  };

  const handleVerifyCode = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setAlertMessage("As senhas não coincidem");
      setAlertSeverity('error');
      setShowAlert(true);
      return;
    }

    setIsLoading(true);
    setShowAlert(false);

    const verifyCodeData: IVerifyCode = {
      code: code,
      password: newPassword
    };

    try {
      const result = await Api.VerifyCode(verifyCodeData);
      if (result.pt.code === "Success") {
        setAlertMessage(strings.recoveryAccount_passwordUpdated);
        setAlertSeverity('success');
        setShowAlert(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setAlertMessage(result.pt.message);
        setAlertSeverity('error');
        setShowAlert(true);
      }
    } catch (error) {
      setAlertMessage(strings.recoveryAccount_error);
      setAlertSeverity('error');
      setShowAlert(true);
    }

    setIsLoading(false);
  };

  return (
    <div className='app-unique-containers'>
      {showAlert && <CustomAlert message={alertMessage} severity={alertSeverity} />}

      <AnimatePresence key='divRecovery'>
        <motion.div className='app-unique-container login-container' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <span className='login-txtTitulo'>{strings.recoveryAccount_title}</span>

          {step === 1 ? (
            <form onSubmit={handleSendCode}>
              <FormInput 
                label={strings.recoveryAccount_email} 
                type='email' 
                required 
                width="80%"
                placeholder={strings.recoveryAccount_emailPlaceholder}
                onChange={(e) => { setEmail(e.target.value) }}
              />

              <br />
              <LoadingButton 
                type='submit' 
                className='login-btnAcessar' 
                variant="contained" 
                width="80%"
                isLoading={isLoading}
              >
                {strings.recoveryAccount_sendCode}
              </LoadingButton>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} key="step2-form">
              <FormInput 
                key="verification-code"
                label={strings.recoveryAccount_verificationCode} 
                type='text' 
                required 
                width="80%"
                placeholder={strings.recoveryAccount_codePlaceholder}
                value={code}
                onChange={(e) => { setCode(e.target.value) }}
                autoComplete="off"
              />

              <FormInput 
                key="new-password"
                label={strings.recoveryAccount_newPassword} 
                type={showPassword ? 'text' : 'password'}
                required 
                width="80%"
                placeholder={strings.recoveryAccount_newPasswordPlaceholder}
                value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value) }}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff style={{ color: colors.primary }} /> : <Visibility style={{ color: colors.primary }} />}
                    </IconButton>
                  </InputAdornment>
                }
              />

              <FormInput 
                key="confirm-password"
                label={strings.recoveryAccount_confirmPassword} 
                type={showConfirmPassword ? 'text' : 'password'}
                required 
                width="80%"
                placeholder={strings.recoveryAccount_confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value) }}
                autoComplete="new-password"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="toggle password visibility" onClick={handleClickShowConfirmPassword} edge="end">
                      {showConfirmPassword ? <VisibilityOff style={{ color: colors.primary }} /> : <Visibility style={{ color: colors.primary }} />}
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
                isLoading={isLoading}
              >
                {strings.recoveryAccount_savePassword}
              </LoadingButton>
            </form>
          )}

          <div className="login-redirects">
            <CustomLink to="/" className='login-txtCriar'>
              {strings.recoveryAccount_signIn}
            </CustomLink>
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

      <AnimatePresence key='divRecoveryFloatingButton'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <LanguageFloatingButton className="custom-select" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}