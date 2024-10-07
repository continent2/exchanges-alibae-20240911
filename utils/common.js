
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
const uuidreq = require('uuid')

const get_random_from_arr = (arr) => arr[ Math.floor(Math.random() * arr.length ) ]

const uuid = ()=> uuidreq.v4()

const KEYS = Object.keys

const deletejfields = (jdata, afields)=>{	if ( jdata && KEYS(jdata ) ) {} else { return null }
	afields.forEach ( elem => { delete jdata[ elem] } )
	return jdata
}

module.exports= {
  conv_array_to_object ,  
  get_random_from_arr ,
  uuid ,
  deletejfields
}
