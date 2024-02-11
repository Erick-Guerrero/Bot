const jwt = require('jsonwebtoken')

module.exports = (user) => {
    return jwt.sign({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, process.env.SECRET || 'algosecreto',
    {expiresIn:'1h'})
  }
  