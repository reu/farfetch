export const prefix = url => req =>
  req.url.startsWith("/") ?
    { ...req, url: url + req.url } :
    req;

export const logger = (logger = console) => req => {
  logger.log("FarFetch", req.method, req.url);
  return req;
};

const wait = time => new Promise(resolve => setTimeout(resolve, time));

export const delay = (time = 1000) => req => ({
  ...req,
  execute: () => wait(time).then(req.execute)
});
