# News Aggregator API

The News Aggregator API is a Node.js application built with the Express.js framework. It provides a RESTful API for managing user registration, authentication, and news-related operations. This README will guide you through setting up and using the API.

### Prerequisites

Before using the News Aggregator API, make sure you have the following software and tools installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- NPM (Node Package Manager): Typically comes with Node.js installation.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/aniveshpandey/newsaggregator-api
   ```
1. Navigate to the project directory and install dependencies:
    
    ```bash
    cd newsaggregator-api/
    npm install
    ```

1. Copy .env.dummy to .env and insert your own values:

    ```bash
    cp .env.dummy .env
    vim .env
    ```

1. Start the server:
    
    ```bash
    npm start
    ```

### Endpoints

    GET /:
        Returns a welcome message indicating that the API is up and running.


 ```bash
     curl http://localhost:<PORT>/
 ```

    POST /register:
       Register a new user using user schema validation.

 ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"email": "user@test,com", "pssword" : "$tr0NgPa$$w0rD", 
    "privilege": "normal"}' http://localhost:<PORT>/register/
 ```

    POST /login:
        Authenticate a user using user schema validation.

```bash
     curl -X POST -H "Content-Type: application/json" -d '{"email": "user@test,com", "pssword" : "$tr0NgPa$$w0rD"}' 
     http://localhost:<PORT>/login/
```

    GET /preferences:
        Get user preferences after user authentication.

```bash
     curl -H "Authorization : <token>" http://localhost:<PORT>/preferences/
 ```

    PUT /preferences:
        Update user preferences after user authentication.

```bash
    curl -X PUT -H "Authorization : <token>" -d '{"preferences": {
     "category": "sports",
    }}' http://localhost:<PORT>/preferences/
```

    GET /news:
        Retrieve user-specific news articles.

```bash
    curl -H "Authorization : <token>" http://localhost:<PORT>/news/
 ```
        
    GET /news/read:
        Retrieve news articles marked as read by the user.

```bash
     curl -H "Authorization : <token>" http://localhost:<PORT>/news/read/
 ```
 
    GET /news/favorite:
        Retrieve news articles marked as favorites by the user.

 ```bash
     curl -H "Authorization : <token>" http://localhost:<PORT>/news/favorite/
```
 
    POST /news/:id/read:
        Mark a news article as read for the user.

```bash
     curl -X POST -H "Authorization : <token>" http://localhost:<PORT>/news/:id/read/
```
 
    POST /news/:id/favorite:
        Mark a news article as a favorite for the user.

```bash
    curl -X POST -H "Authorization : <token>" http://localhost:<PORT>/news/:id/favorite/
```
 
    GET /news/search/:keyword:
        Search for news articles containing a specific keyword.

```bash
    curl http://localhost:<PORT>/news/search/:keyword
```

### Contributing

If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3.  Make your changes.
4. Test your changes.
5. Submit a pull request.

### License

This project is licensed under the MIT License - see the LICENSE file for details.
