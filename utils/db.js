const db = require ( '../models' )
const { uuid } = require ( './common')
const findall = async (table, jfilter) => {
  return await db[table].findAll({ raw: true, where: jfilter });
}

const upsert = async ( { db , table , values, condition } ) => {
  let obj = await db [ table ].findOne({ where: condition })
  if ( obj ){ return obj.update(values) }
  else { return db [ table ].create( { ... values , ... condition , id : uuid() } ) }
}

module.exports ={ 
  findall , 
  upsert
}
