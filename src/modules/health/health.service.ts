import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    return {
      success: true,
      service: 'bookflow-api',
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
