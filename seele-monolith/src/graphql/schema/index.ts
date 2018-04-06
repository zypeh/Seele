import * as fs from 'fs'
import * as path from 'path'

const readGQL = (filename: string) => {
   return fs.readFileSync(path.join(__dirname, filename), 'utf-8')
}

// Concatenate all these graphql files into one string
export default [
        readGQL("meta.graphql"),
        readGQL("unit.graphql"),
].join('\n')