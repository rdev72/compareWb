const request = require('request');
request('https://jsonplaceholder.typicode.com/todos/1', (error, response, body) => {
    console.log(JSON.parse(body).title)
})