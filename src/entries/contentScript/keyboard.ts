import { Keys } from '../util'
import { dispatch } from './store'
import { ldrizeSlice } from './store/ldrize'

let isLoaded = false

export const setUpLdrizeEventListener = ({ nextKey, prevKey, openKey, tabOpenKey, pinKey, formKey }: Keys) => {
  if (isLoaded) {
    return
  }

  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (
      !(document.activeElement instanceof HTMLInputElement) &&
      !(document.activeElement instanceof HTMLTextAreaElement)
    ) {
      switch (event.key) {
        case nextKey:
          event.preventDefault()
          event.stopPropagation()
          dispatch(ldrizeSlice.actions.next())
          break

        case prevKey:
          event.preventDefault()
          event.stopPropagation()
          dispatch(ldrizeSlice.actions.prev())
          break

        case openKey:
          event.preventDefault()
          event.stopPropagation()
          dispatch(ldrizeSlice.actions.open())
          break

        case tabOpenKey:
          event.preventDefault()
          event.stopPropagation()
          dispatch(ldrizeSlice.actions.tabOpen())
          break

        case pinKey:
          event.preventDefault()
          event.stopPropagation()
          dispatch(ldrizeSlice.actions.pin())
          break

        case formKey:
          event.preventDefault()
          event.stopPropagation()

          // NOTE: for Chrome
          if (process.env.BROWSER === 'CHROME') {
            const inputElement = document.querySelector('textarea[name="q"]') as HTMLTextAreaElement | null
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
