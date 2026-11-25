import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import {
  isValidCurrency,
  isValidEmail,
  isValidSlug,
  isValidTimezone,
} from '../../../common/validators/schema.validators';

export type TenantDocument = HydratedDocument<Tenant>;

export enum BusinessType {
  SALON = 'SALON',
  CLINIC = 'CLINIC',
  SPA = 'SPA',
  FITNESS = 'FITNESS',
  CONSULTING = 'CONSULTING',
  OTHER = 'OTHER',
}

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  INACTIVE = 'INACTIVE',
}

export enum StaffAssignmentMode {
  CUSTOMER_CHOICE = 'CUSTOMER_CHOICE',
  AUTOMATIC = 'AUTOMATIC',
  BOTH = 'BOTH',
}

@Schema({ _id: false })
export class TenantAddress {
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

export const TenantAddressSchema = SchemaFactory.createForClass(TenantAddress);

@Schema({ _id: false })
export class BookingSettings {
  @Prop({
    enum: StaffAssignmentMode,
    default: StaffAssignmentMode.BOTH,
  })
  staffAssignmentMode: StaffAssignmentMode;
}

export const BookingSettingsSchema =
  SchemaFactory.createForClass(BookingSettings);

@Schema({ timestamps: true, collection: 'tenants' })
export class Tenant {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    required: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: isValidSlug,
      message: 'Invalid tenant slug',
    },
  })
  slug: string;

  @Prop({
    required: true,
    enum: BusinessType,
  })
  businessType: BusinessType;

  @Prop({
    lowercase: true,
    trim: true,
    validate: {
      validator: (value?: string) => !value || isValidEmail(value),
      message: 'Invalid tenant email',
    },
  })
  email?: string;

  @Prop()
  phone?: string;

  @Prop({ type: TenantAddressSchema })
  address?: TenantAddress;

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
    required: true,
    uppercase: true,
    default: 'INR',
    validate: {
      validator: isValidCurrency,
      message: 'Invalid currency format',
    },
  })
  currency: string;

  @Prop({
    enum: TenantStatus,
    default: TenantStatus.ACTIVE,
  })
  status: TenantStatus;

  @Prop({
    type: BookingSettingsSchema,
    default: () => ({
      staffAssignmentMode: StaffAssignmentMode.BOTH,
    }),
  })
  bookingSettings: BookingSettings;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

TenantSchema.index({ slug: 1 }, { unique: true, name: 'uq_tenant_slug' });

TenantSchema.index(
  { status: 1, createdAt: -1 },
  { name: 'idx_tenant_status_created' },
);
