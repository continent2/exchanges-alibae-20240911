create database exbot ;
create user 'exbot'@localhost identified by 'Kw9bMWHt4Z' ;
grant all privileges on exbot.* to 'exbot'@localhost ;
flush privileges ;

create table settings (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT primary key,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp() ,
  `key` varchar(100) ,
  `subkey` varchar(100) ,
  `value` varchar(100) ,
  active tinyint ,
  uuid varchar(50)
) ;
insert into settings ( `key` , `value`,active ) values ( 'CHARGE_UPTO_AMOUNT' , '100_0000_0000' , 1 ) ; -- 10 Billions
insert into settings ( `key` , `value`,active ) values ( 'CHARGE_PERIOD_IN_SEC' , '120',1 ) ; -- 10 Billions

