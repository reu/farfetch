# Farfetch

[![Build Status](https://travis-ci.org/reu/farfetch.png)](https://travis-ci.org/reu/farfetch)

Pompous, functional, and fluent interface for the [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API), inspired by [SuperAgent](https://github.com/visionmedia/superagent).

## Install

`$ npm install farfetch`

## Usage

```javascript
import farFetch from "farfetch";

farFetch
  .get("https://api.github.com/users/reu")
  .then(res => res.json())
  .then(console.log);
```

## Plugins

As [SuperAgent](https://github.com/visionmedia/superagent), Farfetch can be extended via plugins:

```javascript
import farFetch, { logger, prefix } from "farfetch";

farFetch
  .use(prefix("https://api.github.com"))
  .use(logger())
  .get("/users/reu")
  .then(res => res.json())
  .then(console.log);
```

### Available plugins

#### Logger

Just a simple request logger.

```javascript
import farFetch, { logger } from "farfetch";

// This will log "GET http://example.org"
farfetch
  .use(logger())
  .get("http://example.org")
  .end();

// You can also change the logger
import winston from "winston";

farfetch
  .use(logger(winston))
  .get("http://example.org")
  .end();
```

#### Prefix

Adds a prefix to the URL. This is very useful to create API clients.

```javascript
import farFetch, { prefix } from "farfetch";

// This will issue a GET request to http://example.org/api/v1/test
farfetch
  .use(prefix("http://example.org/api/v1"))
  .get("/test")
  .end();
```

Note that as Farfetch never mutates the requests, so we can freely reuse the _partial applied_ requests.

```javascript
import farFetch, { prefix } from "farfetch";

const github = farfetch
  .use(prefix("https://api.github.com"))
  .set("Authorization", "token 123mytoken");

const user = github.get("/users/reu").end();
const repo = github.get("/repos/reu/farfetch").end();
```

#### Delay

Delays a request for `time` milliseconds (aka poor man's throttle).

```javascript
import farFetch, { delay } from "farfetch";

// Delays the request for 5 seconds
farfetch
  .use(delay(5000))
  .get("http://example.org")
  .end();
```

### Developing plugins

A plugin is just a function that receives a request and returns a new one:

```javascript
import farFetch, { logger, prefix } from "farfetch";

const contentType = contentType => req =>
  req.method == "POST" || req.method == "PUT" ?
    req.set("Content-Type", contentType) :
    req;

const serializeJSON = req =>
  req.headers["Content-Type"] == "application/json" ?
    { ...req, body: JSON.stringify(req.body) } :
    req;

farFetch
  .use(contentType("application/json"))
  .use(serializeJSON)
  .post("http://example.org/users")
  .send({ actress: "Sasha" })
  .end();
```

If a plugin needs to change how a request will be made, just redefine the `execute` function. For instance, this is how the [`delay`](https://github.com/reu/farfetch#delay) plugin works:

```javascript
// First, let's we define a function who provides a promise that resolves after some time
const wait = time => new Promise(resolve => setTimeout(resolve, time));

// Returns a new request that redefines the `execute` function
export const delay = time => req => ({
  // The original request
  ...req,

  // A fresh new execute function that await some time before send the request
  execute: () => wait(time).then(req.execute)
});
```
