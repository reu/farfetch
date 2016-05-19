const execute = ({ url, method, headers, body }) =>
  fetch(url, { method, headers, body });

const runFilter = (req, filter) => filter(farFetch({ ...req }), req.execute);

const statusLine = (req, method) => url => farFetch({ ...req, url, method });

const farFetch = (req = { execute, filters: [], headers: {} }) => ({
  ...req,

  get: statusLine(req, "GET"),
  head: statusLine(req, "HEAD"),
  delete: statusLine(req, "DELETE"),
  post: statusLine(req, "POST"),
  put: statusLine(req, "PUT"),
  patch: statusLine(req, "PATCH"),

  send: body => farFetch({ ...req, body }),

  set: (header, value) =>
    farFetch({ ...req, headers: { ...req.headers, [header]: value } }),

  end: () => {
    let { execute, ...filteredReq } = req.filters.reduce(runFilter, req);
    return execute(filteredReq);
  },

  then: (...args) => farFetch(req).end().then(...args),
  catch: (...args) => farFetch(req).end().catch(...args),

  use: filter => farFetch({ ...req, filters: [...req.filters, filter] })
});

export default farFetch();
