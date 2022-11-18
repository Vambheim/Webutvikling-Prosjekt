API Key: SE env fil

Linker til ressurser som skal brukes:

For Repsonsivt desing: https://react-bootstrap.github.io/

Muligens for hashing:
https://medium.com/@nick_92077/user-authentication-basics-hashing-and-jwt-3f9adf12272

Muligens for API: https://rapidapi.com/spoonacular/api/recipe-food-nutrition

# /'REC.A.P.I'/ a recipe web-application

This application has been developed as a project assignment in the subject INFT2002 (Web
development) at NTNU. /'REC.A.P.I'/ offers a variety of functionality in order to make your
coocking-life easier. We can offer av variety of different recipes with something for everyone. You
can use our filter and search functions in order to get exactly what you want. The application also
provides the posibility to both add and edit the recipes, as well ass creating your own shopping
list with all the ingredients you need from your selected recipe. In addition the application also
gives you the opportunity to create a user and log in. Note that the security is taken care of, and
the passwords are stored as a hashed value.

![/'REC.A.P.I'/ logo](https://tihldestorage.blob.core.windows.net/imagepng/a70fd0bd-f8c0-45eb-b808-293149cf2620resapi-high-resolution-logo-white-on-transparent-background.png)

## Setup database connections

You need to create two configuration files that will contain the database connection details. These
files should not be uploaded to your git repository, and they have therefore been added to
`.gitignore`. The connection details may vary, but example content of the two configuration files
are as follows:

`server/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'fs_inft2002_1';
process.env.MYSQL_PASSWORD = 'gruppe1';
process.env.MYSQL_DATABASE = 'fs_inft2002_1_dev';
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = 'mysql.stud.ntnu.no';
process.env.MYSQL_USER = 'fs_inft2002_1';
process.env.MYSQL_PASSWORD = 'gruppe1';
process.env.MYSQL_DATABASE = 'fs_inft2002_1_test';
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
