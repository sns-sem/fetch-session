# fetch-session

A simple node-fetch wrapper to include a cookie jar and proxy support.
Includes TypeScript typings.

**The cookie jar does not separate cookies by domain.**

## API

### fetchSession([initialOptions])

- Optional initial options for the session
- Returns: `SessionReturn: { cookieJar: CookieJarReturn, fetch: FetchFn })`

##### initialOptions (extends node-fetch RequestInit options)

```
{
  initialCookie: string;

  // headers and proxy will be issued on all requests under this session
  headers: Record<string, string>;
  proxy: Proxy;
}
```

### session.cookieJar

- `addCookies: (cookieString: string, setCookie?: boolean) => CookieJar`
- `getCookies: () => string`
- `getCookieValue: (name: string) => string`

### session.fetch(url, [, options])

- `url`
- `options` FetchRequestOptions

##### FetchRequestOptions (extends node-fetch RequestInit options)

```
{
  rejectOnFailure: boolean; // reject if !res.ok
  returnError: boolean; // rejections return null by default, `returnError` will return the error
  excludeCookies: boolean; // does not pass cookies into request, still adds any cookies received to the cookie jar
  proxy: string | httpsProxyAgent.HttpsProxyAgentOptions;
  parse: "json" | "text" | "buffer" | "blob" | "arrayBuffer";
}
```

## Example

```
import fetchSession from "fetch-session";

// Options all optional
const session = fetchSession({
initialCookie: "lang=en-US",
headers: {
Accept: "application/json",
"Accept-Language": "en-US",
"Content-Type": "application/json",
},
proxy: "https://user:pass@myproxy.com:5401"
});

(async () => {
await session.fetch("https://example.com/endpoint")
// Contains all cookies returned from the fetch, and will be passed into any following request.
console.log(session.cookieJar.getCookies())
})();
```
