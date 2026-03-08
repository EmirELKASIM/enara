import { verifyJWT } from "../../middlewares/helperJWT";
import requestModel from "../models/requestModel";
import summaryModel from "../models/summaryModel";
import userModel from "../models/userModel";

interface sendRequest {
  token: any;
  doctorId: string;
}

export const sendRequest = async ({ token, doctorId }: sendRequest) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findPatient = await userModel.findById(tokenDetails.id);
  if (!findPatient) {
    return { data: "Patient Account not found!", statusCode: 400 };
  }

  const findDoctor = await userModel.findById(doctorId);
  if (!findDoctor) {
    return { data: "Doctor Account not found!", statusCode: 400 };
  }
  const doctorPhoneNumber = findDoctor.codeNumber + findDoctor.phoneNumber;
  const patientPhoneNumber = findPatient.codeNumber + findPatient.phoneNumber;

  const newRequests = new requestModel({
    patientId: tokenDetails.id,
    doctorId: doctorId,
    firstName: findPatient.firstName,
    lastName: findPatient.lastName,
    age: findPatient.age,
    patientPhoneNumber: patientPhoneNumber,
    doctorPhoneNumber: doctorPhoneNumber,
    doctorFirstName: findDoctor.firstName,
    doctorLastName: findDoctor.lastName,
    doctorAccountType: findDoctor.accountType,
    acceptedFromPatient: true,
  });
  await newRequests.save();
  return { data: newRequests, statusCode: 200 };
};

export const getRequest = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findRequests = await requestModel.find({
    doctorId: tokenDetails.id,
    acceptedFromPatient: true,
    acceptedFromDoctor: false,
  });
  if (!findRequests) {
    return { data: "no Requests found!", statusCode: 400 };
  }
  return {
    data: findRequests,
    statusCode: 200,
  };
};

export const getAcceptRequest = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findRequests = await requestModel.find({
    doctorId: tokenDetails.id,
    acceptedFromPatient: true,
    acceptedFromDoctor: true,
  });
  if (!findRequests) {
    return { data: "no Requests found!", statusCode: 400 };
  }
  return {
    data: findRequests,
    statusCode: 200,
  };
};

interface GetLinkedRequest {
  token: any;
  doctorId: string;
}
export const getLinkedRequest = async ({
  doctorId,
  token,
}: GetLinkedRequest) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
  const findRequest = await requestModel.findOne({
    doctorId: doctorId,
    patientId: tokenDetails.id,
  });
  if (!findRequest) {
    return { data: "request not found", statusCode: 400 };
  }
  return { data: findRequest, statusCode: 200 };
};
interface getInfoWithId {
  requestId: string;
}

export const getInfoWithId = async ({ requestId }: getInfoWithId) => {
  const findFile = await requestModel.findOne({ _id: requestId });
  if (!findFile) {
    return { data: "File not found", statusCode: 400 };
  }
  return { data: findFile, statusCode: 200 };
};

interface UpdateRequest {
  acceptedFromDoctor: boolean;
  requestId: string;
}
export const updateRequest = async ({
  acceptedFromDoctor,
  requestId,
}: UpdateRequest) => {
  if (acceptedFromDoctor === false) {
    const findRequestAndDelete =
      await requestModel.findByIdAndDelete(requestId);

    if (!findRequestAndDelete) {
      return { data: "request not found ", statusCode: 400 };
    }
    return { data: "deleted successfuly", statusCode: 200 };
  }
  const findRequest = await requestModel.findOneAndUpdate(
    {
      _id: requestId,
      acceptedFromDoctor: false,
    },
    {
      $set: { acceptedFromDoctor: acceptedFromDoctor },
    },
    { new: true },
  );
  if (!findRequest) {
    return { data: "Request not found", statusCode: 400 };
  }

  return { data: findRequest, statusCode: 200 };
};

interface DeleteRequestParams {
  requestId: string;
  patientId: string;
}
export const deleteRequest = async ({
  requestId,
  patientId,
}: DeleteRequestParams) => {
  const findRequest = await requestModel.findOneAndDelete({
    _id: requestId,
    patientId: patientId,
  });
  if (!findRequest) {
    return { data: "request not found", statusCode: 400 };
  }
  return { data: "request deleted", statusCode: 200 };
};

//------------------------------------------------------------------------------

export const getAllRequests = async () => {
  const getRequests = await requestModel.find();
  if (!getRequests) {
    return { data: " requests not found ", statusCode: 400 };
  }
  return { data: getRequests, statusCode: 200 };
};
