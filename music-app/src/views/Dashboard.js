import React from 'react';
import { connect } from 'react-redux';

import { Grid } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';

import {
  getlikedSongs,
  getUsers,
  getSpotifyAccountDetails,
  persistUser,
} from '../actions';

import LikedSongs from '../components/dashboard/LikedSongs';
import MusicPlayer from '../components/dashboard/MusicPlayer';

import '../App.css';

class Dashboard extends React.Component {
  state = {
    collapse: false,
  };

  componentDidMount() {
    this.props.getSpotifyAccountDetails();
  }

  componentDidUpdate() {
    this.props.spotifyUser.id && this.props.persistUser(this.props.spotifyUser);
  }

  onClick() {
    this.setState({
      collapse: !this.state.collapse,
    });
  }

  logout = e => {
    e.preventDefault();
    localStorage.removeItem('token');
    this.props.history.push('/logout');
  };

  checkPremiumUser = () => {
    return this.props.spotifyUser.product &&
      this.props.fetchingSpotifyUser === false &&
      this.props.spotifyUser.product !== 'premium'
      ? true
      : false;
  };

  checkNoIOS = () => {
    return window.navigator.platform === 'iPhone' ||
      window.navigator.platform === 'iPad' ||
      window.navigator.platform === 'iPod'
      ? true
      : false;
  };
  render() {
    if (this.checkPremiumUser() || this.checkNoIOS()) {
      this.props.history.push('/info');
    }
    return (
      <div className='dashboard'>
        <div>
          <Button
            className='burger'
            style={{ color: 'white' }}
            onClick={() => this.onClick()}>
            <Grid container direction='column'>
              <div
                className={
                  this.state.collapse
                    ? 'line-one mobile-only toggle-line-one'
                    : 'line-one mobile-only'
                }
              />
              <div
                className={
                  this.state.collapse
                    ? 'line-two mobile-only toggle-line-two'
                    : 'line-two mobile-only'
                }
              />
              <div
                className={
                  this.state.collapse
                    ? 'line-three mobile-only toggle-line-three'
                    : 'line-three mobile-only'
                }
              />
            </Grid>
            Playlist
          </Button>
          <Button
            variant='contained'
            onClick={e => this.logout(e)}
            style={{
              color: 'white',
              backgroundColor: `rgba(${56}, ${182}, ${255}, ${0.6})`,
              fontWeight: '600',
              letterSpacing: '1.5px',
              position: 'absolute',
              right: '0px',
              marginRight: '5%',
              marginTop: '0.8%',
            }}>
            Logout
          </Button>
          <List>
            <Paper
              className={
                this.state.collapse ? 'side-menu-open' : 'side-menu-closed'
              }
              style={{
                maxHeight: 450,
                width: 280,
                overflow: 'auto',
                backgroundColor: `rgba(${20}, ${20}, ${20}, ${0.9})`,
                color: 'white',
              }}>
              <LikedSongs props={this.props} />
            </Paper>
          </List>
        </div>

        <Grid item>
          <MusicPlayer />
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  spotifyUser: state.getUsersReducer.spotifyUser,
  fetchingSpotifyUser: state.getUsersReducer.fetchingSpotifyUser,
});

export default connect(
  mapStateToProps,
  { getlikedSongs, getUsers, getSpotifyAccountDetails, persistUser },
)(Dashboard);
