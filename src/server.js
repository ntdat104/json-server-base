const jsonServer = require('json-server');
const queryString = require('query-string');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const https = require('https');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/api/wakeup-heroku', (_, res) => {
  res.jsonp({
    status: 'ok',
  });
});

const timer = 25 * 60 * 1000; // 25 minutes
setInterval(() => {
  https.get('https://ntdat-json-server.herokuapp.com/api/wakeup-heroku');
}, timer);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.created_at = Date.now();
    req.body.updated_at = Date.now();
  } else if (req.method === 'PATCH') {
    req.body.updated_at = Date.now();
  }
  // Continue to JSON Server router
  next();
});

router.render = (req, res) => {
  const headers = res.getHeaders();
  const totalCountHeader = headers['x-total-count'];

  if (req.method === 'GET' && totalCountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);
    console.log(queryParams);

    return res.jsonp({
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _total_rows: Number.parseInt(totalCountHeader),
      },
    });
  }

  res.jsonp({
    data: res.locals.data,
  });
};

const PORT = process.env.PORT || 3000;

// Use default router
server.use('/api', router);
server.listen(PORT, () => {
  console.log(`JSON Server is running on: http://localhost:${PORT}`);
});
