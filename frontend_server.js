const express = require('express');
var exphbs  = require('express-handlebars');

class FrontendServer {
  constructor() {
    const app = express();
    const port = process.env.FRONTEND_PORT || 3030;

    app.engine('handlebars', exphbs());
    app.set('view engine', 'handlebars');

    app.get('/', (req, res) => {
      let badges = Object.keys(this.data).map((key) => {
        return {
          id: key,
          type: this.data[key][0].badge_type,
          seen_count: this.data[key].length,
        };
      });

      console.log(badges);

      res.render('index', { badges: badges});
    });

    app.get('/badge/:id', (req, res) => {
      console.log(this.data[req.params.id]);
      res.render('badge_show', { data: this.data[req.params.id] });
    });

    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  }

  setData(data) {
    this.data = data;
  }
}

module.exports = FrontendServer;
