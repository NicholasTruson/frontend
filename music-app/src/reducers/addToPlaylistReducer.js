import {
  ADD_TO_PLAYLIST_FETCHING,
  ADD_TO_PLAYLIST_SUCCESS,
  ADD_TO_PLAYLIST_FAILURE,
} from '../actions';

const initialState = {
  addedTo: false,
  error: '',
  isFetchingSuccessful: false
};

const addToPlaylistReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_PLAYLIST_FETCHING:
      return {
        ...state,
      };
    case ADD_TO_PLAYLIST_SUCCESS:
      return {
        ...state,
        addedTo: true,
        isFetchingSuccessful: true
      };
    case ADD_TO_PLAYLIST_FAILURE:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default addToPlaylistReducer;
