export declare class NotificationsService {
    private readonly logger;
    private readonly transporter;
    sendFeeReminder(to: string, payload: {
        student: string;
        amount: number;
        dueDate: string;
    }): Promise<void>;
}
