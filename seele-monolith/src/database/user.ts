export default (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id:              { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
        name:            { type: DataTypes.STRING(64) },

        username:        { type: DataTypes.STRING(64), unique: true },
        custom_username: { type: DataTypes.BOOLEAN, defaultValue: false },

        active:          { type: DataTypes.BOOLEAN, defaultValue: true },

        avatar:          { type: DataTypes.STRING(512), allowNull: true },
        registered:      { type: DataTypes.BOOLEAN, defaultValue: false },

        email:           { type: DataTypes.STRING(100), unique: true },
        email_code:      { type: DataTypes.STRING(64), allowNull: true }, // uuid v4
        email_verified:  { type: DataTypes.BOOLEAN, defaultValue: false },
        
        phone:           { type: DataTypes.STRING(12), allowNull: true },
        phone_verified:  { type: DataTypes.BOOLEAN, defaultValue: false },
        
        facebook_resp:   { type: DataTypes.JSONB, allowNull: true },
        google_resp:     { type: DataTypes.JSONB, allowNull: true },

        gender:          { type: DataTypes.ENUM("male", "female"), allowNull: true },

    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })

    User.associate = (models) => {
        // 1-to-Many with Unit
        User.hasMany(models.Unit, {
            foreignKey: 'owner'
        })
    }

    return User
}