import React, { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'
import browser from 'webextension-polyfill'
import { getDefaultStyles } from '../util'

interface CssTextFieldProps {
  id: string
  label: string
  value: string
  onValueChange: (newValue: string) => void
}

let selectedItemStyle = ''
let pinnedItemStyle = ''
getDefaultStyles().then((styles) => {
  selectedItemStyle = styles.selectedItemStyle
  pinnedItemStyle = styles.pinnedItemStyle
})

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
  const [selectedItem, setSelectedItem] = useState(selectedItemStyle)
  const [pinnedItem, setPinnedItem] = useState(pinnedItemStyle)

  const saveToStorage = () => {
    browser.storage.sync.set({
      selectedItemStyle: selectedItem,
      pinnedItemStyle: pinnedItem,
    })
  }

  return (
    <Box sx={{ width: '400px', mx: 'auto', '& > :not(:last-child)': { mb: 2 } }}>
      <CssTextField
        id="selectedItem"
        label="Selected item style"
        value={selectedItem}
        onValueChange={setSelectedItem}
      />
      <CssTextField id="pinnedItem" label="Pinned item style" value={pinnedItem} onValueChange={setPinnedItem} />
      <Button onClick={saveToStorage} variant="contained">
        Save
      </Button>
    </Box>
  )
}

export default App
