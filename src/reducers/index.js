import { combineReducers } from 'redux';
import instagram from './instagramReducer';
import sidebar from './sidebarReducer';

const rootReducer = combineReducers({
  sidebar,
  instagram
});

export default rootReducer;