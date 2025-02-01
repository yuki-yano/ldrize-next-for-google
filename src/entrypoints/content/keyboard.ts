import { Keys } from '../../util'
import { dispatch } from './store'
import { ldrizeSlice } from './store/ldrize'

let isLoaded = false

export const setUpLdrizeEventListener = ({ formKey, nextKey, openKey, pinKey, prevKey, tabOpenKey }: Keys) => {
  if (isLoaded) {
    return
  }

  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const definedKeys = [formKey, nextKey, openKey, pinKey, prevKey, tabOpenKey]

      if (
        !(document.activeElement instanceof HTMLInputElement) &&
        !(document.activeElement instanceof HTMLTextAreaElement) &&
        definedKeys.includes(event.key)
      ) {
        event.preventDefault()
        event.stopPropagation()

        switch (event.key) {
          case formKey:
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

          case nextKey:
            dispatch(ldrizeSlice.actions.next())
            break

          case openKey:
            dispatch(ldrizeSlice.actions.open())
            break

          case pinKey:
            dispatch(ldrizeSlice.actions.pin())
            break

          case prevKey:
            dispatch(ldrizeSlice.actions.prev())
            break

          case tabOpenKey:
            dispatch(ldrizeSlice.actions.tabOpen())
            break

          default:
            return
        }
      }
    },
    true,
  )

  isLoaded = true
}
