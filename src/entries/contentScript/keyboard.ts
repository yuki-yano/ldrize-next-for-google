import { dispatch } from './store'
import { ldrizeSlice } from './store/ldrize'

let isLoaded = false

export const setUpLdrizeEventListener = () => {
  if (isLoaded) {
    return
  }
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLTextAreaElement)
    ) {
      switch (e.key) {
        case 'j':
          e.preventDefault()
          e.stopPropagation()

          dispatch(ldrizeSlice.actions.next())

          break
        case 'k':
          e.preventDefault()
          e.stopPropagation()

          dispatch(ldrizeSlice.actions.prev())

          break
        case 'p':
          e.preventDefault()
          e.stopPropagation()

          dispatch(ldrizeSlice.actions.pin())

          break
        case 'o':
          e.preventDefault()
          e.stopPropagation()

          dispatch(ldrizeSlice.actions.tabOpen())

          break
        case 'v':
          e.preventDefault()
          e.stopPropagation()

          dispatch(ldrizeSlice.actions.open())

          break
        case 'i':
          e.preventDefault()
          e.stopPropagation()

          // NOTE: for Chrome
          if (process.env.BROWSER === 'CHROME') {
            const inputElement = document.querySelector('input[name="q"]') as HTMLInputElement | null
            if (inputElement) {
              inputElement.focus()
              inputElement.click()
              inputElement.setSelectionRange(inputElement.value.length, inputElement.value.length)
            }
          } else {
            // NOTE: for Firefox
            document.dispatchEvent(new KeyboardEvent('keydown', { key: '/' }))
          }

          break

        default:
          return
      }
    }
  })

  isLoaded = true
}
