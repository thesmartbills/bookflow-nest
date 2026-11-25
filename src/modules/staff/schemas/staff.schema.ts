import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

import {
  isValidEmail,
  isValidTime,
} from '../../../common/validators/schema.validators';

export type StaffDocument = HydratedDocument<Staff>;

export enum StaffStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

@Schema({ _id: false })
export class WorkingHour {
  @Prop({ required: true, enum: WeekDay })
  day: WeekDay;

  @Prop({ required: true })
  startTime: string;

  @Prop({ required: true })
  endTime: string;
}

export const WorkingHourSchema = SchemaFactory.createForClass(WorkingHour);

@Schema({ timestamps: true, collection: 'staff' })
export class Staff {
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
      message: 'Invalid staff email',
    },
  })
  email?: string;

  @Prop()
  phone?: string;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Location' }],
    default: [],
  })
  locationIds: Types.ObjectId[];

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Service' }],
    default: [],
  })
  serviceIds: Types.ObjectId[];

  @Prop({
    type: [WorkingHourSchema],
    default: [],
    validate: {
      validator: (hours: WorkingHour[]) => {
        const days = new Set<string>();

        return hours.every((hour) => {
          const validTime =
            isValidTime(hour.startTime) && isValidTime(hour.endTime);

          const validRange = hour.startTime < hour.endTime;

          const uniqueDay = !days.has(hour.day);

          days.add(hour.day);

          return validTime && validRange && uniqueDay;
        });
      },
      message: 'Invalid or duplicate staff working hours',
    },
  })
  workingHours: WorkingHour[];

  @Prop({
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status: StaffStatus;
}

export const StaffSchema = SchemaFactory.createForClass(Staff);

StaffSchema.index(
  { tenantId: 1, status: 1, locationIds: 1 },
  { name: 'idx_staff_tenant_status_location' },
);

StaffSchema.index(
  { tenantId: 1, serviceIds: 1, status: 1 },
  { name: 'idx_staff_tenant_service_status' },
);
