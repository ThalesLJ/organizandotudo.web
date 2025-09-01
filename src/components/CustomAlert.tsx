import React, { useEffect, useState } from 'react';
import {  Snackbar } from '@mui/material';

type CustomAlertProps = {
    message: string;
    duration?: number;
    severity?: 'success' | 'info' | 'warning' | 'error';
    position?: { vertical: 'top' | 'bottom'; horizontal: 'left' | 'center' | 'right' };
    backgroundColor?: string;
    textColor?: string;
    onClose?: () => void;
};

const CustomAlert: React.FC<CustomAlertProps> = ({
    message,
    duration = 3000,
    severity = 'info',
    position = { vertical: 'top', horizontal: 'center' },
    backgroundColor,
    textColor,
    onClose,
}) => {
    const [open, setOpen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer); // Limpa o timeout ao desmontar o componente
    }, [duration, onClose]);

    const handleClose = () => {
        setOpen(false);
        if (onClose) onClose();
    };

    return (
        <Snackbar open={open} onClose={handleClose} anchorOrigin={position}>
            <div style={{
                backgroundColor: severity === 'error' ? '#fdeded' : severity === 'warning' ? '#fff4e5' : severity === 'info' ? '#e3f2fd' : '#edf7ed',
                color: severity === 'error' ? '#5f2120' : severity === 'warning' ? '#663c00' : severity === 'info' ? '#014361' : '#1e4620',
                padding: '8px 16px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '300px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                fontSize: '14px',
                border: `1px solid ${severity === 'error' ? '#f5c6cb' : severity === 'warning' ? '#ffeaa7' : severity === 'info' ? '#81c784' : '#c8e6c9'}`
            }}>
                <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: severity === 'error' ? '#f44336' : severity === 'warning' ? '#ff9800' : severity === 'info' ? '#2196f3' : '#4caf50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    !
                </div>
                <span style={{ flex: 1 }}>{message}</span>
                <button 
                    onClick={handleClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: severity === 'error' ? '#5f2120' : severity === 'warning' ? '#663c00' : severity === 'info' ? '#014361' : '#1e4620',
                        cursor: 'pointer',
                        fontSize: '18px',
                        padding: '0',
                        width: '20px',
                        height: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    ×
                </button>
            </div>
        </Snackbar>
    );
};

export default CustomAlert;
