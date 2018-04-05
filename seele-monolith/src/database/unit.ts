export default (sequelize, DataTypes) => {
    const Unit = sequelize.define('Unit', {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
        unitId: { type: DataTypes.STRING(32), unique: true },
        name: { type: DataTypes.STRING(100) },
        type: { type: DataTypes.STRING(64) },

        description: { type: DataTypes.TEXT, defaultValue: "" },

        pricing:   { type: DataTypes.NUMERIC(2), allowNull: true },
        currency:  { type: DataTypes.ENUM("MYR", "USD", "RMB"), allowNull: true },
        published: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: true },

        geo: { type: DataTypes.GEOMETRY('POINT'), allowNull: true },

        addr_zip:     { type: DataTypes.STRING, allowNull: true },
        addr_street:  { type: DataTypes.STRING, allowNull: true },
        addr_city:    { type: DataTypes.STRING, allowNull: true },
        addr_state:   { type: DataTypes.STRING, allowNull: true },
        addr_country: { type: DataTypes.STRING, allowNull: true },

        // Amenities & Facilities, etc.
        amenities:  { type: DataTypes.JSONB, defaultValue: {}, allowNull: true },
        facilities: { type: DataTypes.JSONB, defaultValue: {}, allowNull: true },
        notes:      { type: DataTypes.JSONB, defaultValue: {}, allowNull: true },

        // Customizable forms
        forms: { type: DataTypes.JSONB, defaultValue: {}, allowNull: true },

        // Medias
        medias: { type: DataTypes.ARRAY(DataTypes.JSONB), allowNull: true },

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })

    return Unit 
}