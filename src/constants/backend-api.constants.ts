const SERVER_URL: string = "/api";
const AUTHENTICATION_URL: string = `${SERVER_URL}/authentication`;
export const LOGIN_URL: string = `${AUTHENTICATION_URL}/login`;
export const REGISTRATION_URL: string = `${AUTHENTICATION_URL}/registration`;
export const LOGOUT_URL: string = `${AUTHENTICATION_URL}/logout`;
export const PROFILE_URL: string = `${AUTHENTICATION_URL}/profile`;
export const CHATS_URL: string = `${SERVER_URL}/channels`;
export const CHATS_BY_ME_URL: string = `${CHATS_URL}/by-me`;
