interface addDiagnosisParams {
    token: any;
    patientId: string;
    clinicalHistory: string;
    sawDoctorBefore: string;
    sleepedAtHospital: string;
    drankMedicinesBefore: string;
    diseaseName: string;
    accompanyingDiagnoses: string;
    diagnosesNotes: string;
    severityOfDisorder: string;
    durationOfDisorder: string;
    riskLevel: string[];
}
export declare const addDiagnosis: ({ token, patientId, clinicalHistory, sawDoctorBefore, sleepedAtHospital, drankMedicinesBefore, diseaseName, accompanyingDiagnoses, diagnosesNotes, severityOfDisorder, durationOfDisorder, riskLevel, }: addDiagnosisParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/diagnosisModel").IDiagnosis, {}, import("mongoose").DefaultSchemaOptions> & import("../models/diagnosisModel").IDiagnosis & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
interface getDiagnosisParams {
    token: any;
    patientId: string;
}
export declare const getDiagnosis: ({ patientId, token, }: getDiagnosisParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: {
        clinicalHistory: string;
        sawDoctorBefore: string;
        sleepedAtHospital: string;
        drankMedicinesBefore: string;
        diseaseName: string;
        accompanyingDiagnoses: string;
        diagnosesNotes: string;
        severityOfDisorder: string;
        durationOfDisorder: string;
        riskLevel: string[];
        patientId: import("mongoose").Types.ObjectId;
        doctorId: import("mongoose").Types.ObjectId;
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
    };
    statusCode: number;
}>;
interface UpdateDiagnosisParams {
    diagnosisId: string;
    token: any;
    patientId: string;
    clinicalHistory: string;
    sawDoctorBefore: string;
    sleepedAtHospital: string;
    drankMedicinesBefore: string;
    diseaseName: string;
    accompanyingDiagnoses: string;
    diagnosesNotes: string;
    severityOfDisorder: string;
    durationOfDisorder: string;
    riskLevel: string[];
}
export declare const updateDiagnosis: ({ token, patientId, clinicalHistory, sawDoctorBefore, sleepedAtHospital, drankMedicinesBefore, diseaseName, accompanyingDiagnoses, diagnosesNotes, severityOfDisorder, durationOfDisorder, riskLevel, diagnosisId, }: UpdateDiagnosisParams) => Promise<{
    data: string;
    statusCode: number;
} | {
    data: import("mongoose").Document<unknown, {}, import("../models/diagnosisModel").IDiagnosis, {}, import("mongoose").DefaultSchemaOptions> & import("../models/diagnosisModel").IDiagnosis & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    };
    statusCode: number;
}>;
export {};
//# sourceMappingURL=diagnosisService.d.ts.map