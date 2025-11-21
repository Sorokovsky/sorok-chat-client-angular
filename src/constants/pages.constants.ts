import {Page} from '@/schemes/page.schema';

export const AUTH_PAGE = new Page("Аутентифікація", ["/", "auth"]);
export const CHATS_PAGE = new Page("Чати", ["/", "chats"]);
export const LOGIN_PAGE = new Page("Вхід", ["/", "auth", "login"]);
export const REGISTER_PAGE = new Page("Реєстрація", ["/", "auth", "register"]);
export const LOGOUT_PAGE = new Page("Вихід", ["/", "chats", "logout"]);
export const CREATE_CHAT = new Page("Створити чат", ["/", "chats", "create"]);
