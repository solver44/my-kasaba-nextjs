import React from "react";
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from "@mui/base";
import { styled } from "@mui/system";
import areEqual from "@/utils/areEqual";
import { useEffect } from "react";

const NumberInput = React.forwardRef(function CustomNumberInput(
  { onChange, value, invalid, ...props },
  ref
) {
  // const end = props.endAdornment;
  // if (typeof window === "undefined") return null;

  useEffect(() => {
    if (value === 0 && onChange) onChange({ target: { value } });
  }, [value]);

  return (
    <BaseNumberInput
      slots={{
        root: StyledInputRoot,
        input: StyledInputElement,
        incrementButton: StyledButton,
        decrementButton: StyledButton,
      }}
      slotProps={{
        input: {
          "aria-valuetext": invalid,
        },
        incrementButton: {
          type: "button",
          children: "+",
        },
        decrementButton: {
          type: "button",
          children: "-",
        },
      }}
      error={!!invalid}
      onFocus={(e) => {
        setTimeout(() => {
          e.target.value = value;
        }, 0);
      }}
      value={value}
      onChange={(e, val) => {
        onChange({ target: { value: val || value } });
      }}
      {...props}
      endAdornment={<InputAdornment>{props.end}</InputAdornment>}
      ref={ref}
    />
  );
});
const blue = {
  100: "#DAECFF",
  200: "#80BFFF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const InputAdornment = styled("div")(
  ({ theme }) => `
  margin: 8px;
  display: inline-flex;
  align-items: center;
  font-size: var(--input-suffix-font-size);
  width: auto;
  justify-content: center;
  grid-row: 1/3;
  grid-column: 3/3;
  color: ${theme.palette.mode === "dark" ? grey[500] : grey[700]};
`
);

const StyledInputRoot = styled("div")(
  ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: var(--input-radius);
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: var(--input-shadow);
    display: grid;
    grid-template-columns: auto 1fr auto 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    // column-gap: 8px;
    padding: 2px 4px;

    &.${numberInputClasses.error}{
      border-color: red !important;
    }
    &.${numberInputClasses.disabled}{
      background: var(--input-disabled-color1);
      .${numberInputClasses.incrementButton}{
        display: none;
      }
      .${numberInputClasses.decrementButton}{
        display: none;
      }
    }
  
    &.${numberInputClasses.focused} {
      border-color: var(--input-outline-color);
    }
  
    &:hover {
      border-color: var(--input-outline-color);
    }
  
    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const StyledInputElement = styled("input")(
  ({ theme }) => `
    font-size: var(--input-inside-font-size);
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    // grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 6px;
    outline: 0;
  `
);

const StyledButton = styled("button")(
  ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 0;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 4/5;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 4/5;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === "dark" ? grey[800] : grey[200]};
    background: ${theme.palette.mode === "dark" ? grey[900] : grey[50]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    }
    & .arrow {
      transform: translateY(-1px);
    }
  `
);
export default React.memo(NumberInput, areEqual);
