# Rental-app-
A student accessible rental app

These commands should be carried out on a linux machine. Preferrably ubuntu 22.04 LTS which can be installed using a microsoft store with wsl on windows.

### How to use

The frontend of the site in React and tailwind CSS.
run the following commands from the root directory of this repo.
`cd frontend`
`rm -rf node_modules`
`npm install vite`
`npm install`
`npm run dev`

Open another terminal and run the following commands from the root directory of the repo.
`python3 -m api.v1.app`

Then use the link provided by the first terminal in your browser



### Database management

Database management is handled in the folder [models](./models/) in which the various tables in the database are declared as well as the database created. This folder also handles the database management

Then use the link provided.
Directory: [models](./models/)

### Log in

Log in is handled using session auth. Log in parameters are username and password
