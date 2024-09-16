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
module.exports= {
  conv_array_to_object
}
