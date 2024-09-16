const db = require ( '../models' )
const findall = async (table, jfilter) => {
  return await db[table].findAll({ raw: true, where: jfilter });
};

module.exports ={ 
  findall
}