interface addAppointmentParams {
    token: any;
    time: string;
    date: string;
    price: string;
    coinType: string;
}
export declare const addAppointment: ({ token, date, time, price, coinType, }: addAppointmentParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/appointmentModul").IAppointment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/appointmentModul").IAppointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export declare const getAppointments: ({ token }: {
    token: any;
}) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/appointmentModul").IAppointment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/appointmentModul").IAppointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export declare const getAllApointment: () => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/appointmentModul").IAppointment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/appointmentModul").IAppointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
interface DeleteAppointmentParams {
    appointmentTime: string;
    appointmentDate: string;
    token: any;
}
export declare const deleteAppointment: ({ appointmentTime, appointmentDate, token, }: DeleteAppointmentParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/appointmentModul").IAppointment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/appointmentModul").IAppointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface DeleteDateParams {
    appointmentDate: string;
    token: any;
}
export declare const deleteDate: ({ appointmentDate, token, }: DeleteDateParams) => Promise<{
    data: string;
    statusCode: number;
}>;
export declare const getApointments: () => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/appointmentModul").IAppointment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/appointmentModul").IAppointment & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export {};
//# sourceMappingURL=appointmentService.d.ts.map