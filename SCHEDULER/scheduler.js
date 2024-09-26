const asyncredis = require ( 'async-redis' )

const { URL_REDIS_CONN  } = require ( '../configs/redis' )
const { KEYNAMES } = require('../configs/keynames')

const rediscli = asyncredis.createClient ( URL_REDIS_CONN?.LOCAL ) 
const { spawn } = require ( 'child_process' )
const PATH_COMMON = `/home/cheny/works/ex-bot-20240911`
const TIME_CLEARANCES_IN_SEC = { 
  TO_CHARGER : 6.5 ,
  TO_MARKETMAKER : 5 ,
  TO_SYNCER : 3
}

const PATH = {
  CHARGER :     `${ PATH_COMMON }/CHARGER/charger.js` ,
  MARKETMAKER : `${ PATH_COMMON }/INIT-OB/initob.js` ,
  SYNCER :      `${ PATH_COMMON }/RUNTIME/runtime-sync.js` ,
  DRIFTER :     `${ PATH_COMMON }/RUNTIME/runtime-drift.js` ,
}
const main = async () => {
  spawn ( `pm2 delete ${ PATH?.MARKETMAKER  }` )
  spawn ( `pm2 delete ${ PATH?.SYNCER  }`)
  spawn ( `pm2 delete ${ PATH?.DRIFTER  }`)

  rediscli.publish ( KEYNAMES?.REDIS?.CHANNEL_NAME_COMMON ,
    JSON.stringify (
      { receiver : KEYNAMES?.REDIS?.RECEIVERS?.CHARGER ,
        action : KEYNAMES?.REDIS?.ACTIONS?.RESTART ,
      }
    ) 
  ) // no await since

  setTimeout ( async () => { spawn ( `pm2 start ${ PATH?.MARKETMAKER  }`) } , 
      TIME_CLEARANCES_IN_SEC?.TO_CHARGER * 1000 )
  setTimeout ( async () => { spawn ( `pm2 start ${ PATH?.SYNCER  }`) } , 
    ( TIME_CLEARANCES_IN_SEC?.TO_CHARGER + TIME_CLEARANCES_IN_SEC?.TO_MARKETMAKER ) * 1000 )
  setTimeout ( async () => { spawn ( `pm2 start ${ PATH?.DRIFTER  }`) } , 
    ( TIME_CLEARANCES_IN_SEC?.TO_CHARGER + TIME_CLEARANCES_IN_SEC?.TO_MARKETMAKER + 
      TIME_CLEARANCES_IN_SEC?.TO_SYNCER
    ) * 1000 )
}

main ()

