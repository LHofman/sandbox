import { DynamicModule, Module } from "@nestjs/common";

class Connection {}
const createDatabaseProviders = (options: any, entities: any) => [];

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

// @Module({
//   imports: [DatabaseModule.forRoot([User])],
//   exports: [DatabaseModule],
// })
// export class AppModule {}