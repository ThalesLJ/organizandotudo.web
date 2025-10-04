import React, { ReactNode } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import LoadingButton from './LoadingButton';

interface FormLoadingButtonProps {
    children: ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'contained' | 'outlined' | 'text';
    width: string;
    isLoading?: boolean;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}

const FormLoadingButton: React.FC<FormLoadingButtonProps> = ({ 
    children, 
    type = 'submit', 
    variant = 'contained', 
    width, 
    isLoading = false,
    disabled = false,
    className,
    onClick, 
    ...rest 
}) => {
    return (
        <Form.Group controlId="formSave" className="mt-4">
            <Row>
                <Col xs={12} sm={12} md={12} lg={12}>
                    <LoadingButton
                        type={type}
                        variant={variant}
                        width={width}
                        isLoading={isLoading}
                        disabled={disabled}
                        className={className}
                        onClick={onClick}
                        {...rest}
                    >
                        {children}
                    </LoadingButton>
                </Col>
            </Row>
        </Form.Group>
    );
};

export default FormLoadingButton;
