const db = require ( '../models' )
const findall = async (table, jfilter) => {
  return await db[table].findAll({ raw: true, where: jfilter });
};

const upsert = async ( { db , table , values, condition } ) => {
  let obj = await db [ table ].findOne({ where: condition })
  if ( obj ){ return obj.update(values) }
  else { return db [ table ].create( { ... values , ... condition } ) }
}

module.exports ={ 
  findall , 
  upsert
}