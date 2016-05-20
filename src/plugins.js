export const prefix = url => req =>
  req.url.startsWith("/") ?
    { ...req, url: url + req.url } :
    req;

export const requestLogger = (logger = console) => req => {
  logger.log(req.method, req.url);
  return req;
};

export const responseLogger = (logger = console) => (req, execute) => {
  const start = new Date;

  return {
    ...req,
    execute: req => execute(req)
      .then(res => {
        logger.log(req.method, req.url, res.status, `${new Date - start}ms`);
        return res;
      })
  };
};

const wait = time => new Promise(resolve => setTimeout(resolve, time));

export const delay = (time = 1000) => (req, execute) => ({
  ...req,
  execute: req => wait(time).then(() => execute(req))
});
