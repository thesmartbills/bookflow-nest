import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Booking, BookingSchema } from './schemas/booking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Booking.name,
        schema: BookingSchema,
      },
    ]),
  ],
  exports: [MongooseModule],
})
export class BookingsModule {}
