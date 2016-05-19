const makeRequest = ({ url, method, headers, body }) =>
  fetch(url, { method, headers, body });

const runFilter = (req, filter) => filter(farFetch({ ...req }));

const bodyless = (req, method) => url =>
  farFetch({ ...req, url, method });

const bodyful = (req, method) => (url, body) =>
  farFetch({ ...req, url, body, method });

const farFetch = (req = { filters: [], headers: {} }) => ({
  execute: () => makeRequest(req),

  ...req,

  get: bodyless(req, "GET"),
  del: bodyless(req, "DELETE"),
  post: bodyful(req, "POST"),
  put: bodyful(req, "PUT"),
  patch: bodyful(req, "PATCH"),

  set: (header, value) =>
    farFetch({ ...req, headers: { ...req.headers, [header]: value } }),

  end: () => farFetch(req.filters.reduce(runFilter, req)).execute(),

  then: (...args) => farFetch(req).end().then(...args),
  catch: (...args) => farFetch(req).end().catch(...args),

  use: filter => farFetch({ ...req, filters: [...req.filters, filter] })
});

export default farFetch();
