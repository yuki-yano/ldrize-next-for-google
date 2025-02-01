import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { castDraft } from 'immer'

import { setStyle } from '../style.js'
import { adjustScrollToElement } from '../window.js'
import { store } from './index.js'

export type Candidate = {
  elementSelector: string
  isPinned: boolean
  isSelected: boolean
  link: string
}

type LdrizeState = {
  candidates: Array<Candidate>
  cursor: number
  started: boolean
}

const ldrizeInitialState: LdrizeState = {
  candidates: [],
  cursor: 0,
  started: false,
}

export const ldrizeSlice = createSlice({
  initialState: ldrizeInitialState,
  name: 'ldrize',
  reducers: {
    next: (state) => {
      const { candidates, cursor } = state
      const nextCursor = cursor + 1
      if (nextCursor >= candidates.length) {
        return
      }
      candidates[cursor].isSelected = false
      candidates[nextCursor].isSelected = true

      const nextElement = document.querySelector(candidates[nextCursor].elementSelector) as HTMLElement
      setStyle(candidates[cursor])
      setStyle(candidates[nextCursor])
      state.cursor = nextCursor

      adjustScrollToElement(nextElement)
    },
    open: (state) => {
      document.location.href = state.candidates[state.cursor].link
    },
    pin: (state) => {
      if (state.candidates[state.cursor].isPinned) {
        state.candidates[state.cursor].isPinned = false
      } else {
        state.candidates[state.cursor].isPinned = true
      }

      const { candidates, cursor } = state
      const nextCursor = cursor + 1
      if (nextCursor >= candidates.length) {
        return
      }
      candidates[cursor].isSelected = false
      candidates[nextCursor].isSelected = true

      const nextElement = document.querySelector(candidates[nextCursor].elementSelector) as HTMLElement
      setStyle(candidates[cursor])
      setStyle(candidates[nextCursor])

      state.cursor = nextCursor

      adjustScrollToElement(nextElement)
    },
    prev: (state) => {
      const { candidates, cursor } = state
      const prevCursor = cursor - 1
      if (prevCursor < 0) {
        return
      }
      candidates[cursor].isSelected = false
      candidates[prevCursor].isSelected = true

      const prevElement = document.querySelector(candidates[prevCursor].elementSelector) as HTMLElement
      setStyle(candidates[cursor])
      setStyle(candidates[prevCursor])
      state.cursor = prevCursor

      adjustScrollToElement(prevElement)
    },
    select: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload
      state.candidates[index].isSelected = true
      setStyle(state.candidates[index])
    },
    start: (state) => {
      state.started = true
    },
    tabOpen: (state) => {
      const candidates = state.candidates.filter((candidate) => candidate.isPinned)
      if (candidates.length === 0) {
        const url = state.candidates.find((candidate) => candidate.isSelected)?.link
        window.open(url, '_blank')
      } else {
        for (const candidate of candidates) {
          window.open(candidate.link, '_blank')
          candidate.isPinned = false
          setStyle(candidate)
        }
      }
    },
    updateCandidates: (state, action: PayloadAction<{ candidates: Array<Candidate> }>) => {
      const links = state.candidates.map((candidate) => candidate.link)
      const candidates = action.payload.candidates.filter((candidate) => !links.includes(candidate.link))
      state.candidates = castDraft([...state.candidates, ...candidates])
    },
  },
})

export const candidateSelector = (link: string): Candidate | undefined => {
  return store.getState().ldrize.candidates.find((candidate) => candidate.link === link)
}
export const startedSelector = () => store.getState().ldrize.started
export const currentCandidateSelector = () => store.getState().ldrize.candidates[store.getState().ldrize.cursor]
