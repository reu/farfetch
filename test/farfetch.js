import { expect } from "chai";
import nock from "nock";
import farfetch, { prefix } from "../src";

describe("farfetch", () => {
  const url = "http://example.org";
  const path = "/far/fetch";
  const fullPath = url + path;

  const expectRequestWasDone = () => expect(nock.isDone()).to.be.true;

  afterEach(() => nock.cleanAll());

  ["get", "head", "post", "put", "patch", "delete"].forEach(method => {
    describe(`#${method}`, () => {
      beforeEach(() => nock(url)[method](path).reply(204));

      it("fetches the correct url", () => {
         return farfetch[method](fullPath).then(expectRequestWasDone);
      });
    });
  });

  describe("#send", () => {
    const payload = { sasha: "grey" };

    beforeEach(() => nock(url).post(path, payload).reply(204));

    it("sends the payload on the request body", () => {
      return farfetch
        .post(fullPath)
        .send(JSON.stringify(payload))
        .then(expectRequestWasDone);
    });
  });

  describe("#use", () => {
    beforeEach(() => nock(url).get(path).reply(204));

    it("adds a filter that runs before the request", done => {
      return farfetch.use(req => {
        done();
        return req;
      }).get(fullPath).end();
    });
  });
});
