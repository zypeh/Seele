export default (sequelize, DataTypes) => {
    const Booking = sequelize.define('Booking', {
        id:    { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true, unique: true },
        bookStatus: { type: DataTypes.ENUM('accepted', 'pending', 'rejected'), defaultValue: 'pending' },
        requestFromUser: { type: DataTypes.INTEGER },
        requestUnit: { type: DataTypes.INTEGER },
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })

    return Booking
}