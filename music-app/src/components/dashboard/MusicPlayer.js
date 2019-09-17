import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import {
  getCurrentSong,
  getTrackInfo,
  getSeveralTracks,
  postDSSong,
  transferPlaybackHere,
  getlikedSongs
} from '../../actions';
import SkipLeft from '../../assets/skip-left.png';
import SkipRight from '../../assets/skip-right.png';
import Rocket from '../../assets/rocket-like.png';
import Meteor from '../../assets/meteor-dislike.png';
import Pause from '../../assets/player-stop.png';
import Play from '../../assets/player-start.png';
import axios from 'axios';

// Styles
import '../../App.css';

// Features
import LinearDeterminate from '../LinearDeterminate';
import Chart from '../Chart';
import Characteristics from '../Characteristics.js';
import AudioDetails from './AudioDetails';
import { async } from 'q';

class MusicPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem('token'),
      deviceId: '',
      loggedIn: false,
      error: '',
      trackName: 'Track Name',
      artistName: 'Artist Name',
      albumName: 'Album Name',
      imageUrl: '',
      playing: false,
      position: 0,
      duration: 1,
      id: '',
      songFeatures: [],
      collapse: false,
      currentTrack: '',
      predictionPrompt: true
    };
    // this will later be set by setInterval
    this.playerCheckInterval = null;
  }

  componentDidMount() {
    this.handleLogin();
    this.props.postDSSong();
  }

  componentDidUpdate(prevProps) {
    if (this.props.song_id !== prevProps.song_id) {
      const id = this.props.song_id;
      console.log('FIRST LIKED', id);
      this.dsDelivery();
    }
  }

  async dsDelivery() {
    var config = {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') }
    };

    let response = await axios.get(
      `https://api.spotify.com/v1/audio-features/${this.props.song_id}`,
      config
    );
    if (response.status == 200) {
      console.log(response);
    }
  }

  concenateSongIds(array) {
    console.log('ARRAY', array);
    return array.map(song => song.values).join(',');
  }

  handleLogin() {
    if (this.state.token !== '') {
      this.setState({ loggedIn: true });
      this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
    }
  }

  openAudioDetails() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  // when we receive a new update from the player
  onStateChanged(state) {
    // only update if we got a real state
    if (state !== null) {
      const {
        current_track: currentTrack,
        position,
        duration
      } = state.track_window;
      const trackName = currentTrack.name;
      const albumName = currentTrack.album.name;
      const artistName = currentTrack.artists
        .map(artist => artist.name)
        .join(', ');
      const playing = !state.paused;
      this.setState({
        position,
        duration,
        trackName,
        albumName,
        artistName,
        playing
      });
    } else {
      // state was null, user might have swapped to another device
      this.setState({
        error: 'Looks like you might have swapped to another device?'
      });
    }
  }

  createEventHandlers() {
    this.player.on('initialization_error', e => {});

    this.player.on('authentication_error', e => {
      this.setState({ loggedIn: false });
    });

    this.player.on('account_error', e => {});

    this.player.on('playback_error', e => {});

    // ONLY WHEN PLAYER STATE CHANGED
    this.player.on('player_state_changed', state => {
      this.onStateChanged(state);
      if (this.props.song.id) {
        this.getCurrentSongFeatures(this.props.song.id);
      }
      // ONLY WHEN NEW SONG
      if (state.track_window.current_track.id !== this.state.currentTrack) {
        this.currentSong();
        /*   if (this.props.song.id) {
          this.getCurrentSongFeatures(this.props.song.id);
        } */

        this.setState({ currentTrack: state.track_window.current_track.id });
        this.player.setVolume(0);
        setTimeout(() => {
          this.player.pause();
          this.player.seek(1);
          this.player.setVolume(0.5);
        }, 2000);
        if (this.props.ds_songs.songs) {
          this.getDataScienceSongArray();
        }
      }
    });

    this.player.on('ready', async data => {
      let { device_id } = data;

      await this.setState({ deviceId: device_id, loggedIn: true });
      this.props.transferPlaybackHere(device_id);
    });
  }

  getDataScienceSongArray = () => {
    this.props.ds_songs.songs &&
      this.props.getSeveralTracks(
        this.concatenateSongIds(this.props.ds_songs.songs)
      );
  };

  concatenateSongIds(array) {
    return array.map(song => song.values).join(',');
  }

  createSpotifyUriArray(array) {
    return array.map(song => 'spotify:track:' + song.values);
  }

  checkForPlayer() {
    const { token } = this.state;

    if (window.Spotify !== undefined) {
      clearInterval(this.playerCheckInterval);

      this.player = new window.Spotify.Player({
        name: 'Music Meteorologist Spotify Player',
        getOAuthToken: cb => {
          cb(token);
        }
      });

      this.createEventHandlers();

      this.player.connect();
    }
  }

  currentSong() {
    this.props.getCurrentSong();
    if (this.props.song === undefined) {
      this.props.getCurrentSong();
    }
  }

  getCurrentSongFeatures = id => {
    this.props.getTrackInfo(id);
  };

  // -- SDK Player Song playback controls --

  onPrevClick() {
    this.player.previousTrack();
    this.player.setVolume(0);
    setTimeout(() => {
      this.player.pause();
      this.player.setVolume(0.5);
    }, 1000);
  }

  onPlayClick() {
    this.player.togglePlay();
  }

  onNextClick() {
    this.player.nextTrack();
    this.player.setVolume(0);
    this.player.playing && this.player.pause();
    setTimeout(() => {
      this.player.pause();
      this.player.setVolume(0.5);
    }, 2000);
    this.togglePredictionPrompt();
  }

  // -- Prediction Prompt Logic --

  togglePredictionPrompt() {
    this.player.resume();
    this.player.setVolume(0.5);
    this.setState({
      predictionPrompt: !this.state.predictionPrompt
    });
  }
  // BF
  // Once playlist or queue format is decided
  // ADD function to add current song to liked songs on spotify
  // Send input to BE
  toggleLikeButton() {
    this.player.nextTrack();
    this.player.setVolume(0);
    setTimeout(() => {
      this.player.pause();
      this.player.setVolume(0.5);
    }, 2000);
    this.setState({
      predictionPrompt: !this.state.predictionPrompt
    });
  }

  // BF
  // Once playlist or queue format is decided
  // ADD functionality to REMOVE current song from playlist/queue
  // Send input to BE
  toggleDislikeButton() {
    this.player.nextTrack();
    this.player.setVolume(0);
    setTimeout(() => {
      this.player.pause();
      this.player.setVolume(0.5);
    }, 2000);
    this.setState({
      predictionPrompt: !this.state.predictionPrompt
    });
  }

  render() {
    const { trackName, artistName, albumName, error, playing } = this.state;
    return (
      <div className='music-player joyride-player-2'>
        <div className='music-component'>
          <Grid item style={{ maxWidth: '300px' }}>
            {this.props.imageUrl[1] && (
              <img
                ref='image'
                src={this.props.imageUrl[1].url}
                alt='Album artwork cover.'
                style={{ maxWidth: '300px', objectFit: 'scale-down' }}
              />
            )}
            <p className='p' style={{ fontWeight: 'bold' }}>
              {trackName}
            </p>
            <p>{artistName}</p>
            <p>{albumName}</p>
          </Grid>
        </div>

        <div className='music-component music-chart'>
          <Grid
            container
            direction='column'
            justify='center'
            alignItems='center'>
            <Grid item>
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => this.openAudioDetails()}
                  className='grid-question grid-chart joyride-3'
                  title='Click for Audio Features details'
                  style={{ margin: 0, borderRadius: '25px' }}>
                  ?
                </button>
              </div>
              <List>
                <Paper
                  className={
                    this.state.collapse
                      ? 'audio-details-open'
                      : 'audio-details-closed'
                  }
                  style={{
                    maxHeight: 510,
                    width: 450,
                    overflow: 'auto',
                    backgroundColor: '#1a567a',
                    // backgroundColor: `rgba(${34}, ${109}, ${155}, ${0.98})`,
                    color: 'lightgray'
                  }}>
                  <AudioDetails />
                </Paper>
              </List>
              <Chart
                features={this.props.traits}
                style={{ width: '100%', objectFit: 'scale-down' }}
              />
            </Grid>
            <Grid item>
              {window.Spotify !== undefined &&
                this.state.imageUrl !== '' &&
                artistName !== 'Artist Name' && (
                  <div className='album-art'>
                    <h4 style={{ textAlign: 'center' }}>Now Playing</h4>
                    <img src={this.state.imageUrl} alt='album-art' />
                  </div>
                )}
            </Grid>

            {error && <p>Error: {error}</p>}

            {/* When predictionPrompt === true show className='yes-no-active' 
            On Yes/No click invoke onPlayclick();
            On Yes/No click enable 'yes-no-active' on Like/Dislike wrapper
          */}

            <Grid
              container
              direction='row'
              justify='center'
              alignItems='center'
              style={{ width: 300, marginBottom: '5%' }}>
              {/* YES NO */}
              <div
                className={
                  this.state.predictionPrompt
                    ? 'yes-no-wrapper yes-no-active '
                    : 'yes-no-wrapper yes-no-deactivated'
                }>
                <div className='yes-no-prompt'>
                  <p>Do you like it?</p>
                </div>
                <div className='yes-no-button-wrapper joyride-prediction-7'>
                  <div className='yes-button-wrapper'>
                    <button
                      className='yes-button'
                      onClick={() => this.togglePredictionPrompt()}>
                      Yes
                    </button>
                  </div>
                  <div className='no-button-wrapper'>
                    <button
                      className='no-button'
                      onClick={() => this.togglePredictionPrompt()}>
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* LIKE DISLIKE */}
              <div
                className={
                  this.state.predictionPrompt
                    ? 'like-dislike-wrapper yes-no-deactivated'
                    : 'like-dislike-wrapper yes-no-active'
                }>
                <div className='joyride-dislike-4'>
                  <button
                    className='like-dislike dislike joyride-dislike-4'
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none'
                    }}
                    onClick={() => this.toggleDislikeButton()}>
                    <img
                      src={Meteor}
                      alt='Dislike Button'
                      style={{ maxHeight: 70 }}
                    />
                  </button>
                  <h5 style={{ textAlign: 'center', marginTop: '10px' }}>
                    DISLIKE
                  </h5>
                </div>

                <div
                  style={{ padding: '0px 15px 0px 15px' }}
                  className='joyride-prediction-5'>
                  <h5 style={{ textAlign: 'center' }}>Prediction: </h5>
                  <h3 style={{ textAlign: 'center' }}>100% </h3>
                </div>
                <div className='joyride-like-6'>
                  <button
                    className='like-dislike like'
                    style={{
                      background: 'none',
                      border: 'none',
                      outline: 'none'
                    }}
                    onClick={() => this.toggleLikeButton()}>
                    <img
                      src={Rocket}
                      alt='Like Button'
                      style={{ maxHeight: 70 }}
                    />
                  </button>
                  <h5 style={{ textAlign: 'center', marginTop: '10px' }}>
                    LIKE
                  </h5>
                </div>
              </div>
            </Grid>

            <Grid
              container
              direction='column'
              justify='center'
              alignItems='center'
              style={{ width: 300, marginBottom: '5%' }}>
              <div>
                <LinearDeterminate player={this.player} />
              </div>
              <div style={{ display: 'flex' }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none'
                  }}
                  onClick={() => this.onPrevClick()}>
                  <img
                    src={SkipLeft}
                    alt='White icon to skip to the previous song.'
                    style={{ maxHeight: 22 }}
                  />
                </button>

                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none'
                  }}
                  onClick={() => this.onPlayClick()}>
                  {playing ? (
                    <img
                      ref={input => (this.inputElement = input)}
                      src={Pause}
                      alt='White icon to pause a song.'
                      style={{ maxHeight: 35 }}
                    />
                  ) : (
                    <img
                      /* ref={this.simulateClick} */
                      src={Play}
                      alt='White icon to start a pause song.'
                      style={{ maxHeight: 35 }}
                    />
                  )}
                </button>

                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    outline: 'none'
                  }}
                  onClick={() => this.onNextClick()}>
                  <img
                    src={SkipRight}
                    alt='White icon to skip to the next song.'
                    style={{ maxHeight: 22 }}
                  />
                </button>
              </div>
            </Grid>
          </Grid>
        </div>

        <div className='music-component'>
          <Characteristics features={this.props.traits} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  song: state.currentSongReducer.item,
  imageUrl: state.currentSongReducer.imageUrl,
  traits: state.getTrackInfoReducer,
  ds_songs: state.queueReducer.ds_songs,
  several_tracks: state.queueReducer.several_tracks,
  playerReady: state.playerReducer.playerReady,
  song_id: state.likedSongsReducer.song_id
});

export default connect(
  mapStateToProps,
  {
    getTrackInfo,
    getCurrentSong,
    postDSSong,
    getSeveralTracks,
    transferPlaybackHere,
    getlikedSongs
  }
)(MusicPlayer);
