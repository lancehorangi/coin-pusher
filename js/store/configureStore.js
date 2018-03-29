/**
 */

"use strict";

import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import promise from "./promise";
import array from "./array";
import analytics from "./analytics";
import reducers from "../reducers";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";
import { ensureCompatibility } from "./compatibility";
//import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";
//import hardSet from "redux-persist/lib/stateReconciler/hardSet";

const isDebuggingInChrome = true;

const logger = createLogger({
  predicate: (getState, action) => isDebuggingInChrome,
  collapsed: true,
  duration: true
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["lobby", "appNavigator", "mall", "room"],
  //stateReconciler: hardSet
};

const createF8Store = applyMiddleware(thunk, promise, array, analytics, logger)(
  createStore
);

async function configureStore(onComplete: ?() => void) {
  const didReset = await ensureCompatibility();
  const persistedReducer = persistReducer(persistConfig, reducers);
  const store = createF8Store(persistedReducer);
  let persistor = persistStore(store, null, () => onComplete(store, didReset));
  //persistStore(store, { storage: AsyncStorage }, _ => onComplete(didReset));

  // const store = createStore(
  //   reducers,
  //   // applyMiddleware() tells createStore() how to handle middleware
  //   applyMiddleware(thunk, promise, array, analytics, logger)
  // );
  // onComplete(store);

  if (isDebuggingInChrome) {
    window.store = store;
  }
  return store;
}

//  function configureStore() {
//   //const didReset = await ensureCompatibility();
//   const store = createF8Store(reducers);
//   //const persistor = persistStore(store);
//   //persistStore(store, { storage: AsyncStorage }, _ => onComplete(didReset));
//
//   if (isDebuggingInChrome) {
//     window.store = store;
//   }
//   return store;
// }

module.exports = configureStore;
