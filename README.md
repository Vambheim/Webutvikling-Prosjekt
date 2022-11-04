API Key: SE env fil

Linker til ressurser som skal brukes:

For Repsonsivt desing: https://react-bootstrap.github.io/

Muligens for hashing:
https://medium.com/@nick_92077/user-authentication-basics-hashing-and-jwt-3f9adf12272

Muligens for API: https://rapidapi.com/spoonacular/api/recipe-food-nutrition

# Client tests example

## Setup database connections

You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_dev';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'username_todo';
process.env.MYSQL_PASSWORD = 'username_todo';
process.env.MYSQL_DATABASE = 'username_todo_test';
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## Start server

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

### Run server tests:

```sh
npm test
```

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```

### Run client tests:

```sh
npm test
```
