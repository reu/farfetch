const makeRequest = ({ url, method, headers, body }) =>
  fetch(url, { method, headers, body });

const runFilter = (req, filter) => filter(farFetch({ ...req }));

const farFetch = (req = { filters: [], headers: {} }) => ({
  ...req,

  get: url => farFetch({ ...req, url, method: "GET" }),
  del: url => farFetch({ ...req, url, method: "DELETE" }),
  post: (url, body) => farFetch({ ...req, url, body, method: "POST" }),
  put:  (url, body) => farFetch({ ...req, url, body, method: "PUT" }),

  set: (header, value) =>
    farFetch({ ...req, headers: { ...req.headers, [header]: value } }),

  end: () => makeRequest(req.filters.reduce(runFilter, req)),

  then: (...args) => farFetch(req).end().then(...args),
  catch: (...args) => farFetch(req).end().catch(...args),

  use: filter => farFetch({ ...req, filters: [...req.filters, filter] })
});

export default farFetch();
