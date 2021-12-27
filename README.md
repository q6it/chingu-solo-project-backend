# chingu-solo-project-backend

## Overview

This project is a backend part of Chingu solo project. (https://github.com/q6it/chingu-solo-project)
Made to participate in Voyage team work and also to learn new libraries / design patterns.

## Features

It provides an api endpoints to:

-   create a user
-   login with user credentials
-   Create, Read, Update, Delete logged in user data. In this case some text post with title and body.

## Installation

1. npm install
2. create a `.env` file in the project root directory with key JWTREFRESHTOKEN=`your_value_here`
   NB! Never expose .env credentials to any remote source

## Running Locally

-   nodemon start

## TODO list

-   Currently it's working with only one token. Ideally for the backend authentication to work more securely there should be an access token and a refresh token
    This feature will be added in the future updates.
-   Add a proper database instead of mocked array. Planned to use a mongodb.
