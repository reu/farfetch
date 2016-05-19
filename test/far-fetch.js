import { expect } from "chai";
import nock from "nock";
import farFetch, { prefix } from "../src";

describe("farFetch", () => {
  const url = "http://example.org";
  const path = "/far/fetch";
  const fullPath = url + path;

  const expectRequestWasDone = () => expect(nock.isDone()).to.be.true;

  afterEach(() => nock.cleanAll());

  ["get", "post", "put", "delete", "head"].forEach(method => {
    describe(`#${method}`, () => {
      beforeEach(() => nock(url)[method](path).reply(204));

      it("fetches the correct url", () => {
         return farFetch[method](fullPath).then(expectRequestWasDone);
      });
    });
  });

  describe("#send", () => {
    const payload = { sasha: "grey" };

    beforeEach(() => nock(url).post(path, payload).reply(204));

    it("sends the payload on the request body", () => {
      return farFetch
        .post(fullPath)
        .send(JSON.stringify(payload))
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
