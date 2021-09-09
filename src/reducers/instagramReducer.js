import * as Actions from 'src/actions/actionTypes';

const initState = {
  selectedScrape: {},
  selectedUser: {},
  selectedInfluencer: {},
};

export default function instagramReducer(state = initState, action = {}) {
  switch (action.type) {
    case Actions.SELECT_SCRAPE:
      return {
        ...state,
        selectedScrape: action.payload
      };
    case Actions.SELECT_USER:
      return {
        ...state,
        selectedUser: action.payload
      };
    case Actions.SELECT_INFLUENCER:
      return{
        ...state,
        selectedInfluencer: action.payload
      };
     default:
       return state;
  }
}
