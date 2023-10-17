class Article {
  constructor({source, author, title, description, url, publishedAt, content}){
    this.source = source;
    this.author = author;
    this.title = title;
    this.description = description;
    this.url = url;
    this.publishedAt = publishedAt;
    this.content = content;
    this.fetchedAt = new Date();
    this.lastRead = {};
  }
  
  read () {
    this.lastRead = new Date();
  }
}

module.exports = { Article };
