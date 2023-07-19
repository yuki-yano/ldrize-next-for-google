import browser from 'webextension-polyfill'
import { DEFAULT_PINNED_ITEM_STYLE, DEFAULT_SELECTED_ITEM_STYLE } from './const'

export const getDefaultStyles = async () => {
  const { selectedItemStyle, pinnedItemStyle } = await browser.storage.sync.get([
    'selectedItemStyle',
    'pinnedItemStyle',
  ])
  return {
    selectedItemStyle: selectedItemStyle ?? DEFAULT_SELECTED_ITEM_STYLE,
    pinnedItemStyle: pinnedItemStyle ?? DEFAULT_PINNED_ITEM_STYLE,
  }
}
