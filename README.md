# Crow-Chirp

![logo](public/images/logo.png)

Crow-Chirp is a Twitter clone application created using Node.js, MongoDB, and Express. The app allows users to register and log in. Once logged in, users can view all posts from other users on the homepage, create their own posts, like, retweet, comment on other posts, and delete their own posts. Users can also view other users' profile pages to see their posts and replies.

## Installation

---

To install and run the app on your local machine, please follow these steps:

- Clone this repository.
- Install dependencies using ``npm install``.
- add a folder in the root named config with a ``config.env`` file.
  - ``config.env`` will hold these values:
    - PORT=(your favourite port)
    - MONGO_URI=(your mongodb uri)
    - SALT_NUM=(a number between 10-12 to salt your encryption)
    - SESSION_SECRET=(your secret session key)
- Start the server using ``npm run start`` for production **OR** ``npm run dev`` for development.

## Usage

---

Once the app is running, you can register or log in using the provided forms. After logging in, you will be taken to the homepage where you can view all posts, create your own posts, and interact with other users' posts. You can also visit your own profile page to view your own posts and replies.

## Demo

---

Please check out the following [YouTube video](https://www.youtube.com/watch?v=3k2u6msKie4) to see some features of the app in action.

## Technologies Used

---

- Node.js
- MongoDB
- Express
- Express Handlebars
- HTML/CSS/JS
- Bootstrap
