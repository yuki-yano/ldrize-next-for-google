import browser from 'webextension-polyfill'
import { Draft } from '@reduxjs/toolkit'
import { Candidate } from './store/ldrize'
import { getDefaultStyles } from '../util'

let selectedItemStyle = ''
let pinnedItemStyle = ''
getDefaultStyles().then((style) => {
  selectedItemStyle = style.selectedItemStyle
  pinnedItemStyle = style.pinnedItemStyle
})

export const setSelectedStyle = (element: HTMLElement | Draft<HTMLElement>) => {
  element.style.cssText = selectedItemStyle
}

export const setPinStyle = (element: HTMLElement | Draft<HTMLElement>) => {
  element.style.cssText = pinnedItemStyle
}

export const setStyle = (candidate: Candidate | Draft<Candidate>) => {
  const { isSelected, isPinned, element } = candidate
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
}
