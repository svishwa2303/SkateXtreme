import { createSelector } from 'reselect';

export const selectAuth = state => state.auth;
export const selectIsAuthenticated = createSelector(
  selectAuth,
  auth => auth.isAuthenticated
);
export const selectUserRoles = createSelector(
  selectAuth,
  auth => auth.user?.roles || []
);
export const selectToken = createSelector(
  selectAuth,
  auth => auth.user?.token || ''
);

export const selectUsername = createSelector(
  selectAuth,
  auth => auth.user?.username || ''
);