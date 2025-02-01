import { defineContentScript } from 'wxt/sandbox'

import { setUpLdrizeEventListener } from '~/entrypoints/content/keyboard'
import { dispatch } from '~/entrypoints/content/store'
import { candidateSelector, ldrizeSlice } from '~/entrypoints/content/store/ldrize'

import { getKeys } from '../../util'

const GOOGLE_RES_ELEMENT_ID = '#res'
const KAGI_RES_ELEMENT_ID = '#main'

const GOOGLE_GET_LINK_SELECTOR = 'div a'
const KAGI_GET_LINK_SELECTOR = 'a'

const createGoogleElementSelector = (link: string) => `div.g:has(a[href="${link}"])`
const createKagiElementSelector = (link: string) => `h3:has(a[href="${link}"])`

const getLinkFromItem = (item: Element): string | undefined => {
  const getLinkSelector = document.URL.includes('google')
    ? GOOGLE_GET_LINK_SELECTOR
    : document.URL.includes('kagi')
    ? KAGI_GET_LINK_SELECTOR
    : ''

  return item.querySelector<HTMLAnchorElement>(getLinkSelector)?.href
}

const createCandidates = (items: Array<Element>) => {
  return items.map((item) => {
    const link = getLinkFromItem(item) as string
    let elementSelector: string
    if (document.URL.includes('google')) {
      elementSelector = createGoogleElementSelector(link)
    } else if (document.URL.includes('kagi')) {
      elementSelector = createKagiElementSelector(link)
    } else {
      throw new Error('Invalid URL')
    }

    const candidate = candidateSelector(link)
    const isSelected = candidate?.isSelected ?? false
    const isPinned = candidate?.isPinned ?? false

    return { elementSelector, isPinned, isSelected, link }
  })
}

const googleItemFilter = (item: Element) => item.classList.contains('g') && item.className.startsWith('g') && item.getBoundingClientRect().height > 0
const kagiItemFilter = (item: Element) => item.querySelector('a') != null

const getItems = (): Array<Element> => {
  if (document.URL.includes('google')) {
    return [...document.querySelectorAll('div.g')].filter(googleItemFilter)
  }

  if (document.URL.includes('kagi')) {
    return [...document.querySelectorAll('div.__sri-title')].filter(kagiItemFilter)
  }

  return []
}

const updateItems = (items: Array<Element>) => {
  const candidates = createCandidates(items)
  dispatch(ldrizeSlice.actions.updateCandidates({ candidates }))
}

const initialize = async () => {
  dispatch(ldrizeSlice.actions.start())
  const keys = await getKeys()
  setUpLdrizeEventListener(keys)

  const items = getItems()
  console.log(items)
  if (items.length > 0) {
    updateItems(items)
    dispatch(ldrizeSlice.actions.select({ index: 0 }))
  }
}

export default defineContentScript({
  main() {
    const resElementKey = document.URL.includes('google') ? GOOGLE_RES_ELEMENT_ID : KAGI_RES_ELEMENT_ID
    const resElement = document.querySelector(resElementKey)
    if (resElement === null) {
      return
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          const items = getItems()
          if (items.length > 0) {
            updateItems(items)
          }
        }
      })
    })

    observer.observe(resElement, { childList: true, subtree: true })
    initialize()
  },
  matches: ['*://*.google.com/*', '*://*.google.co.jp/*', '*://kagi.com/*', '*://*.kagi.com/*'],
})
