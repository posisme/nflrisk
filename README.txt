--------------

Needed for this project:

PHP
MYSQL

--------------

Libraries:

JQuery
Google Maps Javascript API

--------------

To Use:
create a nflriskconfig.ini file above the webroot with the following:
	mysqlhost = localhost or the host of your mysql database
	mysqluser = a username for the mysql user that has select, insert, and update priveledges
	mysqlpassword = a password for this user (in "")
	mysqldbname = the name of the database. I use nflrisk.

create the database and use the tables.sql for the tables. In the stad table you'll need just the address. Lat, Lng and Poly will be created by the config.php and config.js files when run. In the winslosses table you'll need the schedule for the year. You'll set winners with the config.php and config.js files when run.
