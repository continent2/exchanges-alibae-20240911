const API_PATH = {
  BIN_EP_SPOT_TICKER : `https://api.binance.com/api/v3/ticker/price?symbol=`
// EX: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
// resp.data => { symbol: 'BTCUSDT', price: '57727.99000000' }
  , 
  BIN_EP_ORDERBOOK : `https://api.binance.com/api/v3/depth` // ?limit=10&symbol=`
// https://api.binance.com/api/v3/depth?limit=10&symbol=BTCUSDT
}
module.exports= {
  API_PATH
}