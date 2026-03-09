interface addBookingParams {
    appointmentId: string;
    appointmentTime: string;
    appointmentDay: string;
    appointmentDate: string;
    doctorFirstName: string;
    doctorLastName: string;
    doctorAccountType: string;
    doctorId: string;
    meetingType: string;
    token: any;
    reportInfo: string;
    appointmentPrice: string;
    appointmentCoinType: string;
}
export declare const addBooking: ({ appointmentId, appointmentTime, appointmentDate, appointmentDay, doctorFirstName, doctorLastName, doctorAccountType, meetingType, doctorId, token, reportInfo, appointmentPrice, appointmentCoinType, }: addBookingParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        appointmentId: string;
        appointmentTime: string;
        appointmentDay: string;
        appointmentDate: string;
        doctorFirstName: string;
        doctorLastName: string;
        meetingType: string;
        firstName: string;
        lastName: string;
        doctorAccountType: string;
        doctorId: string;
        userId: any;
        status: string;
        reportInfo: string;
        appointmentPrice: string;
        appointmentCoinType: string;
    };
    statusCode: number;
}>;
export declare const getBookedForUser: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export declare const getBookedForDoctor: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
interface ReportInfo {
    token: any;
    patientId: string;
}
export declare const getReportInfo: ({ token, patientId }: ReportInfo) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export declare const getHistoryForUser: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export declare const getHistoryForDoctor: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
interface GetDekontDetailsParams {
    appointmentId: string;
    patientId: string;
    token: any;
}
export declare const getDekontDetails: ({ token, patientId, appointmentId, }: GetDekontDetailsParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface onCanceledParams {
    appointmentId: string;
    appointmentDate: string;
    appointmentTime: string;
    doctorId: string;
    token: any;
}
export declare const onCanceled: ({ token, appointmentId, appointmentDate, appointmentTime, doctorId, }: onCanceledParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface onUserHistoryDelete {
    appointmentId: string;
    token: any;
}
export declare const onUserHistoryDelete: ({ appointmentId, token, }: onUserHistoryDelete) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface onDoctorHistoryDelete {
    appointmentId: string;
    token: any;
}
export declare const onDoctorHistoryDelete: ({ appointmentId, token, }: onDoctorHistoryDelete) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface onIsActiveParams {
    token: any;
    appointmentId: string;
    meetingUrl: string;
}
export declare const onIsActive: ({ token, appointmentId, meetingUrl, }: onIsActiveParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface getActiveAppointment {
    token: any;
    appointmentId: string;
}
export declare const getActiveAppointment: ({ token, appointmentId, }: getActiveAppointment) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface UpdateBookingParams {
    token: any;
    newAppointmentId: string;
    bookingId: string;
    newTime: string;
    newDate: string;
    newDay: string;
}
export declare const updateBooking: ({ token, bookingId, newAppointmentId, newTime, newDate, newDay, }: UpdateBookingParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null;
    statusCode: number;
}>;
interface ChangeBookingParams {
    changeDetails: string;
    appointmentId: string;
    token: any;
}
export declare const changeBooking: ({ appointmentId, changeDetails, token, }: ChangeBookingParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface SendDekontParams {
    dekontCode: string;
    dekontNotes: string;
    appointmentId: string;
    token: any;
}
export declare const sendDekont: ({ dekontCode, dekontNotes, appointmentId, token, }: SendDekontParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface AcceptedDekontParams {
    appointmentId: string;
    patientId: string;
    token: any;
}
export declare const acceptedDekont: ({ appointmentId, patientId, token, }: AcceptedDekontParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export declare const getAllBookings: () => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/bookingModel").IBooking, {}, import("mongoose").DefaultSchemaOptions> & import("../models/bookingModel").IBooking & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export {};
//# sourceMappingURL=bookingService.d.ts.map