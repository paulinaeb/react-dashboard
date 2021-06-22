import * as Actions from './actionTypes';

/*
 * action creators
 */
export const selectScrape = selectedScrape => ({
  type: Actions.SELECT_SCRAPE,
  payload: selectedScrape,
});

export const selectUser = selectedUser => ({
  type: Actions.SELECT_USER,
  payload: selectedUser,
});
