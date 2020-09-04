import vanillaFetch, { Headers, RequestInfo, RequestInit } from "node-fetch";
import httpsProxyAgent from "https-proxy-agent";
import fetchCookieJar, { CookieJarReturn } from "./cookieJar";

type Proxy = string | httpsProxyAgent.HttpsProxyAgentOptions;
type FetchRequestOptions = RequestInit & {
  rejectOnFailure?: boolean;
  returnError?: boolean;
  excludeCookies?: boolean;
  proxy?: Proxy;
  parse?: "json" | "text" | "buffer" | "blob" | "arrayBuffer";
};

type FetchFn = <T>(
  url: RequestInfo,
  options?: FetchRequestOptions
) => Promise<{ headers: Headers; body: T } | null>;

const fetch = async <T>(
  cookieJar: CookieJarReturn,
  defaultProxy: Proxy | undefined,
  headers: Record<string, string | number> | undefined,
  url: RequestInfo,
  options?: FetchRequestOptions | undefined
): Promise<{ headers: Headers; body: T } | null> => {
  const proxy = options?.proxy ? options.proxy : defaultProxy;
  return vanillaFetch(url, {
    ...options,
    agent: proxy ? httpsProxyAgent(proxy) : undefined,
    headers: {
      ...headers,
      ...options?.headers,
      cookie: options?.excludeCookies ? "" : cookieJar.getCookies(),
    },
  })
    .then(async res => {
      if (!res.ok && options?.rejectOnFailure) throw res;

      const setCookie = res.headers.get("Set-Cookie");
      if (setCookie) cookieJar.addCookies(setCookie, true);

      return {
        headers: res.headers,
        body: options ? await res[options.parse || "json"]() : await res.json(),
      };
    })
    .catch(err => {
      return options?.returnError ? err : null;
    });
};

export interface SessionReturn {
  cookieJar: CookieJarReturn;
  fetch: FetchFn;
}

interface SessionOptions {
  initialCookie?: string;
  headers?: Record<string, string>;
  proxy?: Proxy;
}

const fetchSession = (options?: SessionOptions): SessionReturn => {
  const cookieJar = fetchCookieJar(options?.initialCookie);

  return {
    cookieJar,
    fetch: fetch.bind(null, cookieJar, options?.proxy, options?.headers) as FetchFn,
  };
};

export default fetchSession;
