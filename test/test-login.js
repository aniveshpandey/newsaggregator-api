let app = require('../src/server'),
  chai = require('chai'),
  request = require('supertest');

describe('News Aggregator API Testing', function() {

  it('Register API', function(done) {
    request(app)
   .post('/register')
   .send({
    email: 'tester@example.com',
    password: 'test1234',
    privilege: 'normal'
    })
   .set('Accept', 'application/json')
   .expect('Content-Type', /json/)
   .expect(200)
   .end(function(err, res) {
     if (err) return done(err);
     done();
   })
 });
  it('Login API', function(done) {
    request(app).post('/login').send({
      "email": "tester@example.com",
      "password": "test1234"
    }).set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return done(err);
      done();
    })
  });

});
