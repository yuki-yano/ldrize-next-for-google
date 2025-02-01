import { Draft } from '@reduxjs/toolkit'

export const adjustScrollToElement = (element: Draft<HTMLElement> | HTMLElement) => {
  element.scrollIntoView(true)
  window.scrollBy(0, -(window.innerHeight * 0.3))
}
