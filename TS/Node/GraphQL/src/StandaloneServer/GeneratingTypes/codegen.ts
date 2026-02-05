
import type { CodegenConfig } from '@graphql-codegen/cli';
import path from 'node:path';

const config: CodegenConfig = {
  overwrite: true,
  schema: path.resolve(__dirname, "./schema.graphql"),
  generates: {
    [path.resolve(__dirname, "./generatedTypes.ts")]: {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        contextType: './server#MyContext'
      }
    }
  }
};

export default config;
