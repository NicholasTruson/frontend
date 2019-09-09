import axios from 'axios';

export const GET_USERS_FETCHING = 'GET_USERS_FETCHING';
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS';
export const GET_USERS_FAILURE = 'GET_USERS_FAILURE';

const url = process.env.REACT_APP_BACKEND_BASE_URL;

export const getUsers = () => dispatch => {
  dispatch({
    type: GET_USERS_FETCHING,
  });
  axios
    .get(`${url}v1/users`)
    .then(res => {
      dispatch({
        type: GET_USERS_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch({
        type: GET_USERS_FAILURE,
        payload: err,
      });
    });
};

export const GET_LIKEDSONGS_FETCHING = 'GET_LIKEDSONGS_FETCHING';
export const GET_LIKEDSONGS_SUCCESS = 'GET_LIKEDSONGS_SUCCESS';
export const GET_LIKEDSONGS_FAILURE = 'GET_LIKEDSONGS_FAILURE';

export const getlikedSongs = () => dispatch => {
  dispatch({
    type: GET_LIKEDSONGS_FETCHING,
  });

  var config = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
  };

  axios
    .get('https://api.spotify.com/v1/me/tracks', config)
    .then(res => {
      dispatch({
        type: GET_LIKEDSONGS_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch({
        type: GET_LIKEDSONGS_FAILURE,
        payload: err,
      });
    });
};

export const GET_TRACK_INFO_FETCHING = 'GET_TRACK_INFO_FETCHING';
export const GET_TRACK_INFO_SUCCESS = 'GET_TRACK_INFO_SUCCESS';
export const GET_TRACK_INFO_FAILURE = 'GET_TRACK_INFO_FAILURE';

export const getTrackInfo = id => dispatch => {
  dispatch({
    type: GET_TRACK_INFO_FETCHING,
  });

  var config = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
  };

  axios
    .get(`https://api.spotify.com/v1/audio-features/${id}`, config)
    .then(res => {
      dispatch({
        type: GET_TRACK_INFO_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch({
        type: GET_TRACK_INFO_FAILURE,
        payload: err.data,
      });
    });
};

export const GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_FETCHING =
  'GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_FETCHING';
export const GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_SUCCESS =
  'GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_SUCCESS';
export const GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_FAILURE =
  'GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_FAILURE';

export const getSpotifyAccountDetails = () => dispatch => {
  dispatch({
    type: GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_FETCHING,
  });

  var config = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
  };

  axios
    .get(`https://api.spotify.com/v1/me`, config)
    .then(res => {
      if (!('product' in res.data)) {
        res.data.product = 'unprovided';
      }
      dispatch({
        type: GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_SUCCESS,
        payload: res.data,
      });
    })
    .catch(err => {
      dispatch({
        type: GET_SPOTIFY_PRIVATE_ACCOUNT_DETAILS_FAILURE,
        payload: err,
      });
    });
};

export const GET_CURRENT_SONG_FETCHING = 'GET_CURRENT_SONG_FETCHING';
export const GET_CURRENT_SONG_SUCCESS = 'GET_CURRENT_SONG_SUCCESS';
export const GET_CURRENT_SONG_FAILURE = 'GET_CURRENT_SONG_FAILURE';

export const getCurrentSong = () => dispatch => {
  dispatch({
    type: GET_CURRENT_SONG_FETCHING,
  });
  var config = {
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
  };
  axios
    .get('https://api.spotify.com/v1/me/player/currently-playing', config)
    .then(res => {
      dispatch({
        type: GET_CURRENT_SONG_SUCCESS,
        payload: res.data.item,
      });
    })
    .catch(err => {
      dispatch({
        type: GET_CURRENT_SONG_FAILURE,
        payload: err.data,
      });
    });
};

export const PERSIST_USER_FETCHING = 'GET_CURRENT_SONG_FETCHING';
export const PERSIST_USER_SUCCESS = 'GET_CURRENT_SONG_SUCCESS';
export const PERSIST_USER_FAILURE = 'GET_CURRENT_SONG_FAILURE';

export const persistUser = spotifyUser => dispatch => {
  dispatch({
    type: PERSIST_USER_FETCHING,
  });
  axios
    .get(`${url}v1/users/spotify/${spotifyUser.id}`)
    .then(res => {
      if (res.status === 200) {
        axios
          .put(`${url}v1/users/${res.data.id}`, {
            email: res.data.email,
            spotify_user_id: res.data.spotify_user_id,
            user_spotify_api_key: localStorage.getItem('token'),
            date_of_birth: res.data.date_of_birth,
            spotify_product_type: res.data.spotify_product_type,
            display_name: res.data.display_name,
            country: res.data.country,
            profile_image_url: res.data.profile_image_url,
          })
          .then(res => {
            /*  dispatch({ type: PERSIST_USER_SUCCESS, payload: res.data }); */
          })
          .catch(err => {
            /*  dispatch({
              type: PERSIST_USER_FAILURE,
              payload: err,
            }); */
          });
      }
    })
    .catch(err => {
      if (err.message === 'Request failed with status code 404') {
        axios
          .post(`${url}v1/users/register`, {
            email: spotifyUser.email,
            spotify_user_id: spotifyUser.id,
            user_spotify_api_key: localStorage.getItem('token'),
            date_of_birth: '2019-07-29',
            spotify_product_type: spotifyUser.product,
            display_name: spotifyUser.display_name,
            country: spotifyUser.country,
            profile_image_url: '',
          })
          .then(res => {
            /* dispatch({ type: PERSIST_USER_SUCCESS, payload: res.data }); */
          })
          .catch(err => {
            /* dispatch({ type: PERSIST_USER_SUCCESS, payload: err }); */
          });
      }
      /* dispatch({ type: PERSIST_USER_SUCCESS, payload: err }); */
    });
};
