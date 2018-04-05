export default `
    scalar Date

    type User {
        name: String
        username: String
        avatar: String
        gender: String
    }
    
    type UserOwnerView {
        name: String
        username: String
        email: String
        avatar: String
        gender: String
        phone: String
    }

    type Unit {
        unitId: String
        name: String
        type: String
        description: String

        currency: String
        pricing: Float

        addr_zip: String
        addr_street: String
        addr_city: String
        addr_state: String
        addr_country: String

        published: Boolean
    }

    type File {
        id: String!
        name: String!
        type: String!
        size: Int!
        path: String!
    }

    input Upload {
        name: String!
        type: String!
        size: Int!
        path: String!
    }

    type AuthPayload {
        token: String!
        refreshToken: String!
    }

    type Query {
        unit(unitId: String!): Unit
    }

    type Mutation {
        register(username: String!, email: String!): Boolean!
        login(id: String!): Boolean!
        refreshToken: AuthPayload

        createUnit(
            name: String!,
            type: String!
        ): Unit

        updateUnit(
            unitId: String!
            name: String
            description: String
    
            currency: String
            pricing: Float
    
            addr_zip: String
            addr_street: String
            addr_city: String
            addr_state: String
            addr_country: String
        ): Unit

        bookUnit(id: String!, start: Date, end: Date):  Boolean!

    }

    schema {
        query: Query
        mutation: Mutation
    }
`