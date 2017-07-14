// load the mysql library
"use strict";

var mysql = require('promise-mysql');
// console.log('Hello Pedro!');

// create a connection to our Cloud9 server
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'pjpedro22', // CHANGE THIS :)
    password : '',
    database: 'reddit',
    connectionLimit: 10
});

// load our API and pass it the connection
var RedditAPI = require('./reddit');

var myReddit = new RedditAPI(connection);

// We call this function to create a new user to test our API
// The function will return the newly created user's Id in the callback
// This is calling the function
myReddit.createUser({
    username: 'W26M_ME_CUTES',
    password: 'abc123'
})
    .then(newUserId => {
        // Now that we have a user Id, we can use it to create a new post
        // Each post should be associated with a user Id
        console.log('New user created! Id=' + newUserId);

        return myReddit.createPost({
            title: 'Hello Reddit! This is my first post',
            url: 'http://www.digg.com',
            userId: newUserId,
            subredditId: 1
        });
    })
    .then(newPostId => {
        // If we reach that part of the code, then we have a new post. We can print the Id
        console.log('New post created! Id=' + newPostId);
    })
    .catch(error => {
        console.log(error.stack);
    });

// myReddit.getAllPosts()
//     .then(function(result) {
//         console.log(result, 'This is the results of all posts!');
//     })
//     .catch(error => {
//         console.log('getAllPosts did not work!', error);
//     });


// // Call the createSubreddit function.
// myReddit.createSubreddit({
//     name: 'Hot12',
//     description: ''
//     })
//     .then(newSubredditId => {
//         console.log('New subreddit created! Id' + newSubredditId);
//     })
//     .catch(error => {
//         console.log('createSubreddit did not work!', error);
//     });
    
// //Call the getAllSubreddits funtion.
// myReddit.getAllSubreddits()
//     .then(function(result) {
//         console.log(result, 'This is the results of all subreddits!');
//     })
//     .catch(error => {
//         console.log('getAllSubreddits dit not work!', error);
    // });
