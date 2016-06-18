## JellRTC Admin Module

### Description
JellRTC admin module is web app which provides an interface to perform administration tasks on JellRTC server. Following features are currently supported – 

1.	Monitor the Jitsi server stats.
2.	Update the Jitsi configuration from UI
3.	Restore backups of Jitsi configuration. Up to recent 5 backups can be restored

### Tech Stack
Application backend is written in NodeJs. It makes use of express server. Frontend uses jquery and jade template engine. App is not connected to any database.

### Installation
1.	Pull the code from Github Repo - https://github.com/jellnet/JellRTC-Admin
2.	Install NodeJs by following instructions here - https://nodejs.org/en/download/
3.	To run locally – 
    1.	cd to code directory. Then run - 
    2.	npm install
    3.	npm start
4.	To run as a service (Used on server) – setup ‘jellrtcadmin-node-app’ service on server. ‘jellrtcadmin-node-app’ is a upstart service, present in the code base at /scripts directory.
    1.	cd to code directory and run ‘npm install’
    2.	Update /scripts/jellrtcadmin-node-app.conf to configure code directory and other parameters if required
    3.	Copy /scripts/jellrtcadmin-node-app.conf to /etc/init/jellrtcadmin-node-app.conf
    4.	To start the service - service jellrtcadmin-node-app start
    5.	To stop the service service jellrtcadmin-node-app stop
    6.	To restart the service service jellrtcadmin-node-app restart

### Configuration
App configuration resides in /config folder. default.json contains default config for all environments. To change config for a given environment, update [env name].json file in config folder and overricde default config. Please see config/default.json and config/production.json to check how it works.