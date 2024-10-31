const db = require ( '../models' )
const { uuid } = require ( './common')

const updaterows = async(table,jfilter,jupdates)=>  { return await db[table].update(jupdates,{where:jfilter}) }

const findall = async (table, jfilter , attributes ) => {
  if ( attributes){ return await db[table].findAll({ raw: true, where: jfilter , attributes}) }
  else {            return await db[table].findAll({ raw: true, where: jfilter , })}
}
const findone=async(table,jfilter)=>          { return await db[table].findOne({raw:true,where:jfilter})}
const upsert = async ( { db , table , values, condition } ) => {  
  let obj = await db [ table ].findOne({ where: condition })
  let transaction = await db.sequelize.transaction( )
  if ( obj ){ 
    let resp = await obj.update( values , { transaction }) 
    await transaction.commit()
    return resp
  }
  else { 
    let resp = await db [ table ].create( { ... values , ... condition , } , { transaction }  )
//    let resp = await db [ table ].create( { ... values , ... condition , id : uuid() } , { transaction }  )
    await transaction.commit()
    return resp
  }
}
const upsert_sane = async ( { db , table , values, condition } ) => {  
  let obj = await db [ table ].findOne({ where: condition })
  let transaction = await db.sequelize.transaction( )
  if ( obj ){ 
    let resp = await obj.update( values , { transaction }) 
    await transaction.commit()
    return resp
  }
  else { 
    let resp = await db [ table ].create( { ... values , ... condition ,  } , { transaction }  ) // id : uuid()
    await transaction.commit()
    return resp
  }
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
const createrow=async(table,jdata)=>{return await db[table].create(jdata)}
const countrows_scalar = (table,jfilter)=>{
  return new Promise ((resolve,reject)=>{
    db[table].count({where:{... jfilter} } ).then(resp=>{
      if(resp)  {resolve( resp)}
      else      {resolve( )    }
    })
  })
}
module.exports ={ 
  updaterows ,
  findall , 
  findone ,
  upsert ,
  upsert_sane ,
  moverow,
  createrow , 
  countrows_scalar
}
