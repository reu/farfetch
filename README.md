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
  .post("http://example.org/users", { actress: "Sasha" })
  .end();
```
