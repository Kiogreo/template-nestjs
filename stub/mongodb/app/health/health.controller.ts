import { Controller, Get } from '@nestjs/common';
import {
    HealthCheckService,
    HealthIndicatorResult,
    MongooseHealthIndicator,
} from '@nestjs/terminus';
import { HealthCheckResult } from '@nestjs/terminus/dist/health-check';
import { AppLogger } from 'src/common/logger/logger.service';

@Controller('health')
export class HealthController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly mongooseHealth: MongooseHealthIndicator, // NOTE: enable this if using mongodb
        private readonly logger: AppLogger,
    ) {
        this.logger.setContext(HealthController.name);
    }

    @Get()
    async index(): Promise<HealthCheckResult> {
        this.logger.info('Health check triggered');
        return this.health.check([
            (): Promise<HealthIndicatorResult> =>
                this.mongooseHealth.pingCheck('mongodb'),
        ]);
    }
}
