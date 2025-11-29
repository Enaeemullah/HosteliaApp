import { FeeStatus } from '../../common/enums/fee-status.enum';
export declare class CreateFeeDto {
    amount: number;
    dueDate: string;
    status?: FeeStatus;
}
