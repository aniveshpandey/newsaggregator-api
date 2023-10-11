const PORT = 3000;
const express = require('express');
const { checkSchema, body } = require('express-validator');
const app = express();
const { userSchema } = require('./schema.js');
const { registerUser, loginUser, verifyUser, getPreferences, putPreferences } = require('./userController.js');
const { getUserNews } = require('./newsController.js');
app.use(express.json());


app.get('/', (req,res) =>{
  res.status(200).send("News Aggregator API");
});
app.post('/register', checkSchema(userSchema), registerUser );
app.post('/login', checkSchema(userSchema), loginUser);
app.get('/preferences',verifyUser, getPreferences );
app.put('/preferences', verifyUser, putPreferences );
app.get('/news', verifyUser, getUserNews);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
