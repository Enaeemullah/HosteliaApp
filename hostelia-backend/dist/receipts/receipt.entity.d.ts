import { Fee } from '../fees/fee.entity';
export declare class Receipt {
    id: string;
    reference: string;
    paidOn: Date;
    notes?: string;
    fee: Fee;
    generatedAt: Date;
}
