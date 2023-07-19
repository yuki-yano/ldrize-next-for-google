import React, { useEffect, useState } from 'react'
import { Box, TextField, Button } from '@mui/material'
import browser from 'webextension-polyfill'
import { DEFAULT_PINNED_ITEM_STYLE, DEFAULT_SELECTED_ITEM_STYLE } from '../const'

interface CssTextFieldProps {
  id: string
  label: string
  value: string
  onValueChange: (newValue: string) => void
}

const CssTextField: React.FC<CssTextFieldProps> = ({ id, label, value, onValueChange }) => (
  <TextField
    id={id}
    label={label}
    multiline
    rows={4}
    fullWidth
    variant="outlined"
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    sx={{ fontFamily: 'monospace', fontSize: '0.6rem' }}
  />
)

const App: React.FC = () => {
  const [selectedItemStyle, setSelectedItemStyle] = useState('')
  const [pinnedItemStyle, setPinnedItemStyle] = useState('')

  useEffect(() => {
    async function f() {
      const { selectedItemStyle, pinnedItemStyle } = await browser.storage.sync.get([
        'selectedItemStyle',
        'pinnedItemStyle',
      ])
      setSelectedItemStyle(selectedItemStyle || DEFAULT_SELECTED_ITEM_STYLE)
      setPinnedItemStyle(pinnedItemStyle || DEFAULT_PINNED_ITEM_STYLE)
    }
    f()
  }, [])

  const saveToStorage = () => {
    browser.storage.sync.set({
      selectedItemStyle,
      pinnedItemStyle,
    })
  }

  return (
    <Box sx={{ width: '400px', mx: 'auto', '& > :not(:last-child)': { mb: 2 } }}>
      <CssTextField
        id="selectedItem"
        label="Selected item style"
        value={selectedItemStyle}
        onValueChange={setSelectedItemStyle}
      />
      <CssTextField
        id="pinnedItem"
        label="Pinned item style"
        value={pinnedItemStyle}
        onValueChange={setPinnedItemStyle}
      />
      <Button onClick={saveToStorage} variant="contained">
        Save
      </Button>
    </Box>
  )
}

export default App
