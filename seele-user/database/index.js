const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'bumiprop',
    'clu',
    'zelda119',
    {
        host: 'localhost',
        dialect: 'postgres'
    }
)

const db = {
    User: sequelize.import('./user'),
}

// beware singleton
Object.keys(db).map(modelName => {
    if ('associate' in db[modelName])
        db[modelName].associate(db)
})

db.sequelize = sequelize

module.exports = db