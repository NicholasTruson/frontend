import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { ProtectedRoute } from './components/protected.route';

import ReactGA from 'react-ga';

import Auth from './components/Auth';
import NavBar from './components/NavBar';
import MusicPlayer from './components/dashboard/MusicPlayer';
import Footer from './components/Footer.js';

import Logout from './views/Logout';
import Info from './views/Info';
import Dashboard from './views/Dashboard.js';
import './App.css';

/* import { MixpanelConsumer } from 'react-mixpanel'; */
/* import LikedSongs from './components/LikedSongs'; */

const history = createBrowserHistory();

history.listen(location => {
  ReactGA.set({ page: location.pathname }); // update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Router history={history}>
          <NavBar />
          {/* <MixpanelConsumer>
            {mixpanel => <ApiRunner mixpanel={mixpanel} />}
            {/* {mixpanel => <LikedSongs {...mixpanel} />} */}
          {/* </MixpanelConsumer> */}
          {/* <Route // Here we need to wrap this route within a <MixpanelConsumer>
            exact
            path='/likedsongs'
            render={props => <LikedSongs {...props} />}
          /> */}
          <Route exact path='/' render={props => <Auth {...props} />} />
          <Route exact path='/logout' component={Logout} />
          <Route exact path='/info' render={props => <Info {...props} />} />
          <Route exact path='/player' component={MusicPlayer} />
          <ProtectedRoute exact path='/dashboard' component={Dashboard} />
          <Footer />
        </Router>
      </div>
    );
  }
}

export default App;
