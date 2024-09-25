
const get_random_float =( { min , max } )=> ( Math.random() * ( max  - min + 1)) + min

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const gaussian = ( { mean , stdev })=>{ //  function gaussianRandom(mean=0, stdev=1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );    
  return z * stdev + mean // Transform to the desired mean and standard deviation: //}
}
const gaussian_with_polarity = ( { mean , stdev , polarity } )=>{ //  function gaussianRandom(mean=0, stdev=1) {
  // POLARITY PARAMETER : +1 OR -1
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  switch ( polarity ) {
    case +1 : z = Math.abs( z ) ; break
    case -1 : z = -1 * Math.abs( z ) ; break
    default : z = Math.abs( z ) ; break
  }
  return z * stdev + mean // Transform to the desired mean and standard deviation: //}
}
module.exports = {
  get_random_float ,
  getRandomInt ,
  gaussian ,
  gaussian_with_polarity
}
