import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import {
  isValidEmail,
  isValidTimezone,
} from '../../../common/validators/schema.validators';

export type LocationDocument = HydratedDocument<Location>;

export enum LocationStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ _id: false })
export class LocationAddress {
  @Prop()
  street?: string;

  @Prop()
  city?: string;

  @Prop()
  state?: string;

  @Prop()
  country?: string;

  @Prop()
  postalCode?: string;
}

export const LocationAddressSchema =
  SchemaFactory.createForClass(LocationAddress);

@Schema({ _id: false })
export class LocationContact {
  @Prop()
  phone?: string;

  @Prop({
    lowercase: true,
    trim: true,
    validate: {
      validator: (value?: string) => !value || isValidEmail(value),
      message: 'Invalid location email',
    },
  })
  email?: string;
}

export const LocationContactSchema =
  SchemaFactory.createForClass(LocationContact);

@Schema({ timestamps: true, collection: 'locations' })
export class Location {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, uppercase: true, trim: true })
  code: string;

  @Prop({ type: LocationAddressSchema })
  address?: LocationAddress;

  @Prop({ type: LocationContactSchema })
  contact?: LocationContact;

  @Prop({
    required: true,
    default: 'Asia/Kolkata',
    validate: {
      validator: isValidTimezone,
      message: 'Invalid timezone',
    },
  })
  timezone: string;

  @Prop({
    enum: LocationStatus,
    default: LocationStatus.ACTIVE,
  })
  status: LocationStatus;
}

export const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index(
  { tenantId: 1, code: 1 },
  {
    unique: true,
    name: 'uq_location_tenant_code',
  },
);

LocationSchema.index(
  { tenantId: 1, status: 1 },
  { name: 'idx_location_tenant_status' },
);
