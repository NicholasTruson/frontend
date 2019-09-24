import React from 'react';
import { connect } from 'react-redux';

import { Grid, Typography } from '@material-ui/core';

import { getlikedSongs, getUsers, getPlaylist } from '../../actions';
import Song from './Song.js';

class LikedSongs extends React.Component {
  state = {
    getList: false,
  };
  componentDidMount() {
    this.props.getUsers();
  }

  componentDidUpdate() {
    if (this.props.addedTo && this.state.getList && this.props.playlistId) {
      this.props.getPlaylist(this.props.playlistId);

      if (this.props.playlistId) {
        this.setState({
          getList: true,
        });
      }
    }
  }

  render() {
    if (this.props.fetchingLikedSongs) {
      return <h1>Loading...</h1>;
    }
    return (
      <Grid container>
        <Grid item>
          <Typography
            style={{ fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>
            Last 20 Recommended Songs
          </Typography>

          {this.props.several_tracks.tracks &&
            this.props.several_tracks.tracks.map(song => (
              <Song song={song} id={song.id} key={song.id} />
            ))}
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  songs: state.likedSongsReducer.songs,
  users: state.getUsersReducer.users,
  spotifyUser: state.getUsersReducer.spotifyUser,
  several_tracks: state.queueReducer.several_tracks,
  playlistTracks: state.getPlaylistReducer.playlistTracks.items,
  playlistId: state.createPlaylistReducer.playlistId,
  playlistCreated: state.createPlaylistReducer.playlistCreated,
  addedTo: state.addToPlaylistReducer.addedTo,
});

export default connect(
  mapStateToProps,
  { getlikedSongs, getUsers, getPlaylist },
)(LikedSongs);
