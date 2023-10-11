const PORT = 3000;
const express = require('express');
const { checkSchema, body } = require('express-validator');
const app = express();
const { userSchema } = require('./schema.js');
const { registerUser, loginUser, verifyUser, getPreferences, putPreferences ,updateUserReadNews, updateUserFavoriteNews } = require('./userController.js');
const { getUserNews, getReadNews, getFavoriteNews} = require('./newsController.js');
app.use(express.json());


app.get('/', (req,res) =>{
  res.status(200).send("News Aggregator API");
});
app.post('/register', checkSchema(userSchema), registerUser );
app.post('/login', checkSchema(userSchema), loginUser);
app.get('/preferences',verifyUser, getPreferences );
app.put('/preferences', verifyUser, putPreferences );
app.get('/news', verifyUser, getUserNews);

app.get('/news/read', verifyUser, getReadNews);
app.get('/news/favorite', verifyUser, getFavoriteNews);
app.post('/news/:id/read', verifyUser, updateUserReadNews);
app.post('/news/:id/favorite', verifyUser, updateUserFavoriteNews);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
