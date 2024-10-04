create database exbot ;
create user 'exbot'@localhost identified by 'Kw9bMWHt4Z' ;
grant all privileges on exbot.* to 'exbot'@localhost ;
flush privileges ;

CREATE TABLE `tradevolumes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  symbol varchar(30) ,
  price varchar(30) ,
  volumeinquote varchar(30) ,
  volumeinbase varchar(30) ,
  refex varchar(20) comment 'default null=>binance, designate in this field if any other', 
  `timestamp` bigint unsigned ,
  PRIMARY KEY (`id`),
  UNIQUE KEY `symbol` (`symbol`, `timestamp` )
) ;

CREATE TABLE `settings` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `createdat` datetime DEFAULT current_timestamp(),
  `updatedat` datetime DEFAULT NULL ON UPDATE current_timestamp(),
  `key` varchar(100) DEFAULT NULL,
  `subkey` varchar(100) DEFAULT NULL,
  `value` varchar(100) DEFAULT NULL,
  `active` tinyint(4) DEFAULT NULL,
  `uuid` varchar(50) DEFAULT NULL,
  `group` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_key` (`group`,`key`)
) ;
insert into settings ( `group` , `key` , `value`,active ) values ( 'CHARGE', 'CHARGE_UPTO_AMOUNT' , '100_0000_0000' , 1 ) ; -- 10 Billions
insert into settings ( `group` , `key` , `value`,active ) values ( 'CHARGE', 'CHARGE_PERIOD_IN_SEC' , '120',1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'CHARGE', 'CHARGE_INITIAL_DELAY_IN_SEC' , 1, 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'MM', 'REF_PRICE_DIVIDER_FOR_BIN_WIDTH' , '10000', 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'SYNC', 'N_BINANCE_ORDERBOOK_ORDER_QUERY_COUNT_A_SIDE' , 200 , 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'SYNC', 'THRESHOLD_PRICE_DELTA_TO_TRIGGER_SYNC_IN_PERCENT' , '1.3', 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'SYNC', 'AVERAGE_SYNC_INTERVAL_TO_REF_ORDERBOOK_IN_SEC' , '7.5', 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'SYNC', 'REFPRICE_DIVIDER_FOR_STDEV_OF_RANDOM_PRICE_DIST' , '30', 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'DRIFT', 'AVERAGE_DRIFT_ORDER_INTERVAL_IN_SEC' , '5', 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'DRIFT', 'LIMIT_TO_MARKET_ORDER_COUNT_RATIO' , '[0.7,0.3]' , 1  ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'DRIFT', 'BUY_TO_SELL_RATIO' , '[0.5,0.5]', 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'DRIFT', 'ORDER_PRICE_DIST_STDEV' , '0.25', 1 ) ;
insert into settings ( `group` , `key` , `value`, active ) values ( 'DRIFT', 'ORDER_AMOUNT_MEAN_DEFAULT_FALLBACK' , '0.01', 1 ) ;


-- insert into settings ( `group` , `key` , `value`, active ) values ( '', '' , '', 1 ) ;
