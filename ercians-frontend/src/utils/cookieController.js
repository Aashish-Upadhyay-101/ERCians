import Cookies from "universal-cookie";

const cookies = new Cookies();

const getCookie = (cookieName) => {
  return cookies.get(cookieName);
};

const setCookie = (cookieName, value) => {
  cookies.set(cookieName, value);
};

const removeCookie = (cookieName) => {
  cookies.remove(cookieName);
};

export { getCookie, setCookie, removeCookie };
