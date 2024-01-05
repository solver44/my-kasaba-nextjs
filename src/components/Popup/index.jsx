import React, { useState } from "react";
import { Unstable_Popup as BasePopup } from "@mui/base/Unstable_Popup";
import PropTypes from "prop-types";
import { styled } from "@mui/system";

export default function Popup({ returnButton, placement, children }) {
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      {returnButton && returnButton(setAnchor, setOpen, open)}
      <BasePopup
        placement={placement}
        disablePortal
        strategy="fixed"
        anchor={anchor}
        open={open}
        withTransition
      >
        {(props) => (
          <PopAnimation {...props}>
            <PopupBody>{children}</PopupBody>
          </PopAnimation>
        )}
      </BasePopup>
    </React.Fragment>
  );
}

function Animated(props) {
  const { requestOpen, onEnter, onExited, children, className } = props;

  React.useEffect(() => {
    if (requestOpen) {
      onEnter();
    }
  }, [onEnter, requestOpen]);

  const handleAnimationEnd = React.useCallback(() => {
    if (!requestOpen) {
      onExited();
    }
  }, [onExited, requestOpen]);

  return (
    <div
      onAnimationEnd={handleAnimationEnd}
      className={className + (requestOpen ? " open" : " close")}
    >
      {children}
    </div>
  );
}

Animated.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onEnter: PropTypes.func.isRequired,
  onExited: PropTypes.func.isRequired,
  requestOpen: PropTypes.bool.isRequired,
};

const PopAnimation = styled(Animated)`
  @keyframes open-animation {
    0% {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }

    50% {
      opacity: 1;
      transform: translateY(4px) scale(1.05);
    }

    100% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @keyframes close-animation {
    0% {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

    50% {
      opacity: 1;
      transform: translateY(4px) scale(1.05);
    }

    100% {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
  }

  &.open {
    animation: open-animation 0.4s ease-in forwards;
  }

  &.close {
    animation: close-animation 0.4s ease-in forwards;
  }
`;

const grey = {
  50: "#f6f8fa",
  200: "#d0d7de",
  500: "#6e7781",
  700: "#424a53",
  900: "#24292f",
};

const PopupBody = styled("div")(
  ({ theme }) => `
      width: max-content;
      padding: 0.5rem 1rem;
      margin: 8px;
      border: 1px solid ${
        theme.palette.mode === "dark" ? grey[700] : grey[200]
      };
      background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
      border-radius: 8px;
      box-shadow: ${
        theme.palette.mode === "dark"
          ? `0px 4px 8px rgb(0 0 0 / 0.7)`
          : `0px 4px 8px rgb(0 0 0 / 0.1)`
      };
      min-height: 3rem;
      display: flex;
      align-items: center;
  `
);

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};
