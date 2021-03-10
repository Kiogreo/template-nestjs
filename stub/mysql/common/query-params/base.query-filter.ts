import { BaseQueryParamDTO } from './base-dto.queryparam';
import { FindManyOptions } from 'typeorm';

/**
 * To build the query based on the query param passed in
 */
export abstract class BaseQueryFilterBuilder {
    constructor(private readonly qs: BaseQueryParamDTO) {}

    /**
     * return the TypeORM query
     * this will build based on the query param passed in
     * 1. column selection
     * 2. ordering
     * 3. conditional
     * 4. paginate
     */
    toTypeormQuery(isCount: boolean = false): FindManyOptions {
        const order: {} = this.getOrderBy();

        const options = {
            select: this.getFields(),
            order,
            where: this.getWhere(),
            skip: this.getSkip(),
        };

        if (!isCount) {
            options['take'] = this.getLimit();
        }

        return options;
    }

    getQs(): BaseQueryParamDTO {
        return this.qs;
    }

    /**
     * to check if request return pagination meta in query param
     */
    hasPaginationMeta(): boolean {
        return this.qs?.paginationMeta === 'true';
    }

    /**
     * return conditions
     */
    protected getWhere(): object {
        const conditions = {};
        Object.keys(this.qs || {}).forEach((key: string | number) => {
            if (this[key]) {
                Object.assign(conditions, this[key](this.qs[key]));
            }
        });

        return conditions;
    }

    /**
     * get ordering
     */
    protected getOrderBy(): object {
        if (this.qs?.orderBy) {
            const isLatest = this.qs.orderBy.startsWith('-');
            let columnName = isLatest
                ? this.qs.orderBy.substring(1)
                : this.qs.orderBy;

            return {
                [columnName]: isLatest ? -1 : 1,
            };
        } else {
            // default will be order by ID desc
            return {
                id: -1,
            };
        }
    }

    /**
     * calculate many records to skip based on the limit per page and current page request
     */
    protected getSkip(): number {
        return (this.qs?.page - 1) * (this.qs?.limit || 1);
    }

    /**
     * what are the fields to return
     */
    protected getFields(): string[] {
        return this.qs?.fields?.split(',');
    }

    protected getLimit(): number {
        return this.qs?.limit || 30;
    }
}
