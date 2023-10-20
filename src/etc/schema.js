const userSchema = {
    email: { isEmail: true },
    password: { isLength: { options: { min: 8 } } },
    privilege: { optional: true, notEmpty: true },
  };
const preferencesSchema = {
    q: { isString: true },
    language: { optional: true, isString: true },
    sources: { optional: true } 
}

module.exports = {userSchema, preferencesSchema};
