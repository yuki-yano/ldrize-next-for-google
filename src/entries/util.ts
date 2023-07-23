import browser from 'webextension-polyfill'
import {
  DEFAULT_FORM_KEY,
  DEFAULT_NEXT_KEY,
  DEFAULT_OPEN_KEY,
  DEFAULT_PINNED_ITEM_STYLE,
  DEFAULT_PIN_KEY,
  DEFAULT_PREV_KEY,
  DEFAULT_SELECTED_ITEM_STYLE,
  DEFAULT_TAB_OPEN_KEY,
} from './const'

export type Keys = {
  nextKey: string
  prevKey: string
  openKey: string
  tabOpenKey: string
  pinKey: string
  formKey: string
}

export const getKeys = async (): Promise<Keys> => {
  const { nextKey, prevKey, openKey, tabOpenKey, pinKey, formKey } = await browser.storage.sync.get([
    'nextKey',
    'prevKey',
    'openKey',
    'tabOpenKey',
    'pinKey',
    'formKey',
  ])

  return {
    nextKey: nextKey ?? DEFAULT_NEXT_KEY,
    prevKey: prevKey ?? DEFAULT_PREV_KEY,
    openKey: openKey ?? DEFAULT_OPEN_KEY,
    tabOpenKey: tabOpenKey ?? DEFAULT_TAB_OPEN_KEY,
    pinKey: pinKey ?? DEFAULT_PIN_KEY,
    formKey: formKey ?? DEFAULT_FORM_KEY,
  }
}

export const getStyles = async () => {
  const { selectedItemStyle, pinnedItemStyle } = await browser.storage.sync.get([
    'selectedItemStyle',
    'pinnedItemStyle',
  ])

  return {
    selectedItemStyle: selectedItemStyle ?? DEFAULT_SELECTED_ITEM_STYLE,
    pinnedItemStyle: pinnedItemStyle ?? DEFAULT_PINNED_ITEM_STYLE,
  }
}
