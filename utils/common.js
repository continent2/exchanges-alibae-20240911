
const conv_array_to_object = ( { arr , keyfieldname , valuefieldname })=>{
  let key = "exampleKey"
  let j = {}
  for ( let idx = 0 ;  idx<arr?.length; idx ++ ) {
    j [ arr[idx][ keyfieldname ]] = arr[idx ][ valuefieldname]
  }
  return j
  // const res = arr.map(x => ( { [ keyfieldname ]: [ valuefieldname ]}));
  // console.log(res);
}
const redisclihash = require( 'async-redis' ).createClient()
const uuidreq = require('uuid')
const { KEYNAMES } = require('../configs/keynames')

const get_random_from_arr = (arr) => arr[ Math.floor(Math.random() * arr.length ) ]

const uuid = ()=> uuidreq.v4()

const KEYS = Object.keys

const deletejfields = (jdata, afields)=>{	if ( jdata && KEYS(jdata ) ) {} else { return null }
	afields.forEach ( elem => { delete jdata[ elem] } )
	return jdata
}
const enqueue_act_count_log = async ( { workertype, n_orders_placed } )=>{
  let LOG_ACTS_COUNT_QUEUE_LENGTH = 50
  let respsetting = await findone ( 'settings' , { key: 'LOG_ACTS_COUNT_QUEUE_LENGTH' , active : 1 } )
  if ( Number.isFinite( +respsetting?.value )){ LOG_ACTS_COUNT_QUEUE_LENGTH = +respsetting?.value }
  else {}
  await redisclihash.lpush ( `${ KEYNAMES?.REDIS?.LOG_ACTS }-${ workertype }` , n_orders_placed )
  await redisclihash.ltrim ( `${ KEYNAMES?.REDIS?.LOG_ACTS }-${ workertype }` , 0 , LOG_ACTS_COUNT_QUEUE_LENGTH )
}
module.exports= {
  conv_array_to_object ,  
  get_random_from_arr ,
  uuid ,
  deletejfields ,
  enqueue_act_count_log
}
