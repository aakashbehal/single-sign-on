import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducer"

const middleware = [thunk];

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(...middleware),
        ((window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
            (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__()) ||
        compose
    )
)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store