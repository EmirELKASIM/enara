interface RegisterParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    accountType: string;
    birthday: string;
    gender: string;
    maritalStatus: string;
    consultation: string;
    privacyPolicy: boolean;
    phoneNumber: string;
    codeNumber: string;
}
export declare const register: ({ firstName, lastName, email, password, accountType, birthday, gender, maritalStatus, consultation, privacyPolicy, phoneNumber, codeNumber, }: RegisterParams) => Promise<{
    data: string;
    statusCode: number;
}>;
interface LoginParams {
    email: string;
    password: string;
}
export declare const login: ({ email, password }: LoginParams) => Promise<{
    data: string;
    statusCode: number;
}>;
export declare const getInfo: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        accountType: string;
        gender: string;
        age: string;
        maritalStatus: string;
        consultation: string;
        phoneNumber: string;
        codeNumber: string;
    };
    statusCode: number;
}>;
interface GetInfoWithId {
    userId: string;
}
export declare const getInfoWithId: ({ userId }: GetInfoWithId) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        accountType: string;
        gender: string;
        age: string;
        maritalStatus: string;
        consultation: string;
        phoneNumber: string;
        codeNumber: string;
    };
    statusCode: number;
}>;
interface updateInfoParams {
    id: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthday: string;
    maritalStatus: string;
    phoneNumber: string;
    codeNumber: string;
}
export declare const updateInfo: ({ id, firstName, lastName, gender, birthday, maritalStatus, phoneNumber, codeNumber, }: updateInfoParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId;
        email: string;
        firstName: string;
        lastName: string;
        gender: string;
        birthday: string;
        age: number;
        maritalStatus: string;
        phoneNumber: string;
        codeNumber: string;
    };
    statusCode: number;
}>;
interface forgotPasswordParams {
    email: string;
}
export declare const forgotPassword: ({ email }: forgotPasswordParams) => Promise<{
    data: string;
    statusCode: number;
    message?: never;
} | {
    message: string;
    statusCode: number;
    data?: never;
}>;
interface resetPasswordParams {
    token: any;
    newPassword: string;
}
export declare const resetPasword: ({ token, newPassword, }: resetPasswordParams) => Promise<{
    message: string;
    statusCode: number;
}>;
interface changePasswordParams {
    token: any;
    oldPassword: string;
    newPassword: string;
}
export declare const changePasword: ({ token, newPassword, oldPassword, }: changePasswordParams) => Promise<{
    data: string;
    statusCode: number;
}>;
export declare const deleteAccount: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId | undefined;
    };
    statusCode: number;
}>;
export declare const verifyEmail: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
}>;
export declare const getPersonalUsers: () => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/userModel").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models/userModel").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export declare const getImpersonalUsers: () => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/userModel").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models/userModel").IUser & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export {};
//# sourceMappingURL=userService.d.ts.map