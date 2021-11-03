const verifyAdmin = (req, res, next) => {
  if(!req.session.user) {
    res.redirect('/auth')
  }

  const user = req.session.user;
  if(user.Role.name != 'admin') {
    res.redirect('/auth')
  }

  next()
}

const verifyStaff = (req, res, next) => {
  if(!req.session.user) {
    res.redirect('/auth')
  }

  const user = req.session.user;

  if(user.Role.name != 'trainingStaff') {
    res.redirect('/auth')
  }

  next()
}

const verifyTrainer = (req, res, next) => {
  if(!req.session.user) {
    res.redirect('/auth')
  }

  const user = req.session.user;

  if(user.Role.name != 'trainer') {
    res.redirect('/auth')
  }

  next()
}

module.exports = {
  verifyAdmin,
  verifyStaff,
  verifyTrainer
};
