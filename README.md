# WebsocketsDemo
This is a demo for using websockets to set up a duplex communication between Angular and Node to propagate RDBMS data changes in real time.
To get this application working, you will need the following software installed o your machine
1. NodeJS; NPM
2. Postgres
3. @angular/cli as a global dependency

Once all the above noted software is installed, you need to:
Add any needed records on your local Postgres Cluster->Database->table for a specific user;
Clone this repository onto your local machine;
cd into the directory root and fire 'npm i', to install all the dependency packages;
Open the file https://github.com/infamousNerd/WebsocketsDemo/blob/master/server/routes/api.js and modify L5 - L9 to use your local database configuration where you would intend to fetch the records from;
Open the file https://github.com/infamousNerd/WebsocketsDemo/blob/master/src/app/app.component.html and modify the interpolations and add more table columns to suit your records volume and display desirability. If you happen to have a column "Name" on your table, then you may have to add the interpolation as {{record.Name}};
Fire 'npm start' from directory root to build and serve the application, it should be available on localhost:3000;
Hit the API endpoints noted in  https://github.com/infamousNerd/WebsocketsDemo/blob/master/server/routes/api.js file from postman or using curl to modify the records on the backend, and see them updated on the UI in realtime.
