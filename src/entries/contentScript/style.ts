import { Draft } from '@reduxjs/toolkit'
import { Candidate } from './store/ldrize'
import { getDefaultStyles } from '../util'

let selectedItemStyle = ''
let pinnedItemStyle = ''

const setSelectedStyle = (element: HTMLElement | Draft<HTMLElement>) => {
  element.style.cssText = selectedItemStyle
}

const setPinStyle = (element: HTMLElement | Draft<HTMLElement>) => {
  element.style.cssText = pinnedItemStyle
}

export const setStyle = (candidate: Draft<Candidate>) => {
  const { isSelected, isPinned, element } = candidate

  getDefaultStyles().then((style) => {
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
  })
}
