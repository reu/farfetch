import { expect } from "chai";
import nock from "nock";
import streamToArray from "stream-to-array";
import { PassThrough } from "stream";
import farfetch, { prefix, requestLogger, responseLogger, delay } from "../src";

const streamToString = stream =>
  streamToArray(stream)
    .then(Buffer.concat)
    .then(buffer => buffer.toString("utf-8"));

describe("plugins", () => {
  const url = "http://example.org";
  const path = "/far/fetch";
  const fullPath = url + path;

  const expectRequestWasDone = () => expect(nock.isDone()).to.be.true;

  afterEach(() => nock.cleanAll());

  describe("prefix", () => {
    beforeEach(() => nock(url).get(path).reply(204));

    it("prefixes the request url", () => {
      return farfetch
        .use(prefix(url))
        .get(path)
        .then(expectRequestWasDone);
    });
  });

  describe("delay", () => {
    beforeEach(() => nock(url).get(path).reply(204));

    it("delays the request", () => {
      const start = new Date;

      return farfetch
        .use(delay(500))
        .get(fullPath)
        .then(res => expect(new Date - start).to.be.above(100))
        .then(expectRequestWasDone);
    });
  });

  describe("requestLogger", function() {
    beforeEach(() => nock(url).get(path).reply(204));

    it("logs the request method and url", done => {
      const log = new PassThrough;

      streamToString(log)
        .then(log => expect(log.trim()).to.eq(`GET ${fullPath}`))
        .then(() => done(), done);

      return farfetch
        .use(requestLogger(new console.Console(log)))
        .get(fullPath)
        .then(() => log.end())
        .then(expectRequestWasDone);
    });
  });

  describe("responseLogger", function() {
    beforeEach(() => nock(url).get(path).reply(204));

    it("logs the response method, url, status code and time", done => {
      const log = new PassThrough;

      streamToString(log)
        .then(log => {
          expect(log.trim()).to.match(new RegExp(`GET ${fullPath} \\d{3} \\d+ms`));
          done();
        }, done)

      return farfetch
        .use(responseLogger(new console.Console(log)))
        .get(fullPath)
        .then(() => log.end())
        .then(expectRequestWasDone);
    });
  });
});
