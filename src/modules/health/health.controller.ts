import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly mongoose: MongooseHealthIndicator,
  ) {}

  // Process liveness: does not depend on MongoDB
  @Get('live')
  live() {
    return {
      status: 'alive',
    };
  }

  // Application readiness: checks MongoDB
  @Get('ready')
  @HealthCheck()
  ready() {
    return this.health.check([() => this.mongoose.pingCheck('mongodb')]);
  }
}
