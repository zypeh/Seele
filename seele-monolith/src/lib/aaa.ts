import db from '../database'

async function viewUnit (request, reply) {
    return await db.Unit.findOne({ unitId: request.body.unitId })
}

async function updateUnit (request, reply) {
    const unitId = request.params.id
    const {
        name,
        description,
        currency,
        pricing,
        addr_zip,
        addr_street,
        addr_city,
        addr_state,
        addr_country
    } = request.body
    // check if this user is the owner or not
    const unit = await db.Unit.findOne({ where: { unitId, owner: 'zypeh' }})
    if (!unit) return null // unit not found
    const updatedUnit = await unit.update({
        unitId,
        name,
        description,
        currency,
        pricing,
        addr_zip,
        addr_street,
        addr_city,
        addr_state,
        addr_country
    }, { returning: true, plain: true })
    return updatedUnit.dataValues
}

async function listingRequest (request, reply) {
    const unitId = request.params.id
    
}

async function unitPublish (request, reply) {
    const unitId = request.params.id
    // check if unit is existing
    const [unitExists, requestSent] = await Promise.all([
        await db.Unit.findOne({ where: { unitId }}),
        await db.Booking.findOne({ where: { unitId }})
    ])

    if (unitExists && requestSent) {
        const updatedUnit = await unitExists.update({
            publish: true
        }, { returning: true, plain: true })
        return updatedUnit.dataValues
    } else {
        return null
    }
}