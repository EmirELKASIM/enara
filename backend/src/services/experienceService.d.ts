interface addExperienceParams {
    userId: string;
    experienceSummary: string;
    experienceDesc: string;
    certificates: string;
    language: string;
}
export declare const addExperience: ({ userId, experienceSummary, experienceDesc, certificates, language, }: addExperienceParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/experienceModel").IExperience, {}, import("mongoose").DefaultSchemaOptions> & import("../models/experienceModel").IExperience & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export declare const getExperience: ({ token }: any) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId;
        experienceSummary: string;
        experienceDesc: string;
        certificates: string;
        language: string;
    };
    statusCode: number;
}>;
interface getExperienceWithId {
    userId: string;
}
export declare const getExperienceWithId: ({ userId }: getExperienceWithId) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: import("mongoose").Types.ObjectId;
        experienceSummary: string;
        experienceDesc: string;
        certificates: string;
        language: string;
    };
    statusCode: number;
}>;
interface updateExperienceParams {
    userId: string;
    experienceSummary: string;
    experienceDesc: string;
    certificates: string;
    language: string;
}
export declare const updateExperience: ({ userId, experienceSummary, experienceDesc, certificates, language, }: updateExperienceParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        id: string;
        experienceSummary: string;
        experienceDesc: string;
        certificates: string;
        language: string;
    };
    statusCode: number;
}>;
export {};
//# sourceMappingURL=experienceService.d.ts.map