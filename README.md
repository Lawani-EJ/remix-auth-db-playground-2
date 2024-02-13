# Remix Auth DB Playground 2

Remix Auth DB Playground 2 is a project that demonstrates authentication and database usage using Remix framework.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Additional Features](#additional-features)
- [Contributing](#contributing)

## Introduction

This project serves as a playground for implementing authentication and database functionality using the Remix framework. It provides examples of setting up authentication cookies, handling user authentication, and interacting with a database using Prisma.

## Features

- Authentication setup with secure cookie generation.
- User authentication middleware for protecting routes.
- Integration with Prisma for database operations.
- Automatic disconnection of Prisma client on server shutdown.
- Form intents for various actions such as registration, login, board creation, and adding a person.
- Real-time collaboration features using Liveblocks:
  - Presence tracking with cursor coordinates.
  - Storage management for collaborative lists with LiveList and LiveObject.
- Role-based access control with defined roles such as owner, editor, and viewer.

## Installation

To install the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Lawani-EJ/remix-auth-db-playground-2.git


Navigate to the project directory:
cd remix-auth-db-playground-2

Install your dependencies:
npm install

## Usage
To run the project locally, use the following command:
npm start

The app will be accessible in your browser at http://localhost:8000.

You can also build and serve the production version by running:
npm build

## Authentication
The project includes utility functions for handling authentication:

setAuthOnResponse: Sets the authentication cookie on the response object.
getAuthFromRequest: Retrieves the user ID from the request's authentication cookie.
requireAuthCookie: Middleware function to require authentication for accessing protected routes.
redirectWithClearedCookie: Redirects to a specified URL with the authentication cookie cleared.
redirectIfLoggedInLoader: Loader function to redirect users if they are already logged in.

## Database
The project uses Prisma for interacting with the database. The Prisma client is instantiated as a singleton and automatically disconnected on server shutdown.
This project uses SQLite as its database. The data model is designed using Prisma 2, which provides an Object-Relational Mapping (ORM) interface that simplifies working with SQL databases.

## Environment Variables
The project relies on the following environment variables:

NODE_ENV: Specifies the environment (development, production, test).
DATABASE_URL: URL for connecting to the database.
COOKIE_SECRET: Secret used for generating authentication cookies.
LIVEBLOCKS_SECRET_KEY: Secret key for interacting with Liveblocks service.
Ensure these environment variables are properly configured before running the project.

## Additional Features
Real-time Collaboration
The project incorporates real-time collaboration features using Liveblocks:

Presence tracking with cursor coordinates to visualize other users' positions.
Storage management for collaborative lists with LiveList and LiveObject.

## Role-Based Access Control
The project implements role-based access control with the following predefined roles:

owner: Owner of the resource with full access control.
editor: Editor with permission to modify the resource.
viewer: Viewer with read-only access to the resource.

Sure! Here's how you can incorporate the information from the additional code snippets into the README.md:

markdown
Copy code

# Remix Auth DB Playground 2

Remix Auth DB Playground 2 is a project that demonstrates authentication and database usage using Remix framework.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Authentication](#authentication)
- [Database](#database)
- [Environment Variables](#environment-variables)
- [Additional Features](#additional-features)
- [Contributing](#contributing)
- [License](#license)

## Introduction

This project serves as a playground for implementing authentication and database functionality using the Remix framework. It provides examples of setting up authentication cookies, handling user authentication, and interacting with a database using Prisma.

## Features

- Authentication setup with secure cookie generation.
- User authentication middleware for protecting routes.
- Integration with Prisma for database operations.
- Automatic disconnection of Prisma client on server shutdown.
- Form intents for various actions such as registration, login, board creation, and adding a person.
- Real-time collaboration features using Liveblocks:
  - Presence tracking with cursor coordinates.
  - Storage management for collaborative lists with LiveList and LiveObject.
- Role-based access control with defined roles such as owner, editor, and viewer.

## Installation

To install the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Lawani-EJ/remix-auth-db-playground-2.git

Navigate to the project directory:

bash
Copy code
cd remix-auth-db-playground-2
Install dependencies:

bash
Copy code
npm install
Usage
To run the project locally, use the following command:

bash
Copy code
npm start
This will start the development server, and you can access the application at <http://localhost:3000>.

Authentication
The project includes utility functions for handling authentication:

setAuthOnResponse: Sets the authentication cookie on the response object.
getAuthFromRequest: Retrieves the user ID from the request's authentication cookie.
requireAuthCookie: Middleware function to require authentication for accessing protected routes.
redirectWithClearedCookie: Redirects to a specified URL with the authentication cookie cleared.
redirectIfLoggedInLoader: Loader function to redirect users if they are already logged in.
Database
The project uses Prisma for interacting with the database. The Prisma client is instantiated as a singleton and automatically disconnected on server shutdown.

Environment Variables
The project relies on the following environment variables:

NODE_ENV: Specifies the environment (development, production, test).
DATABASE_URL: URL for connecting to the database.
COOKIE_SECRET: Secret used for generating authentication cookies.
LIVEBLOCKS_SECRET_KEY: Secret key for interacting with Liveblocks service.
Ensure these environment variables are properly configured before running the project.

Additional Features
Real-time Collaboration
The project incorporates real-time collaboration features using Liveblocks:

Presence tracking with cursor coordinates to visualize other users' positions.
Storage management for collaborative lists with LiveList and LiveObject.
Role-Based Access Control
The project implements role-based access control with the following predefined roles:

owner: Owner of the resource with full access control.
editor: Editor with permission to modify the resource.
viewer: Viewer with read-only access to the resource.


## Contributing
Contributions to the project are welcome! If you'd like to contribute, please follow the contribution guidelines.