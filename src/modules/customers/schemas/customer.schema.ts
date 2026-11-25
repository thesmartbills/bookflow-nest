import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import { isValidEmail } from '../../../common/validators/schema.validators';

export type CustomerDocument = HydratedDocument<Customer>;

export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Schema({ timestamps: true, collection: 'customers' })
export class Customer {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
  })
  tenantId: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({
    lowercase: true,
    trim: true,
    validate: {
      validator: (value?: string) => !value || isValidEmail(value),
      message: 'Invalid customer email',
    },
  })
  email?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop()
  notes?: string;

  @Prop({
    enum: CustomerStatus,
    default: CustomerStatus.ACTIVE,
  })
  status: CustomerStatus;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.index(
  { tenantId: 1, phone: 1 },
  {
    name: 'idx_customer_tenant_phone',
    partialFilterExpression: {
      phone: { $type: 'string' },
    },
  },
);

CustomerSchema.index(
  { tenantId: 1, email: 1 },
  {
    name: 'idx_customer_tenant_email',
    partialFilterExpression: {
      email: { $type: 'string' },
    },
  },
);

CustomerSchema.index(
  { tenantId: 1, createdAt: -1 },
  { name: 'idx_customer_tenant_created' },
);
