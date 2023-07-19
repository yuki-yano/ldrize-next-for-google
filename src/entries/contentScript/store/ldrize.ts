import { PayloadAction, createSlice, current } from '@reduxjs/toolkit'
import { castDraft } from 'immer'
import { store } from '.'
import { setStyle } from '../style'
import { adjustScrollToElement } from '../window'

export type Candidate = {
  element: HTMLElement
  link: string
  isSelected: boolean
  isPinned: boolean
}

type LdrizeState = {
  started: boolean
  candidates: Array<Candidate>
  cursor: number
}

const ldrizeInitialState: LdrizeState = {
  started: false,
  candidates: [],
  cursor: 0,
}

export const ldrizeSlice = createSlice({
  name: 'ldrize',
  initialState: ldrizeInitialState,
  reducers: {
    start: (state) => {
      state.started = true
    },
    updateCandidates: (state, action: PayloadAction<{ candidates: Array<Candidate> }>) => {
      const links = state.candidates.map((candidate) => candidate.link)
      const candidates = action.payload.candidates.filter((candidate) => !links.includes(candidate.link))
      state.candidates = castDraft([...state.candidates, ...candidates])
    },
    select: (state, action: PayloadAction<{ index: number }>) => {
      const { index } = action.payload
      state.candidates[index].isSelected = true
      setStyle(current(state.candidates[index]))
    },
    next: (state) => {
      const { cursor, candidates } = state
      const nextCursor = cursor + 1
      if (nextCursor >= candidates.length) {
        return
      }
      candidates[cursor].isSelected = false
      candidates[nextCursor].isSelected = true

      setStyle(current(candidates[cursor]))
      setStyle(current(candidates[nextCursor]))
      state.cursor = nextCursor

      adjustScrollToElement(candidates[nextCursor].element)
    },
    prev: (state) => {
      const { cursor, candidates } = state
      const prevCursor = cursor - 1
      if (prevCursor < 0) {
        return
      }
      candidates[cursor].isSelected = false
      candidates[prevCursor].isSelected = true

      setStyle(current(candidates[cursor]))
      setStyle(current(candidates[prevCursor]))
      state.cursor = prevCursor

      adjustScrollToElement(candidates[prevCursor].element)
    },
    open: (state) => {
      document.location.href = state.candidates[state.cursor].link
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
          setStyle(current(candidate))
        }
      }
    },
    pin: (state) => {
      if (state.candidates[state.cursor].isPinned) {
        state.candidates[state.cursor].isPinned = false
      } else {
        state.candidates[state.cursor].isPinned = true
      }

      const { cursor, candidates } = state
      const nextCursor = cursor + 1
      if (nextCursor >= candidates.length) {
        return
      }
      candidates[cursor].isSelected = false
      candidates[nextCursor].isSelected = true

      setStyle(current(candidates[cursor]))
      setStyle(current(candidates[nextCursor]))
      state.cursor = nextCursor

      adjustScrollToElement(candidates[nextCursor].element)
    },
  },
})

export const candidateSelector = (link: string): Candidate | undefined => {
  return store.getState().ldrize.candidates.find((candidate) => candidate.link === link)
}
export const startedSelector = () => store.getState().ldrize.started
export const currentCandidateSelector = () => store.getState().ldrize.candidates[store.getState().ldrize.cursor]
