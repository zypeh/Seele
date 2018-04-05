const Sequelize = require('sequelize')

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
    sequelize,
    Unit: sequelize.import('./unit'),
    Booking: sequelize.import('./booking'),
    User: sequelize.import('./user')
}

Object.keys(db).map(modelName => {
    if ('associate' in db[modelName])
        db[modelName].associate(db)
})

export default db