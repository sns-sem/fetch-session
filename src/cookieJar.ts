const transformSetCookie = (setCookie: string): string => {
  return setCookie
    .split(",")
    .filter((val, i) => {
      return !/\d\d:\d\d:\d\d GMT/.test(val);
    })
    .map(cookie => cookie.split(";")[0].trim())
    .join("; ");
};

interface CookieJar {
  [value: string]: string;
}

export interface CookieJarReturn {
  addCookies: (cookieString: string, setCookie?: boolean) => CookieJar;
  getCookies: () => string;
  getCookieValue: (name: string) => string;
}

const fetchCookieJar = (cookieString?: string): CookieJarReturn => {
  let cookies: CookieJar = {};

  const addCookies = (cookieString: string, setCookie = false) => {
    if (setCookie) cookieString = transformSetCookie(cookieString);
    const newCookies = cookieString.split(";").reduce((accum, cookie) => {
      const [name, ...value] = cookie.trim().split("=");
      accum[name] = value.join("=");
      return accum;
    }, {} as CookieJar);

    cookies = { ...cookies, ...newCookies };
    return cookies;
  };

  const makeCookies = () => {
    return Object.keys(cookies)
      .reduce((accum, key) => {
        accum += `${key}=${cookies[key]}; `;
        return accum;
      }, "")
      .trim()
      .slice(0, -1);
  };

  const getCookieValue = (name: string) => {
    return cookies[name];
  };

  if (cookieString) addCookies(cookieString);

  return { addCookies, getCookies: makeCookies, getCookieValue };
};

export default fetchCookieJar;
