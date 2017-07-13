var bcrypt = require('bcrypt-as-promised');
var HASH_ROUNDS = 10;

class RedditAPI {
    constructor(conn) {
        this.conn = conn;
    }

    createUser(user) {
        
        /*
        first we have to hash the password. we will learn about hashing next week.
        the goal of hashing is to store a digested version of the password from which
        it is infeasible to recover the original password, but which can still be used
        to assess with great confidence whether a provided password is the correct one or not
         */
        return bcrypt.hash(user.password, HASH_ROUNDS)
            .then(hashedPassword => {
                return this.conn.query('INSERT INTO users (username, password, createdAt, updatedAt) VALUES (?, ?, NOW(), NOW())', [user.username, hashedPassword]);
            })
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A user with this username already exists');
                }
                else {
                    throw error;
                }
            });
    }

    createPost(post) {
        return this.conn.query(
            `
            INSERT INTO posts (userId, title, url, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())`,
            [post.userId, post.title, post.url]
        )
            .then(result => {
                return result.insertId;
            });
    }

    getAllPosts(callback) {
        /*
        strings delimited with ` are an ES2015 feature called "template strings".
        they are more powerful than what we are using them for here. one feature of
        template strings is that you can write them on multiple lines. if you try to
        skip a line in a single- or double-quoted string, you would get a syntax error.

        therefore template strings make it very easy to write SQL queries that span multiple
        lines without having to manually split the string line by line.
         */
        return this.conn.query(
            `
            SELECT posts.id, posts.title, posts.url, posts.userId, posts.createdAt, posts.updatedAt,
            users.id, users.username, users.createdAt, users.updatedAt,
            subreddits.id, subreddits.name, subreddits.description, subreddits.createdAt, subreddits.updatedAt
            FROM posts
            JOIN users ON posts.userID = users.id
            JOIN subreddits ON posts.subredditID = subreddits.id
            ORDER BY posts.createdAt DESC
            LIMIT 25`
        ).map(array => {
            
        });
        
    }
    
    /*
    It should take a subreddit object that contains a name and description. It should insert the new subreddit, and return the ID of the new subreddit. 
    You can take some inspiration from the createUser function which operates in a similar way. 
    Just like for createUser, you'll have to check if you get a "duplicate entry" error and send a more specific error message.
     */
    createSubreddit(subreddit) {
        return this.conn.query(
            `
            INSERT INTO subreddits (id, name, description, createdAt, updatedAt)
            VALUES (?, ?, ?, NOW(), NOW())`,
            [subreddit.id, subreddit.name, subreddit.description]
        )
            .then(result => {
                return result.insertId;
            })
            .catch(error => {
                // Special error handling for duplicate entry
                if (error.code === 'ER_DUP_ENTRY') {
                    throw new Error('A subreddit with this name already exists');
                }
                else {
                    throw error;
                }
            });
    }
    
    /* 
    add a getAllSubreddits() function. It should return the list of all subreddits, 
    ordered by the newly created ones first, as a Promise.
     */
    getAllSubreddits(allSubreddits) {
        return this.conn.query(
            `
            SELECT * FROM subreddits
            ORDER BY subreddits.updatedAt DESC`
        )
        .then(result => {
            return result.map(array => {
                
            });
        })
        .catch(error => {
            throw error;
        });
    }
}

    
module.exports = RedditAPI;