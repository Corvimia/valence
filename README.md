# Valence

This is a tool for a LARP about Vampires, created with React and Electron.

## Tech description
- `valence-ui` is a react project with the UI component
- `valence-api` is an express server producing a REST API for the UI to consume
- `valence-electron` packages both into a single electron app

Most of the development is done by running `valence-ui` and `valence-api` together, without the electron layer, for speed and simplicity.
The api uses sqlite with `prisma` to store information.

### Dev Setup
- install dependencies, and run `npm start` for a quick start.
- run `npm run electron` to start the electron app with both ui and api inside.
- run `npm run package` to package the electron app. #BROKEN


#### Prisma commands
- `npx prisma validate` to validate the schema
- `npx prisma migrate dev --name my-migration` to create and apply a migration.

### useful links
- https://mmazzarolo.com/blog/2021-08-12-building-an-electron-application-using-create-react-app/
 
