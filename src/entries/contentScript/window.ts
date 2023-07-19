import { Draft } from '@reduxjs/toolkit'

export const adjustScrollToElement = (element: HTMLElement | Draft<HTMLElement>) => {
  element.scrollIntoView(true)
  window.scrollBy(0, -(window.innerHeight * 0.3))
}
