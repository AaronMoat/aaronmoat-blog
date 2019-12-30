import React, { useState } from 'react';
import styled from 'styled-components';
import { useInterval } from '../utils';

const StyledButton = styled.button`
  display: inline-block;
  padding: 1rem 1.5rem;
  border-radius: 0.2rem;
  border: none;
  margin: 0;
  background: hsl(200, 90%, 40%);
  color: hsl(200, 15%, 90%);
  font-family: sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: background 250ms ease-in-out, transform 150ms ease;

  :hover,
  :focus {
    background: hsl(200, 90%, 45%);
  }
`;

const StyledSpinner = styled.div`
  display: inline-block;
  position: relative;
  width: ${props => props.size}px;
  height: ${props => props.size}px;

  div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${props => props.size}px;
    height: ${props => props.size}px;
    border: ${props => props.size / 8}px solid;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${props => props.color} transparent transparent transparent;
  }

  div:nth-child(1) {
    animation-delay: -0.45s;
  }

  div:nth-child(2) {
    animation-delay: -0.3s;
  }

  div:nth-child(3) {
    animation-delay: -0.15s;
  }

  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Spinner = ({ color = 'white', size = 18 }) => (
  <StyledSpinner role="img" aria-label="Loading" color={color} size={size}>
    <div />
    <div />
    <div />
    <div />
  </StyledSpinner>
);

const StyledSpinnerContainer = styled.span`
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;

  > span {
    position: absolute;

    width: 100%;
    height: 100%;
  }
`;

const SpinnerContainer = ({ children }) => (
  <StyledSpinnerContainer>
    <span>{children}</span>
  </StyledSpinnerContainer>
);

const Button = ({ isLoading, children, ...rest }) => (
  <StyledButton {...rest}>
    {isLoading && (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    )}

    <span style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
      {children}
    </span>
  </StyledButton>
);

export const ButtonWithSpinner = () => {
  const [loading, setLoading] = useState(true);

  const toggleLoading = () => {
    setLoading(!loading);
  };

  useInterval(toggleLoading, 1000);

  return <Button isLoading={loading}>Button text</Button>;
};
