import { expect } from "chai";
import nock from "nock";
import farFetch, { prefix, delay } from "../src";

describe("plugins", () => {
  const url = "http://example.org";
  const path = "/far/fetch";
  const fullPath = url + path;

  const expectRequestWasDone = () => expect(nock.isDone()).to.be.true;

  afterEach(() => nock.cleanAll());

  describe("prefix", () => {
    beforeEach(() => nock(url).get(path).reply(204));

    it("prefixes the request url", () => {
      return farFetch
        .use(prefix(url))
        .get(path)
        .then(expectRequestWasDone);
    });
  });

  describe("delay", () => {
    beforeEach(() => nock(url).get(path).reply(204));

    it("delays the request", () => {
      const start = new Date;

      return farFetch
        .use(delay(100))
        .get(fullPath)
        .then(res => expect(new Date - start).to.be.above(100))
        .then(expectRequestWasDone);
    });
  });
});

