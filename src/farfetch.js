const execute = ({ url, method, headers, body, redirect = "follow" }) =>
  fetch(url, { method, headers, body, redirect });

const runFilter = (req, filter) => filter(farfetch({ ...req }), req.execute);

const requestLine = (req, method) => url => farfetch({ ...req, url, method });
const methods = req =>
  ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"]
    .map(method => ({ [method.toLowerCase()]: requestLine(req, method) }))
    .reduce(Object.assign);

const farfetch = (req = { execute, filters: [], headers: {} }) => ({
  ...req,
  ...methods(req),

  send: body => farfetch({ ...req, body }),

  set: (header, value) =>
    farfetch({ ...req, headers: { ...req.headers, [header]: value } }),

  end: () => {
    let { execute, ...filteredReq } = req.filters.reduce(runFilter, req);
    return execute(filteredReq);
  },

  then: (...args) => farfetch(req).end().then(...args),
  catch: (...args) => farfetch(req).end().catch(...args),

  use: filter => farfetch({ ...req, filters: [...req.filters, filter] })
});

export default farfetch();
