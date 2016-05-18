export const prefix = url => req =>
  req.url.startsWith("/") ?
    { ...req, url: url + req.url } :
    req;

export const logger = (logger = console) => req => {
  logger.log("FarFetch", req.method, req.url);
  return req;
};
