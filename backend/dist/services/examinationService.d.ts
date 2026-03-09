interface QuickNotes {
    suicide: string;
    appetite: string;
    sleep: string;
    mod: string;
}
interface medicines {
    doz: string;
    drugName: string;
    intakeNotes: string;
    drankMedicinesBefore: string;
    drugTimes: string[];
}
interface AddComplaintParams {
    token: any;
    patientId: string;
    complaint: string;
    complaintDuration: string;
    complaintSeverity: string;
    quickNotes: QuickNotes;
    medicines: medicines[];
    reportInfo: Record<string, any>;
    meetingType: string;
}
export declare const addComplaint: ({ token, patientId, complaint, complaintDuration, complaintSeverity, quickNotes, medicines, reportInfo, meetingType, }: AddComplaintParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/examinationModel").IExamination, {}, import("mongoose").DefaultSchemaOptions> & import("../models/examinationModel").IExamination & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface GetExaminationInfo {
    patientId: string;
    token: any;
}
export declare const getExaminationInfo: ({ patientId, token, }: GetExaminationInfo) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        complaint: string;
        complaintDuration: string;
        complaintSeverity: string;
        quickNotes: {
            suicide: string;
            appetite: string;
            sleep: string;
            mod: string;
        };
        medicines: {
            doz: string;
            drugName: string;
            intakeNotes: string;
            drankMedicinesBefore: string;
            drugTimes: string[];
        }[];
        reportInfo: Record<string, any>;
        patientId: import("mongoose").Types.ObjectId;
        doctorId: import("mongoose").Types.ObjectId;
        doctorFirstName: string;
        doctorLastName: string;
        doctorAccountType: string;
        meetingType: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[];
    statusCode: number;
}>;
export declare const getExaminationUserInfo: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        complaint: string;
        complaintDuration: string;
        complaintSeverity: string;
        quickNotes: {
            suicide: string;
            appetite: string;
            sleep: string;
            mod: string;
        };
        medicines: {
            doz: string;
            drugName: string;
            intakeNotes: string;
            drankMedicinesBefore: string;
            drugTimes: string[];
        }[];
        reportInfo: Record<string, any>;
        patientId: import("mongoose").Types.ObjectId;
        doctorId: import("mongoose").Types.ObjectId;
        doctorFirstName: string;
        doctorLastName: string;
        doctorAccountType: string;
        meetingType: string;
        _id: import("mongoose").Types.ObjectId;
        $locals: Record<string, unknown>;
        $op: "save" | "validate" | "remove" | null;
        $where: Record<string, unknown>;
        baseModelName?: string;
        collection: import("mongoose").Collection;
        db: import("mongoose").Connection;
        errors?: import("mongoose").Error.ValidationError;
        isNew: boolean;
        schema: import("mongoose").Schema;
        __v: number;
    }[];
    statusCode: number;
}>;
interface GetExaminationAndDelete {
    examinationId: string;
    patientId: string;
    doctorId: string;
}
export declare const getExaminationAndDelete: ({ examinationId, patientId, doctorId, }: GetExaminationAndDelete) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/examinationModel").IExamination, {}, import("mongoose").DefaultSchemaOptions> & import("../models/examinationModel").IExamination & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export declare const getAllExaminations: () => Promise<{
    data: string;
    statusCode: number;
} | {
    data: (import("mongoose").Document<unknown, {}, import("../models/examinationModel").IExamination, {}, import("mongoose").DefaultSchemaOptions> & import("../models/examinationModel").IExamination & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[];
    statusCode: number;
}>;
export {};
//# sourceMappingURL=examinationService.d.ts.map