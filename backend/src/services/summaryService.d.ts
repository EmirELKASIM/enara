interface SummaryParams {
    userId: string;
    psychologicalSummary: string;
}
export declare const sendSummary: ({ userId, psychologicalSummary, }: SummaryParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/summaryModel").ISummary, {}, import("mongoose").DefaultSchemaOptions> & import("../models/summaryModel").ISummary & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export declare const getSummary: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId;
        psychologicalSummary: string;
    };
    statusCode: number;
}>;
interface GetSummaryWithId {
    userId: string;
}
export declare const getSummaryWithId: ({ userId }: GetSummaryWithId) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId;
        psychologicalSummary: string;
    };
    statusCode: number;
}>;
interface updateSummaryParams {
    userId: string;
    psychologicalSummary: string;
}
export declare const updateSummary: ({ userId, psychologicalSummary, }: updateSummaryParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: string;
        psychologicalSummary: string;
    };
    statusCode: number;
}>;
export {};
//# sourceMappingURL=summaryService.d.ts.map