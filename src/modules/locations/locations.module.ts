import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Location, LocationSchema } from './schemas/location.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Location.name,
        schema: LocationSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class LocationsModule {}
