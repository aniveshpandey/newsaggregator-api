require('dotenv').config('../.env');
const PORT = eval(process.env.PORT);
const express = require('express');
const { checkSchema, body } = require('express-validator');
const app = express();
const rateLimit = require('express-rate-limit');
const { userSchema } = require('./etc/schema.js');
const { registerUser, loginUser, verifyUser, getPreferences, putPreferences ,updateUserReadNews, updateUserFavoriteNews } = require('./user/user-controller.js');
const { getUserNews, getReadNews, getFavoriteNews, searchNews} = require('./news/news-controller.js');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests.',
});

app.use(express.json());
app.use(limiter);

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

app.get('/news/search/:keyword', searchNews);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
