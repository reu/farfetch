import { expect } from "chai";
import nock from "nock";
import farFetch, { prefix } from "../";

describe("farFetch", () => {
  const url = "http://example.org";
  const path = "/far/fetch";
  const fullPath = url + path;

  const expectRequestWasDone = () => expect(nock.isDone()).to.be.true;

  afterEach(() => nock.cleanAll());

  describe("#get", () => {
    beforeEach(() => nock(url).get(path).reply(204));

    it("fetches with the correct method", () => {
      return farFetch
        .get(fullPath)
        .then(expectRequestWasDone);
    });
  });

  describe("#post", () => {
    const payload = { sasha: "grey" };

    beforeEach(() => nock(url).post(path, payload).reply(204));

    it("posts the payload", () => {
      return farFetch
        .post(fullPath, JSON.stringify(payload))
        .then(expectRequestWasDone);
    });
  });

  describe("#put", () => {
    const payload = { sasha: "grey" };

    beforeEach(() => nock(url).put(path, payload).reply(204));

    it("puts the payload", () => {
      return farFetch
        .put(fullPath, JSON.stringify(payload))
        .then(expectRequestWasDone);
    });
  });

  describe("#patch", () => {
    const payload = { sasha: "grey" };

    beforeEach(() => nock(url).patch(path, payload).reply(204));

    it("puts the payload", () => {
      return farFetch
        .patch(fullPath, JSON.stringify(payload))
        .then(expectRequestWasDone);
    });
  });

  describe("#del", () => {
    beforeEach(() => nock(url).delete(path).reply(204));

    it("sends a delete request with the correct method", () => {
      return farFetch
        .del(fullPath)
        .then(expectRequestWasDone);
    });
  });

  describe("#use", () => {
    beforeEach(() => nock(url).get(path).reply(204));

    it("adds a filter that runs before the request", done => {
      return farFetch.use(req => {
        done();
        return req;
      }).get(fullPath).end();
    });
  });
});
