import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import {
  isValidCurrency,
  isValidMinorAmount,
} from '../../../common/validators/schema.validators';

export type ServiceDocument = HydratedDocument<Service>;

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ _id: false })
export class ServicePrice {
  @Prop({
    required: true,
    min: 0,
    validate: {
      validator: isValidMinorAmount,
      message: 'Price must be a non-negative safe integer',
    },
  })
  amountMinor: number;

  @Prop({
    required: true,
    uppercase: true,
    default: 'INR',
    validate: {
      validator: isValidCurrency,
      message: 'Invalid currency format',
    },
  })
  currency: string;
}

export const ServicePriceSchema = SchemaFactory.createForClass(ServicePrice);

@Schema({ timestamps: true, collection: 'services' })
export class Service {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ trim: true })
  category?: string;

  @Prop({
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: 'Duration must be an integer',
    },
  })
  durationMinutes: number;

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

  @Prop({ type: ServicePriceSchema, required: true })
  price: ServicePrice;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Location' }],
    default: [],
  })
  locationIds: Types.ObjectId[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Staff' }],
    default: [],
  })
  staffIds: Types.ObjectId[];

  @Prop({
    enum: ServiceStatus,
    default: ServiceStatus.ACTIVE,
  })
  status: ServiceStatus;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);

ServiceSchema.index(
  { tenantId: 1, status: 1, name: 1 },
  { name: 'idx_service_tenant_status_name' },
);

ServiceSchema.index(
  { tenantId: 1, locationIds: 1, status: 1 },
  { name: 'idx_service_location_status' },
);
