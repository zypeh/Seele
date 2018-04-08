import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

import * as fs from 'fs'
import * as path from 'path'

const readGQL = (filename: string) =>
    fs.readFileSync(path.join(__dirname, filename), 'utf-8')

const typeDefs = readGQL('schema.graphql')

export default makeExecutableSchema({
    typeDefs,
    resolvers,
})
