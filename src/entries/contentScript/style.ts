import { Draft } from "@reduxjs/toolkit";
import { Candidate } from "./store/ldrize";

const SELECTED_BACKGROUND_COLOR = "#EFF4F8";
const SELECTED_BORDER_COLOR = "#C4E6F8";

export const setSelectedStyle = (element: HTMLElement | Draft<HTMLElement>) => {
  element.style.background = SELECTED_BACKGROUND_COLOR;
  element.style.border = `2px solid ${SELECTED_BORDER_COLOR}`;
};

const PINNED_BORDER_COLOR = "#E4645C";

export const setPinStyle = (element: HTMLElement | Draft<HTMLElement>) => {
  element.style.borderLeft = `${PINNED_BORDER_COLOR} 4px solid`;
  element.style.paddingLeft = "4px";
};

export const setStyle = (candidate: Candidate | Draft<Candidate>) => {
  const { isSelected, isPinned, element } = candidate;
  if (isSelected) {
    setSelectedStyle(element);
  }
  if (isPinned) {
    setPinStyle(element);
  }

  if (!isSelected && !isPinned) {
    element.style.border = "none";
    element.style.background = "none";
  }
  if (!isSelected && isPinned) {
    element.style.borderLeft = "none";
    element.style.paddingLeft = "0";
    setPinStyle(element);
  }
};
