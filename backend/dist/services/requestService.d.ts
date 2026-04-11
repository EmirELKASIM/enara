interface sendRequest {
    token: any;
    doctorId: string;
}
export declare const sendRequest: ({ token, doctorId }: sendRequest) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/requestModel").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/requestModel").IRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export declare const getRequest: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/requestModel").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/requestModel").IRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export declare const getAcceptRequest: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/requestModel").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/requestModel").IRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
interface GetLinkedRequest {
    token: any;
    doctorId: string;
}
export declare const getLinkedRequest: ({ doctorId, token, }: GetLinkedRequest) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/requestModel").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/requestModel").IRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface getInfoWithId {
    requestId: string;
}
export declare const getInfoWithId: ({ requestId }: getInfoWithId) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/requestModel").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/requestModel").IRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export declare const getNotifications: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: any[];
    statusCode: number;
}>;
interface ReadNotParams {
    token: any;
    requestId: string;
    notificationId: string;
}
export declare const readNotifications: ({ token, requestId, notificationId, }: ReadNotParams) => Promise<{
    data: string;
    statusCode: number;
}>;
interface UpdateRequest {
    acceptedFromDoctor: boolean;
    requestId: string;
}
export declare const updateRequest: ({ acceptedFromDoctor, requestId, }: UpdateRequest) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/requestModel").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/requestModel").IRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface DeleteRequestParams {
    requestId: string;
    patientId: string;
}
export declare const deleteRequest: ({ requestId, patientId, }: DeleteRequestParams) => Promise<{
    data: string;
    statusCode: number;
}>;
export declare const getAllRequests: () => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/requestModel").IRequest, {}, import("mongoose").DefaultSchemaOptions> & import("../models/requestModel").IRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export {};
//# sourceMappingURL=requestService.d.ts.map