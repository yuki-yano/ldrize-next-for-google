import { Draft } from '@reduxjs/toolkit'

import { getStyles } from '../../util'
import { Candidate } from './store/ldrize'

let selectedItemStyle = ''
let pinnedItemStyle = ''

const setSelectedStyle = (element: Draft<HTMLElement> | HTMLElement) => {
  element.style.cssText = selectedItemStyle
}

const setPinStyle = (element: Draft<HTMLElement> | HTMLElement) => {
  element.style.cssText = pinnedItemStyle
}

export const setStyle = ({ elementSelector, isPinned, isSelected }: Candidate) => {
  const element = document.querySelector(elementSelector) as HTMLElement

  getStyles().then((style) => {
    selectedItemStyle = style.selectedItemStyle
    pinnedItemStyle = style.pinnedItemStyle

    if (isSelected) {
      setSelectedStyle(element)
    }
    if (isPinned) {
      setPinStyle(element)
    }

    if (!isSelected && !isPinned) {
      element.style.cssText = ''
    }
    if (!isSelected && isPinned) {
      element.style.cssText = pinnedItemStyle
      setPinStyle(element)
    }
    if (isSelected && isPinned) {
      element.style.cssText = selectedItemStyle + pinnedItemStyle
    }
  })
}
