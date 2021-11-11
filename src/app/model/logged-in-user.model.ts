export interface LoggedInUser {
  username: string;
  accessToken: string;
  refreshToken: string;
  roles: string[];
}
