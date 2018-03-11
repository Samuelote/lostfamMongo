const User = require('../Schemas/user');

module.exports = function (router) {
  router.route('/users')
    .post((req, res) => {
      const { name, email, username, password } = req.body;
      const newUser = new User({ name, email, username, password, created_at: Date.now() });
      newUser.save(err => {
        if (err) {
          console.log(err);
          res.send({ success: false });
        } else {
          console.log('New user has been created.')
          res.send({ success: true });
        }
      })
    })
    .get((req, res) => {
      User.find((err, users) => {
        if (err) res.send(err);

        res.json(users);
      })
    });

  router.route('/users/:user_id')
    .put((req, res) => {
      User.findById(req.params.user_id, (err, user) => {
        if (err) res.send(err);
        else {
          /* Update generic user data here */


          user.save((err) => {
            if (err) res.send(err);

            res.json({ message: 'User updated' })
          })
        }
      })
    })
    .delete((req, res) => {
      User.remove({ _id: req.params.user_id }, (err, user) => {
        if (err) res.send(err);
        else res.json({ success: true });
      });
    })
}
