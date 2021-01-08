import { createStore } from 'redux'

export const actionTypes = {}

const initialState = {}

const rootReducer = (state=initialState, action) => {
    switch (action.type) {
        default:
          return state
      }
}

export default createStore(rootReducer)
