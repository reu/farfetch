# Farfetch

[![Build Status](https://travis-ci.org/reu/farfetch.png)](https://travis-ci.org/reu/farfetch)

Pompous, functional, and fluent interface for the [Fetch API](https://developer.mozilla.org/en/docs/Web/API/Fetch_API), inspired by [SuperAgent](https://github.com/visionmedia/superagent).

## Install

`$ npm install farfetch`

## Usage

```javascript
import farfetch from "farfetch";

farfetch
  .get("https://api.github.com/users/reu")
  .then(res => res.json())
  .then(console.log);
```

## Plugins

As [SuperAgent](https://github.com/visionmedia/superagent), Farfetch can be extended via plugins:

```javascript
import farfetch, { prefix, responseLogger } from "farfetch";

farfetch
  .use(prefix("https://api.github.com"))
  .use(responseLogger())
  .get("/users/reu")
  .then(res => res.json())
  .then(console.log);
```

### Available plugins

#### Delay

Delays a request for `time` milliseconds (aka poor man's throttle).

```javascript
import farfetch, { delay } from "farfetch";

// Delays the request for 5 seconds
farfetch
  .use(delay(5000))
  .get("http://example.org")
  .end();
```

#### Prefix

Adds a prefix to the URL. This is quite handy for creating REST API clients.

```javascript
import farfetch, { prefix } from "farfetch";

// This will issue a GET request to http://example.org/api/v1/test
farfetch
  .use(prefix("http://example.org/api/v1"))
  .get("/test")
  .end();
```

Note that as Farfetch never mutates the requests, we can freely reuse _partial applied_ requests.

```javascript
import farfetch, { prefix } from "farfetch";

// A "partial applied" request to the Github API
const github = farfetch
  .use(prefix("https://api.github.com"))
  .set("Authorization", "token 123mytoken");

// Issue two different requests to the Github API
const user = github.get("/users/reu").end();
const repo = github.get("/repos/reu/farfetch").end();
```

#### Request logger

A logger that logs the method and the url right before the request is made.

```javascript
import farfetch, { requestLogger } from "farfetch";

// This will log "GET http://example.org"
farfetch
  .use(requestLogger())
  .get("http://example.org")
  .end();

// You can also change the logger
import winston from "winston";

farfetch
  .use(requestLogger(winston))
  .get("http://example.org")
  .end();
```

#### Response logger

A logger that logs the method, url, status code and response time of a request.

```javascript
import farfetch, { responseLogger } from "farfetch";

// This will log "GET http://example.org 200 12ms"
farfetch
  .use(requestLogger())
  .get("http://example.org")
  .end();

// You can also change the logger
import winston from "winston";

farfetch
  .use(responseLogger(winston))
  .get("http://example.org")
  .end();
```

### Developing plugins

A plugin is just a function that receives a request and returns a new one:

```javascript
import farfetch from "farfetch";

const contentType = contentType => req =>
  req.method == "POST" || req.method == "PUT" ?
    req.set("Content-Type", contentType) :
    req;

const serializeJSON = req =>
  req.headers["Content-Type"] == "application/json" ?
    { ...req, body: JSON.stringify(req.body) } :
    req;

farfetch
  .use(contentType("application/json"))
  .use(serializeJSON)
  .post("http://example.org/users")
  .send({ actress: "Sasha" })
  .end();
```

If a plugin needs to change how a request will be made, it can redefines the `execute` function. For instance, this is how the [`delay`](https://github.com/reu/farfetch#delay) plugin works:

```javascript
// First, let's define a function who provides a promise that resolves after some time
const wait = time => new Promise(resolve => setTimeout(resolve, time));

// Plugins receives the original `execute` function as the second argument
export const delay = (time = 1000) => (req, execute) => ({
  // Add all the properties of the original request
  ...req,

  // A new `execute` function that awaits some time before calling the original one
  execute: req => wait(time).then(() => execute(req))
});
```
