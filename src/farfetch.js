const execute = ({ url, method, headers, body }) =>
  fetch(url, { method, headers, body });

const runFilter = (req, filter) => filter(farfetch({ ...req }), req.execute);

const statusLine = (req, method) => url => farfetch({ ...req, url, method });

const farfetch = (req = { execute, filters: [], headers: {} }) => ({
  ...req,

  get: statusLine(req, "GET"),
  head: statusLine(req, "HEAD"),
  delete: statusLine(req, "DELETE"),
  post: statusLine(req, "POST"),
  put: statusLine(req, "PUT"),
  patch: statusLine(req, "PATCH"),

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
