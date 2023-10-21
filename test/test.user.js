const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
const {
  registerUser,
  loginUser,
  verifyUser,
  getPreferences,
  putPreferences,
  updateUserReadNews,
  updateUserFavoriteNews,
} = require('../src/user/user-controller.js'); 

chai.use(chaiHttp);

describe('Register a user', () => {

  it('should register a user', (done) => {
    const req = {
      body: {
        email: 'testuser@example.com',
        password: 'testpassword',
        privilege: 'normal',
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(200);
          expect(data.message).to.equal('User with email testuser@example.com added');
          done();
        },
      }),
    };

    registerUser(req, res);
  });

  it('should not register a user because of incomplete body', (done) => {
    const req = {
      body: {
        email: 'testuser@example.com',
        privilege: 'normal',
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(400);
          done();
        },
      }),
    };

    registerUser(req, res);
  });

});

describe('User Login', () => {

  const validUser = {
    email: 'testuser@example.com',
    password: 'testpassword',
  };

  const invalidPasswordUser = {
    email: 'testuser@example.com',
    password: 'invalidpassword',
  };

  it('should log in a user with valid credentials', (done) => {
    const req = {
      body: validUser,
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(200);
          expect(data).to.have.property('message', 'SignIn successful');
          expect(data).to.have.property('accessToken');
          done();
        },
      }),
    };

    loginUser(req, res);
  });

  it('should return a 401 status for invalid password', (done) => {
    const req = {
      body: invalidPasswordUser,
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(401);
          expect(data).to.have.property('error', 'Invalid Password');
          done();
        },
      }),
    };

    loginUser(req, res);
  });

});

describe('Get User preferences', () => {

  const userWithPreferences = {
    preferences: { q: "formula1", language: 'en' },
  };

  const userWithoutPreferences = {
    preferences: null,
  };

  it('should return user preferences when they exist', (done) => {
    const req = {
      user: userWithPreferences, 
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(200);
          expect(data).to.have.property('preferences');
          expect(data.preferences).to.deep.equal(userWithPreferences.preferences);
          done();
        },
      }),
    };

    getPreferences(req, res);
  });

  it('should return an error when user preferences are empty', (done) => {
    const req = {
      user: userWithoutPreferences, 
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(400);
          expect(data).to.have.property('error', 'Empty preferences');
          done();
        },
      }),
    };
    getPreferences(req, res);
   });

});

 describe('User Update preferences', () => {

  const validUser = {
    email: 'testuser@example.com',
  };

  it('should successfully update user preferences', (done) => {
    const req = {
      user: validUser, 
      body: {
        preferences: { q: "jazz-concerts", language: 'en' },
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(200);
          expect(data).to.have.property('message', `Modified preferences of ${validUser.email}`);
          done();
        },
      }),
    };

    putPreferences(req, res);
  });

  it('should return a 400 status when validation fails', (done) => {
    const req = {
      user: validUser, 
      body: {
        preferences: null, 
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(400);
          done();
        },
      }),
    };

    putPreferences(req, res);
  });

  it('should return a 400 status and error when updating fails', (done) => {
    const req = {
      user: validUser, 
      body: {
        preferences: { theme: 'dark', language: 'fr' },
      },
    };

    
    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(400);
          expect(data).to.have.property('error');
          done();
        },
      }),
    };

    putPreferences(req, res);
  });
}); 

describe('Update user read news', () => {
  const validUser = {
    email: 'testuser@example.com',
    read: [],
  };

  it('should successfully update the user\'s read news', (done) => {
    const newsId = 'news123'; 

    const req = {
      user: validUser, 
      params: {
        id: newsId, 
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(200);
          done();
        },
      }),
    };

    updateUserReadNews(req, res);
  });

  it('should return a 400 status and error when updating fails', (done) => {
    const req = {
      user: null, 
      params: {
        id: 'news123', 
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(400);
          expect(data).to.have.property('error');
          done();
        },
      }),
    };

    updateUserReadNews(req, res);
  });
});

describe('Update user favorite news', () => {
  const validUser = {
    email: 'testuser@example.com',
    favorite: [], 
  };

  it('should successfully update the user\'s favorite news', (done) => {
    const newsId = 'news123'; 

    const req = {
      user: validUser, 
      params: {
        id: newsId, 
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(200);
          done();
        },
      }),
    };

    updateUserFavoriteNews(req, res);
  });

  it('should return a 400 status and error when updating fails', (done) => {
    const req = {
      user: null, 
      params: {
        id: 'news123', 
      },
    };

    const res = {
      status: (statusCode) => ({
        send: (data) => {
          expect(statusCode).to.equal(400);
          expect(data).to.have.property('error');
          done();
        },
      }),
    };

    updateUserFavoriteNews(req, res);
  });
});
