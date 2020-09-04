# fetch-session

A simple node-fetch wrapper to include a cookie jar and proxy support.

Includes TypeScript typings.

Documentation will be made at a later date.

#### Example

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

session.fetch("https://www.google.com", {
  // node-fetch options are also accepted
  parse: "text",
}).then(res => {
  // Returns `null` by default if request fails.
  if (!res) throw new Error("Request has failed");
  const { headers, body } = res;
  console.log(body);
});
```
