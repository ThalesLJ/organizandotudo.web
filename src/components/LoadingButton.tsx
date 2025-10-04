import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import CustomButton from './CustomButton';

interface LoadingButtonProps {
  isLoading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'contained' | 'outlined' | 'text';
  width?: string;
  disabled?: boolean;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  loadingText,
  children,
  onClick,
  type = 'button',
  variant = 'contained',
  width = '100%',
  disabled = false,
  className,
  ...rest
}) => {
  return (
    <CustomButton
      type={type}
      variant={variant}
      onClick={onClick}
      width={width}
      disabled={disabled || isLoading}
      className={className}
      sx={{
        height: '36px',
        maxHeight: '36px',
        minHeight: '36px',
        backgroundColor: '#946a56',
        '&:hover': {
          color: 'rgb(226, 200, 188)',
          backgroundColor: 'rgb(148, 106, 86)'
        }
      }}
      {...rest}
    >
      {isLoading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '24px', maxHeight: '24px', minHeight: '24px' }}>
          <CircularProgress size={24} sx={{ color: 'white' }} />
        </Box>
      ) : (
        children
      )}
    </CustomButton>
  );
};

export default LoadingButton;
