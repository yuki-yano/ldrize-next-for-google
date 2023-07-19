import { setUpLdrizeEventListener } from './keyboard'
import { dispatch } from './store'
import { candidateSelector, ldrizeSlice } from './store/ldrize'

const getLinkFromItem = (item: Element): string | undefined => {
  return item.querySelector<HTMLAnchorElement>('div > a')?.href
}

const createCandidates = (items: Array<Element>) => {
  return items.map((item) => {
    const link = getLinkFromItem(item) as string
    const element = item as HTMLElement
    const candidate = candidateSelector(link)
    const isSelected = candidate?.isSelected ?? false
    const isPinned = candidate?.isPinned ?? false

    return { element, link, isSelected, isPinned }
  })
}

const getItems = () => {
  return [...document.querySelectorAll('div.g')].filter(
    (item) => item.classList.contains('g') && item.className.startsWith('g') && item.getBoundingClientRect().height > 0
  )
}

const updateItems = (items: Array<Element>) => {
  const candidates = createCandidates(items)
  dispatch(ldrizeSlice.actions.updateCandidates({ candidates }))
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

const initialize = () => {
  dispatch(ldrizeSlice.actions.start())
  setUpLdrizeEventListener()

  const items = getItems()
  if (items.length > 0) {
    updateItems(items)
    dispatch(ldrizeSlice.actions.select({ index: 0 }))
  }
}

const main = () => {
  const resElement = document.querySelector('#res')
  if (resElement === null) {
    return
  }

  observer.observe(resElement, { childList: true, subtree: true })
  initialize()
}

main()
