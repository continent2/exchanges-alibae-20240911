CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  username varchar(50) ,
  pw varchar(20) ,
  pwhash varchar( 200 ) ,  
  level tinyint comment '0:common user , admin>=90, 99: root' ,
  active tinyint ,
  PRIMARY KEY (`id`)
);
insert into users ( username,pw,level,active) values ('admin00','qgjtjcpr59',99,1) ;

CREATE TABLE `sessionkeys` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `username` varchar(200) DEFAULT NULL,
  `token` text DEFAULT NULL,
  `ipaddress` varchar(64) DEFAULT NULL,
  `useragent` varchar(1000) DEFAULT NULL,
  `active` tinyint(4) DEFAULT 1,
  `lastactive` varchar(30) DEFAULT NULL,
  `useruuid` varchar(80) DEFAULT NULL,
  PRIMARY KEY (`id`)
);

