import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import {
  isValidCurrency,
  isValidMinorAmount,
} from '../../../common/validators/schema.validators';

export type BookingDocument = HydratedDocument<Booking>;

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  NO_SHOW = 'NO_SHOW',
  EXPIRED = 'EXPIRED',
}

export enum BookingSource {
  ONLINE = 'ONLINE',
  STAFF_CREATED = 'STAFF_CREATED',
  ADMIN = 'ADMIN',
}

export enum BookingAssignmentType {
  CUSTOMER_SELECTED = 'CUSTOMER_SELECTED',
  AUTOMATIC = 'AUTOMATIC',
}

@Schema({ _id: false })
export class BookingServiceSnapshot {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    min: 1,
    validate: Number.isInteger,
  })
  durationMinutes: number;

  @Prop({
    required: true,
    min: 0,
    validate: isValidMinorAmount,
  })
  amountMinor: number;

  @Prop({
    required: true,
    uppercase: true,
    validate: isValidCurrency,
  })
  currency: string;

  @Prop({
    default: 0,
    min: 0,
    validate: Number.isInteger,
  })
  bufferBeforeMinutes: number;

  @Prop({
    default: 0,
    min: 0,
    validate: Number.isInteger,
  })
  bufferAfterMinutes: number;
}

export const BookingServiceSnapshotSchema = SchemaFactory.createForClass(
  BookingServiceSnapshot,
);

@Schema({ timestamps: true, collection: 'bookings' })
export class Booking {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  })
  tenantId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Location',
    required: true,
  })
  locationId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  })
  customerId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Staff',
    required: true,
  })
  staffId: Types.ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Service',
    required: true,
  })
  serviceId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  bookingNumber: string;

  @Prop({ type: BookingServiceSnapshotSchema, required: true })
  serviceSnapshot: BookingServiceSnapshot;

  @Prop({ required: true, type: Date })
  startAt: Date;

  @Prop({ required: true, type: Date })
  endAt: Date;

  @Prop({
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Prop({
    enum: BookingSource,
    default: BookingSource.ONLINE,
  })
  source: BookingSource;

  @Prop({
    enum: BookingAssignmentType,
    required: true,
  })
  assignmentType: BookingAssignmentType;

  @Prop()
  notes?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);

BookingSchema.pre('validate', function () {
  if (
    this.startAt instanceof Date &&
    this.endAt instanceof Date &&
    !Number.isNaN(this.startAt.getTime()) &&
    !Number.isNaN(this.endAt.getTime())
  ) {
    if (this.endAt <= this.startAt) {
      this.invalidate('endAt', 'Booking end time must be after start time');
    }

    if (
      this.serviceSnapshot?.durationMinutes &&
      this.endAt.getTime() - this.startAt.getTime() !==
        this.serviceSnapshot.durationMinutes * 60_000
    ) {
      this.invalidate(
        'endAt',
        'Booking duration does not match service snapshot',
      );
    }
  }
});

BookingSchema.index(
  { tenantId: 1, bookingNumber: 1 },
  {
    unique: true,
    name: 'uq_booking_tenant_number',
  },
);

BookingSchema.index(
  { tenantId: 1, staffId: 1, startAt: 1 },
  { name: 'idx_booking_staff_schedule' },
);

BookingSchema.index(
  { tenantId: 1, customerId: 1, createdAt: -1 },
  { name: 'idx_booking_customer_history' },
);

BookingSchema.index(
  { tenantId: 1, status: 1, startAt: 1 },
  { name: 'idx_booking_status_start' },
);
