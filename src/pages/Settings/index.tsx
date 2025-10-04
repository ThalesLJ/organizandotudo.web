import "../../index.css";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from '../../context/LanguageContext';
import { useColors } from "../../context/ColorContext";
import { AnimatePresence, motion } from 'framer-motion';
import { Form } from 'react-bootstrap';
import { Grid, Typography, Paper, List, ListItem, ListItemText } from "@mui/material";
import Auth from '../../context/Auth';
import Api from '../../services/Api';
import FormInput from "../../components/FormInput";
import FormLoadingButton from "../../components/FormLoadingButton";
import LanguageFloatingButton from "../../components/LanguageFloatingBtn";
import CustomColorPicker from "../../components/CustomColorPicker";
import colorsJSON from '../../global/colors.json';
import { AiOutlineReload } from "react-icons/ai";

export default function Settings() {
  const { strings } = useLanguage();
  const { colors, setColors } = useColors();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [initialUsername, setInitialUsername] = useState<string>('');
  const [initialEmail, setInitialEmail] = useState<string>('');
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'appearance' | 'notifications'>('profile');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isReloading, setIsReloading] = useState<boolean>(false);

  const formRef = useRef<HTMLFormElement>(null);
  const hasLoaded = React.useRef(false);
  const hasChanges = username !== initialUsername || email !== initialEmail;

  // Function to reset global colors to default
  const resetColors = () => {
    const defaultColors = isDarkMode ? colorsJSON.defaultDarkColors : colorsJSON.defaultLightColors; // Obtendo os valores do JSON
    setColors(defaultColors);
    sessionStorage.setItem('colors', JSON.stringify(defaultColors));
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    const newColors = newIsDarkMode ? colorsJSON.defaultDarkColors : colorsJSON.defaultLightColors; // Obtendo os valores do JSON
    setColors(newColors);
    sessionStorage.setItem('colors', JSON.stringify(newColors));
    sessionStorage.setItem('isDarkMode', JSON.stringify(newIsDarkMode));
  };

  // On page load: Get colors and user data from current session
  useEffect(() => {
    // Get colors to be shown in each color picker
    const savedColors = sessionStorage.getItem('colors');
    if (savedColors) {
      const parsedColors = JSON.parse(savedColors);
      setColors(parsedColors);
    }

    // Get dark mode setting
    const savedDarkMode = sessionStorage.getItem('isDarkMode');
    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode));
    }

    // Get user data to be shown in the form (username and email) - only once
    if (!hasLoaded.current && Auth.token) {
      hasLoaded.current = true;
      Api.GetUser(Auth.token)
        .then((user) => {
          setUsername(user.username);
          setInitialUsername(user.username);
          setEmail(user.email);
          setInitialEmail(user.email);
        })
        .catch((error) => {
        });
    }
  }, [setColors]);

  // Send new user data to the API (username and email only)
  const handleSave = useCallback(() => {
    setIsSaving(true);

    Api.UpdateUser({ username, email, password: currentPassword }, Auth.token)
      .then(() => {
        setInitialUsername(username);
        setInitialEmail(email);
        setIsSaving(false);
      })
      .catch((error) => {
        setIsSaving(false);
      });
  }, [username, email, currentPassword]);

  // Prevent default form submission and call handleSave only if there are changes
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasChanges) {
      handleSave();
    }
  };

  // Change some global color
  const handleColorChange = (color: any, type: 'primary' | 'secondary' | 'primaryText' | 'primaryTextTint' | 'secondaryText' | 'secondaryTextTint' | 'background' | 'appBackground') => {
    const newColors = {
      ...colors,
      [type]: color.hex,
    };
    sessionStorage.setItem('colors', JSON.stringify(newColors));
    setColors(newColors);
  };

  // Render the content of the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <Form ref={formRef} onSubmit={handleFormSubmit} className="updateProfileForm">
            <FormInput value={username} placeholder={strings.settings_usernamePlaceholder} required
              onChange={(e) => setUsername(e.target.value)} label={strings.settings_username} />
            <FormInput value={email} placeholder={strings.settings_emailPlaceholder} required
              onChange={(e) => setEmail(e.target.value)} label={strings.settings_email} type="email" />
            {hasChanges && (
              <FormInput value={currentPassword} placeholder={strings.settings_currentPasswordPlaceholder} required
                onChange={(e) => setCurrentPassword(e.target.value)} label={strings.settings_currentPassword} type="password" />
            )}
            <FormLoadingButton width="100%" isLoading={isSaving}>
              {strings.settings_btnSaveChanges}
            </FormLoadingButton>
          </Form>
        );
      case 'appearance':
        return (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px', cursor: 'pointer' }} className="mb-3">
              <Form.Group>
                <Form.Check type="switch" id="dark-mode-switch" label={strings.settings_darkMode}
                  checked={isDarkMode} onChange={toggleDarkMode}
                />
              </Form.Group>

              <div onClick={handleReloadClick} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <AiOutlineReload
                  style={{
                    marginLeft: '16px',
                    transition: 'transform 0.5s ease',
                    transform: isReloading ? 'rotate(360deg)' : 'rotate(0deg)'
                  }}
                />
                <span style={{ marginLeft: '5px' }}>{strings.settings_btnResetColors}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-start', marginBottom: '20px', marginTop: '20px' }}>
              <CustomColorPicker label={strings.settings_primaryColor}
                color={colors.primary}
                onChange={(color) => handleColorChange(color, 'primary')} />
              <CustomColorPicker label={strings.settings_secondaryColor}
                color={colors.secondary}
                onChange={(color) => handleColorChange(color, 'secondary')} />
              <CustomColorPicker label={strings.settings_primaryTextColor}
                color={colors.primaryText}
                onChange={(color) => handleColorChange(color, 'primaryText')} />
              <CustomColorPicker label={strings.settings_primaryTextTintColor}
                color={colors.primaryTextTint}
                onChange={(color) => handleColorChange(color, 'primaryTextTint')} />
              <CustomColorPicker label={strings.settings_secondaryTextColor}
                color={colors.secondaryText}
                onChange={(color) => handleColorChange(color, 'secondaryText')} />
              <CustomColorPicker label={strings.settings_secondaryTextTintColor}
                color={colors.secondaryTextTint}
                onChange={(color) => handleColorChange(color, 'secondaryTextTint')} />
              <CustomColorPicker label={strings.settings_appBackgroundColor}
                color={colors.appBackground}
                onChange={(color) => handleColorChange(color, 'appBackground')} />
              <CustomColorPicker label={strings.settings_backgroundColor}
                color={colors.background}
                onChange={(color) => handleColorChange(color, 'background')} />
            </div>
          </>
        );
      default:
        return <Typography>{strings.settings_chooseSomePage}</Typography>;
    }
  };

  const handleReloadClick = () => {
    if (!isReloading) {
      setIsReloading(true);
      resetColors(); // Chama a função de resetar cores

      // Remove a classe de animação após a animação ser concluída
      setTimeout(() => {
        setIsReloading(false);
      }, 1000); // Duração da animação em milissegundos
    }
  };

  return (
    <div style={{ paddingTop: '70px' }}>
      <AnimatePresence key='divSettings'>
        <motion.div initial={{ y: -1000 }} animate={{ y: 0 }} transition={{ duration: 0.2 }}>
          <Grid className="settings-container" container spacing={3}>
            <Grid item xs={12} md={3}>
              <Paper elevation={3} style={{ height: '100%' }}>
                <List component="nav">
                  <ListItem button selected={activeSection === 'profile'} onClick={() => setActiveSection('profile')}>
                    <ListItemText primary={strings.settings_profile} />
                  </ListItem>
                  <ListItem button selected={activeSection === 'appearance'} onClick={() => setActiveSection('appearance')}>
                    <ListItemText primary={strings.settings_appearance} />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={9}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <p className="subPageTitle">{strings[`settings_${activeSection}Title`]}</p>
                {renderContent()}
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence key='divSettingsFloatingButton'>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <LanguageFloatingButton className="custom-select-logged" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}