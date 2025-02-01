import type { TextFieldProps } from '@mui/material/TextField'
import type React from 'react'

import { is, maybe } from '@core/unknownutil'
import { Box, Button, TextField } from '@mui/material'
import { type ChangeEvent, type Dispatch, type FC, type SetStateAction, useEffect, useState } from 'react'
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
} from '~/const'

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
    fullWidth
    multiline
    rows={4}
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
      let { _formKey, _nextKey, _openKey, _pinKey, _pinnedItemStyle, _prevKey, _selectedItemStyle, _tabOpenKey } =
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

      const __nextKey = maybe(_nextKey, is.String) ?? DEFAULT_NEXT_KEY
      const __prevKey = maybe(_prevKey, is.String) ?? DEFAULT_PREV_KEY
      const __openKey = maybe(_openKey, is.String) ?? DEFAULT_OPEN_KEY
      const __tabOpenKey = maybe(_tabOpenKey, is.String) ?? DEFAULT_TAB_OPEN_KEY
      const __pinKey = maybe(_pinKey, is.String) ?? DEFAULT_PIN_KEY
      const __formKey = maybe(_formKey, is.String) ?? DEFAULT_FORM_KEY
      const __selectedItemStyle = maybe(_selectedItemStyle, is.String) ?? DEFAULT_SELECTED_ITEM_STYLE
      const __pinnedItemStyle = maybe(_pinnedItemStyle, is.String) ?? DEFAULT_PINNED_ITEM_STYLE

      setNextKey(__nextKey)
      setPrevKey(__prevKey)
      setOpenKey(__openKey)
      setTabOpenKey(__tabOpenKey)
      setPinKey(__pinKey)
      setFormKey(__formKey)
      setSelectedItemStyle(__selectedItemStyle)
      setPinnedItemStyle(__pinnedItemStyle)
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
      formKey,
      nextKey,
      openKey,
      pinKey,
      pinnedItemStyle,
      prevKey,
      selectedItemStyle,
      tabOpenKey,
    })
  }

  return (
    <Box sx={{ '& > :not(:last-child)': { my: 2 }, mx: 'auto', width: '400px' }}>
      <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <Box>
          <KeyTextField id="nextKey" label="Next key" onChange={handleKeyChange(setNextKey, nextKey)} value={nextKey} />
        </Box>
        <Box>
          <KeyTextField id="prevKey" label="Prev key" onChange={handleKeyChange(setPrevKey, prevKey)} value={prevKey} />
        </Box>
        <Box>
          <KeyTextField id="openKey" label="Open key" onChange={handleKeyChange(setOpenKey, openKey)} value={openKey} />
        </Box>
        <Box>
          <KeyTextField
            id="tabOpenKey"
            label="Tab open key"
            onChange={handleKeyChange(setTabOpenKey, tabOpenKey)}
            value={tabOpenKey}
          />
        </Box>
        <Box>
          <KeyTextField id="pinKey" label="Pin key" onChange={handleKeyChange(setPinKey, pinKey)} value={pinKey} />
        </Box>
        <Box>
          <KeyTextField id="formKey" label="Form key" onChange={handleKeyChange(setFormKey, formKey)} value={formKey} />
        </Box>
      </Box>

      <CssTextField
        id="selectedItem"
        label="Selected item style"
        onChange={(e) => setSelectedItemStyle(e.target.value)}
        value={selectedItemStyle}
      />
      <CssTextField
        id="pinnedItem"
        label="Pinned item style"
        onChange={(e) => setPinnedItemStyle(e.target.value)}
        value={pinnedItemStyle}
      />
      <Button onClick={saveToStorage} variant="contained">
        Save
      </Button>
    </Box>
  )
}

export default App
