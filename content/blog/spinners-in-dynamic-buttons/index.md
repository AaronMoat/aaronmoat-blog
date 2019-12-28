---
title: Loading Spinners Inside Dynamic Buttons
date: '2019-12-28T15:00:00.000Z'
description: Putting spinners inside buttons without changing the button's size.
tags: ['CSS', 'React', 'Javascript']
---

I usually prefer unintrusive feedback to actions, such as a form submission, rather than throwing
up a full-page loading spinner. One useful pattern is replacing a button's text with an animated spinner.

## Starting with our Button and Spinner components

Here's our starting point - a basic button in [React](https://reactjs.org/) using [styled-components](https://www.styled-components.com/):

```javascript
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

const Button = props => <StyledButton {...props} />; // we'll need this later!
```

We also need a spinner. Here's one adapted from [loading.io](https://loading.io/css/)

```javascript
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
```

## Adding the Spinner

The first instinct would be to just replace the button content with the spinner:

```javascript
const Button = ({ isLoading, children, ...rest }) => (
  <StyledButton {...rest}>{isLoading ? <Spinner /> : children}</StyledButton>
);
```

However, the spinner and the removal of the text causes the button to change shape, which looks,
well, [pretty terrible](/demos/?path=/story/buttons-in-spinners--naive-button-with-spinner).

Let's use some tricks:

- Use absolute positioning to remove the Spinner from the Button's layout flow
- Use `visibility: hidden` on the button's text to hide it but keep it in the layout
- Flex for centering the spinner

```javascript
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
```

See a [demo](/demos/?path=/story/buttons-in-spinners--button-with-spinner), or get [the full source code](https://github.com/AaronMoat/aaronmoat-blog/tree/master/stories/ButtonSpinners/final.jsx).
