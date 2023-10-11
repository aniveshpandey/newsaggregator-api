const userSchema = {
    email: { isEmail: true },
    password: { isLength: { options: { min: 8 } } },
    privilege: { optional: true, notEmpty: true },
  };

module.exports = {userSchema};
