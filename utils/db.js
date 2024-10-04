const db = require ( '../models' )
const { uuid } = require ( './common')
const findall = async (table, jfilter) => {
  return await db[table].findAll({ raw: true, where: jfilter });
}
const findone=async(table,jfilter)=>          { return await db[table].findOne({raw:true,where:jfilter})}
const upsert = async ( { db , table , values, condition } ) => {
  let obj = await db [ table ].findOne({ where: condition })
  if ( obj ){ return obj.update(values) }
  else { return db [ table ].create( { ... values , ... condition , id : uuid() } ) }
}
const moverow=async(fromtable, jfilter, totable , auxdata)=>{
	findone( fromtable, jfilter).then(async resp=>{
		if(resp){
			let {id} = resp
			delete resp['createdat']
			delete resp['updatedat']
			delete resp['id']
			await createrow(totable , {... resp , ... auxdata } )
//			deleterow (fromtable ,{id: resp.id} )
			return await db.sequelize.query(`delete from ${fromtable} where id=${id}` )
		}
		else{
		}
	})
}


module.exports ={ 
  findall , 
  findone ,
  upsert ,
  moverow
}
