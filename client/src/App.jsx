import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import Navbar from './pages/layout/Navbar';
import Landing from './pages/layout/Landing';
import Routes from './pages/routing/Routes';
import Menu from './pages/layout/Menu';

import store from './store';
import { loadUser } from './actions/auth';

import setAuthToken from './utils/setAuthToken';
import './stylesheet/menuLayout/style.css';
import './stylesheet/mainLayout/App.css';
import './stylesheet/authLayout/auth.css';
import './stylesheet/formsLayout/forms.css';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <main>
          <Navbar />
          <div className="rowLayout">
            <Menu />
            <Switch>
              <Route exact path="/" component={Landing} />
              <Route component={Routes} />
            </Switch>
          </div>
        </main>
      </Router>
    </Provider>
  );
}

export default App;
