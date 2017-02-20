import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import Router from 'react-router/lib/Router';
import Route from 'react-router/lib/Route';
import browserHistory from 'react-router/lib/browserHistory';
import IndexRoute from 'react-router/lib/IndexRoute';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';

import reducers from './reducers';
import { createAuthListener } from './reducers/firebase';

import App from './components/App';
import ContentPiece from './components/ContentPiece';
import Home from './components/Home';
import NotFound from './components/NotFound';
import SignIn from './components/SignIn';
import './index.css';

const reactRouterReduxMiddleware = routerMiddleware(browserHistory);
let store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  }),
  applyMiddleware(thunkMiddleware, reactRouterReduxMiddleware)
);

if (process.env.NODE_ENV === 'development') {
  const loggerMiddleware = createLogger();
  store = createStore(
    combineReducers({
      ...reducers,
      routing: routerReducer,
    }),
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware,
      reactRouterReduxMiddleware
    )
  );
}

createAuthListener(store);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
      <Route path="/" component={App}>
        <IndexRoute component={Home} />
        <Route path="/about" component={ContentPiece} />
        <Route path="/about/:slug" component={ContentPiece} />
        <Route path="/campaigns" component={ContentPiece} />
        <Route path="/campaigns/:slug" component={ContentPiece} />
        <Route path="/get-involved" component={ContentPiece} />
        <Route path="/get-involved/:slug" component={ContentPiece} />
        <Route path="/sign-in" component={SignIn} />
        <Route path="/**" component={NotFound} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);
