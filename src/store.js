import { createStore } from 'redux'

export const actionTypes = {}

const initialState = {}

function rootReducer (state=initialState, action) {
    switch (action.type) {
        default:
          return state
      }
}

const store = createStore(rootReducer)

export default store
