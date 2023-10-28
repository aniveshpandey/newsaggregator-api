//Needs changes due to new cache mechanism
const { expect } = require('chai');
const sinon = require('sinon');

const { getUserNews, getReadNews, getFavoriteNews, searchNews } = require('../src/news/news-controller'); 

describe('getUserNews function', () => {
  it('should return user news articles if user exists in cache', () => {
    const user = 'existingUser';
    const userCache = {
      'existingUser': ['Article 1', 'Article 2']
    };
    const req = { user };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };
    getUserNews(req, res);

    expect(res.statusCode).to.equal(200);
  });

  it('should handle error if user does not exist in cache', () => {
    const user = 'nonexistentUser';
    const req = { user };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };

    getUserNews(req, res);

    expect(res.statusCode).to.equal(400);
  });
});

describe('getReadNews function', () => {
  it('should return read news articles if user exists in cache', () => {
    const user = 'existingUser';
    const userCache = {
      'existingUser': [
        { id: 1, readFlag: true, content: 'Read Article 1' },
        { id: 2, readFlag: false, content: 'Unread Article' },
        { id: 3, readFlag: true, content: 'Read Article 2' }
      ]
    };
    const req = { user };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };

    const originalUserCache = global.userCache; 
    global.userCache = userCache; 

    getReadNews(req, res);

    expect(res.statusCode).to.equal(200);
    expect(res.data).to.deep.equal({ articles: [
      { id: 1, readFlag: true, content: 'Read Article 1' },
      { id: 3, readFlag: true, content: 'Read Article 2' }
    ]});

    global.userCache = originalUserCache; 
  });

  it('should handle error if user does not exist in cache', () => {
    const user = 'nonexistentUser';
    const req = { user };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };

    getReadNews(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.data).to.deep.equal({ message: "Error getting user read news", error: undefined });
  });
});

describe('getFavoriteNews function', () => {
  it('should return favorite news articles if user exists in cache', () => {
    const user = 'existingUser';
    const userCache = {
      'existingUser': [
        { id: 1, favoriteFlag: true, content: 'Favorite Article 1' },
        { id: 2, favoriteFlag: false, content: 'Non-favorite Article' },
        { id: 3, favoriteFlag: true, content: 'Favorite Article 2' }
      ]
    };
    const req = { user };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };

    const originalUserCache = global.userCache; 
    global.userCache = userCache; 

    getFavoriteNews(req, res);

    expect(res.statusCode).to.equal(200);
    expect(res.data).to.deep.equal({ articles: [
      { id: 1, favoriteFlag: true, content: 'Favorite Article 1' },
      { id: 3, favoriteFlag: true, content: 'Favorite Article 2' }
    ]});

    global.userCache = originalUserCache; 
  });

  it('should handle error if user does not exist in cache', () => {
    const user = 'nonexistentUser';
    const req = { user };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };

    getFavoriteNews(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.data).to.deep.equal({ message: "Error getting user favorite news", error: undefined });
  });
});

describe('searchNews function', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('should return articles based on keyword search', () => {
    const keyword = 'technology';
    const globalCache = [
      { id: 1, content: 'Technology is evolving.' },
      { id: 2, content: 'Latest news in technology.' },
      { id: 3, content: 'Health news.' }
    ];
    const req = { params: { keyword } };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };

    const searchNewsByKeywordStub = sinon.stub().returns([
      { id: 1, content: 'Technology is evolving.' },
      { id: 2, content: 'Latest news in technology.' }
    ]);

    const globalCacheStub = sinon.stub(global, 'globalCache').value(globalCache);

    searchNews(req, res);

    expect(res.statusCode).to.equal(200);
    expect(res.data).to.deep.equal({ articles: [
      { id: 1, content: 'Technology is evolving.' },
      { id: 2, content: 'Latest news in technology.' }
    ]});

    sinon.assert.calledWithExactly(searchNewsByKeywordStub, keyword);
  });

  it('should handle error if searching news fails', () => {
    const keyword = 'health';
    const req = { params: { keyword } };
    const res = {
      statusCode: 0,
      data: {},
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      send: function(data) {
        this.data = data;
      }
    };

    const searchNewsByKeywordStub = sinon.stub().throws('Error searching news');

    searchNews(req, res);

    expect(res.statusCode).to.equal(400);
    expect(res.data).to.deep.equal({ message: "Error searching news", error: undefined });

    sinon.assert.calledWithExactly(searchNewsByKeywordStub, keyword);
  });
});

