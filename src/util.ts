import { is } from '@core/unknownutil'
import browser from 'webextension-polyfill'

import {
  DEFAULT_FORM_KEY,
  DEFAULT_NEXT_KEY,
  DEFAULT_OPEN_KEY,
  DEFAULT_PIN_KEY,
  DEFAULT_PINNED_ITEM_STYLE,
  DEFAULT_PREV_KEY,
  DEFAULT_SELECTED_ITEM_STYLE,
  DEFAULT_TAB_OPEN_KEY,
} from './const'

export type Keys = {
  formKey: string
  nextKey: string
  openKey: string
  pinKey: string
  prevKey: string
  tabOpenKey: string
}

export const getDefaultKey = (key: unknown, defaultKey: string): string => {
  if (is.String(key)) {
    return key
  }
  return defaultKey
}

export const getDefaultStyle = (style: unknown, defaultStyle: string): string => {
  if (is.String(style)) {
    return style
  }
  return defaultStyle
}

export const getKeys = async (): Promise<Keys> => {
  const { formKey, nextKey, openKey, pinKey, prevKey, tabOpenKey } = await browser.storage.sync.get([
    'formKey',
    'nextKey',
    'openKey',
    'pinKey',
    'prevKey',
    'tabOpenKey',
  ])

  return {
    formKey: getDefaultKey(formKey, DEFAULT_FORM_KEY),
    nextKey: getDefaultKey(nextKey, DEFAULT_NEXT_KEY),
    openKey: getDefaultKey(openKey, DEFAULT_OPEN_KEY),
    pinKey: getDefaultKey(pinKey, DEFAULT_PIN_KEY),
    prevKey: getDefaultKey(prevKey, DEFAULT_PREV_KEY),
    tabOpenKey: getDefaultKey(tabOpenKey, DEFAULT_TAB_OPEN_KEY),
  }
}

export const getStyles = async () => {
  const { pinnedItemStyle, selectedItemStyle } = await browser.storage.sync.get([
    'selectedItemStyle',
    'pinnedItemStyle',
  ])

  return {
    pinnedItemStyle: getDefaultStyle(pinnedItemStyle, DEFAULT_PINNED_ITEM_STYLE),
    selectedItemStyle: getDefaultStyle(selectedItemStyle, DEFAULT_SELECTED_ITEM_STYLE),
  }
}
