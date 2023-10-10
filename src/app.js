const PORT = 3000;
const express = require('express');
const { checkSchema, body } = require('express-validator');
const app = express();
const { userSchema } = require('./schema.js');
const { registerUser, loginUser } = require('./userController.js');
app.use(express.json());


app.get('/', (req,res) =>{
  res.status(200).send("News Aggregator API");
});
app.post('/register', checkSchema(userSchema), registerUser );
app.post('/login', checkSchema(userSchema), loginUser);
// app.get('/preferences');
// app.put('/preferences');
// app.get('/news');

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
