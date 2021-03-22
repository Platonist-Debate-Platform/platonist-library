import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore, Store } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import { createLogicMiddleware } from 'redux-logic';

import createRootReducer, { reactReduxRequest } from './Reducer';
import { GlobalState } from './Types';
import { isDevelopment } from '../Config';

const logger = createLogger({
  collapsed: true,
});

export const history = createBrowserHistory();

const logics = reactReduxRequest.createLogic();

const logicMiddleware = createLogicMiddleware(logics);

const middleware = isDevelopment
  ? composeWithDevTools(
      applyMiddleware(routerMiddleware(history), logger, logicMiddleware),
    )
  : applyMiddleware(routerMiddleware(history), logicMiddleware);

export const configureStore = (preloadedState?: GlobalState): Store => {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    {},
    middleware,
  );

  return store;
};

export default configureStore;
