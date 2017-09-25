CREATE TABLE stadnew (`teamkey` varchar(5), `team` varchar(100), `address` varchar(200), `lat` float, `lng` float, `poly` longtext, PRIMARY KEY(`teamkey`));

CREATE TABLE winslosses(`gameid` bigint AUTO_INCREMENT NOT NULL, PRIMARY KEY(`gameid`),`week` int,`t1` varchar(5),`t2` varchar(5),`win` varchar(5));

create table moves(`movesid` bigint auto_increment not null, primary key(`movesid`), userid varchar(100),`gameid` bigint,`winner` varchar(5),`confidence` int);