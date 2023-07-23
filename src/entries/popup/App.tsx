import React, { ChangeEvent, Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import { Box, TextField, Button, SxProps, TextFieldProps } from '@mui/material'
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
} from '../const'

type BaseTextFieldProps = Omit<TextFieldProps, 'onChange' | 'value'> &
  Required<Pick<TextFieldProps, 'onChange' | 'value'>>

const BaseTextField: FC<BaseTextFieldProps> = (props) => <TextField {...props} />

const KeyTextField: FC<BaseTextFieldProps> = (props) => (
  <BaseTextField
    {...props}
    sx={{
      '.MuiInputBase-input': {
        fontFamily: 'monospace',
        fontSize: '0.8rem',
        width: '4rem',
      },
    }}
  />
)

const CssTextField: FC<BaseTextFieldProps> = (props) => (
  <BaseTextField
    {...props}
    multiline
    rows={4}
    fullWidth
    sx={{
      '.MuiInputBase-input': {
        fontFamily: 'monospace',
        fontSize: '0.8rem',
      },
    }}
  />
)

const App: React.FC = () => {
  const [nextKey, setNextKey] = useState('')
  const [prevKey, setPrevKey] = useState('')
  const [openKey, setOpenKey] = useState('')
  const [tabOpenKey, setTabOpenKey] = useState('')
  const [pinKey, setPinKey] = useState('')
  const [formKey, setFormKey] = useState('')

  const [selectedItemStyle, setSelectedItemStyle] = useState('')
  const [pinnedItemStyle, setPinnedItemStyle] = useState('')

  useEffect(() => {
    async function f() {
      const { nextKey, prevKey, openKey, tabOpenKey, pinKey, formKey, selectedItemStyle, pinnedItemStyle } =
        await browser.storage.sync.get([
          'nextKey',
          'prevKey',
          'openKey',
          'tabOpenKey',
          'pinKey',
          'formKey',
          'selectedItemStyle',
          'pinnedItemStyle',
        ])
      setNextKey(nextKey || DEFAULT_NEXT_KEY)
      setPrevKey(prevKey || DEFAULT_PREV_KEY)
      setOpenKey(openKey || DEFAULT_OPEN_KEY)
      setTabOpenKey(tabOpenKey || DEFAULT_TAB_OPEN_KEY)
      setPinKey(pinKey || DEFAULT_PIN_KEY)
      setFormKey(formKey || DEFAULT_FORM_KEY)

      setSelectedItemStyle(selectedItemStyle || DEFAULT_SELECTED_ITEM_STYLE)
      setPinnedItemStyle(pinnedItemStyle || DEFAULT_PINNED_ITEM_STYLE)
    }
    f()
  }, [])

  const handleKeyChange: (
    setValue: Dispatch<SetStateAction<string>>,
    currentValue: string
  ) => (event: ChangeEvent<HTMLInputElement>) => void = (setValue, currentValue) => (event) => {
    const newValue = event.target.value
    if (newValue.length > 0 && currentValue.length > 0) return
    setValue(newValue)
  }

  const saveToStorage = () => {
    browser.storage.sync.set({
      nextKey,
      prevKey,
      openKey,
      tabOpenKey,
      pinKey,
      formKey,
      selectedItemStyle,
      pinnedItemStyle,
    })
  }

  return (
    <Box sx={{ width: '400px', mx: 'auto', '& > :not(:last-child)': { my: 2 } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
        <Box>
          <KeyTextField id="nextKey" label="Next key" value={nextKey} onChange={handleKeyChange(setNextKey, nextKey)} />
        </Box>
        <Box>
          <KeyTextField id="prevKey" label="Prev key" value={prevKey} onChange={handleKeyChange(setPrevKey, prevKey)} />
        </Box>
        <Box>
          <KeyTextField id="openKey" label="Open key" value={openKey} onChange={handleKeyChange(setOpenKey, openKey)} />
        </Box>
        <Box>
          <KeyTextField
            id="tabOpenKey"
            label="Tab open key"
            value={tabOpenKey}
            onChange={handleKeyChange(setTabOpenKey, tabOpenKey)}
          />
        </Box>
        <Box>
          <KeyTextField id="pinKey" label="Pin key" value={pinKey} onChange={handleKeyChange(setPinKey, pinKey)} />
        </Box>
        <Box>
          <KeyTextField id="formKey" label="Form key" value={formKey} onChange={handleKeyChange(setFormKey, formKey)} />
        </Box>
      </Box>

      <CssTextField
        id="selectedItem"
        label="Selected item style"
        value={selectedItemStyle}
        onChange={(e) => setSelectedItemStyle(e.target.value)}
      />
      <CssTextField
        id="pinnedItem"
        label="Pinned item style"
        value={pinnedItemStyle}
        onChange={(e) => setPinnedItemStyle(e.target.value)}
      />
      <Button onClick={saveToStorage} variant="contained">
        Save
      </Button>
    </Box>
  )
}

export default App
