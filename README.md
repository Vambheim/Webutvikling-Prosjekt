![/'REC.A.P.I'/ logo](https://tihldestorage.blob.core.windows.net/imagepng/a70fd0bd-f8c0-45eb-b808-293149cf2620resapi-high-resolution-logo-white-on-transparent-background.png)

## Project description

This application has been developed as a project assignment in the subject INFT2002 (Web
development) at NTNU. /'REC.A.P.I'/ offers a variety of functionality in order to make your
coocking-life easier. We can offer av variety of different recipes with something for everyone. You
can use our filter and search functions in order to get exactly what you want. The application also
provides the posibility to both add and edit the recipes, as well ass creating your own shopping
list with all the ingredients you need from your selected recipe. In addition the application also
gives you the opportunity to create a user and log in. Note that the security is taken care of, and
the passwords are stored as a hashed value.

## Setup database connections

### Use our database

You need to create two configuration files that will contain the database connection details to our
database. These files should not be uploaded to your git repository, and they have therefore been
added to `.gitignore`. We have to databases, one for development, and one for testing. Please set
them up like this, if you would like to use our database:

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

### Create your own database

You are also welcome to use your own database. To create the tables you need, please copy the
content in `databasesetup.txt` and run the script in your mysql database. Remeber to change the
content in both config.ts-files to match your new database.

In order to retrive all the recipes from spoonaculars API you also need to change the const
retrieveFromApi to true, as shown below. This is done in `client/src/index.tsx`

```ts
const retrieveFromApi = true;
```

After you have startet the application for the first time, this const needs to be put to false in
order to not retrive the recipes multiple times.

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
