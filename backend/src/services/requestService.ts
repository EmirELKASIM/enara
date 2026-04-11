import { verifyJWT } from "../middlewares/helperJWT";
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
  

  const newRequests = new requestModel({
    patientId: tokenDetails.id,
    doctorId: doctorId,
    firstName: findPatient.firstName,
    lastName: findPatient.lastName,
    age: findPatient.age,
    patientPhoneNumber: findPatient.phoneNumber,
    doctorPhoneNumber: findDoctor.phoneNumber,
    doctorFirstName: findDoctor.firstName,
    doctorLastName: findDoctor.lastName,
    doctorAccountType: findDoctor.accountType,
    acceptedFromPatient: true,
    notifications: [
      {
        type: "sent",
        message: "طلب صداقة جديد",
        sent: true,
        sentAt: new Date(),
        read: false,
      },
    ],
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

export const getNotifications = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }

  const user = await userModel.findById(tokenDetails.id);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }

  let requests;

  if (user.accountType !== "personal") {
    requests = await requestModel
      .find({ doctorId: tokenDetails.id })
      .sort({ createdAt: -1 });
  } else {
    requests = await requestModel
      .find({ patientId: tokenDetails.id })
      .sort({ createdAt: -1 });
  }

  const accountType = user.accountType;

  const notifications = requests
    .flatMap((r: any) => {
      if (!r.notifications || r.notifications.length === 0) return [];
      return r.notifications.map((n: any) => ({
        _id: n._id,
        type: n.type,
        message: n.message,
        sent: n.sent,
        sentAt: n.sentAt,
        read: accountType !== "personal" ? n.readByDoctor : n.readByPatient,
        requestId: r._id,
        doctorFirstName: r.doctorFirstName,
        doctorLastName: r.doctorLastName,
        patientFirstName: r.firstName,
        patientLastName: r.lastName,
        accountType: accountType,
        doctorId: r.doctorId
      }));
    })
    .filter((n: any) => {
      if (accountType !== "personal") {
        return ["sent"].includes(n.type);
      } else {
        return ["accepted", "canceled"].includes(n.type);
      }
    })
    .sort((a, b) => (b.sentAt?.getTime() || 0) - (a.sentAt?.getTime() || 0));

  return {
    data: notifications,
    statusCode: 200,
  };
};

interface ReadNotParams {
  token: any;
  requestId: string;
  notificationId: string;
}

export const readNotifications = async ({
  token,
  requestId,
  notificationId,
}: ReadNotParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return { data: "Invalid token", statusCode: 400 };
  }
const user = await userModel.findById(tokenDetails.id);
  if (!user) {
    return { data: "User not found", statusCode: 404 };
  }
  const fieldToUpdate =
    user.accountType !== "personal"
      ? "notifications.$.readByDoctor"
      : "notifications.$.readByPatient";
  
  const result = await requestModel.updateOne(
      { _id: requestId, "notifications._id": notificationId },
      { $set: { [fieldToUpdate]: true } },
    );
  if (result.matchedCount === 0) {
    return { data: "Request not found", statusCode: 404 };
  }

  return {
    data: "All notifications for this request marked as read",
    statusCode: 200,
  };
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

  findRequest.notifications.push({
    type: "accepted",
    message: " تمت الموافقة على الصداقة",
    sent: true,
    sentAt: new Date(),
    readByDoctor: false,
      readByPatient: false,
    createdAt: new Date(),
  });

  await findRequest.save();

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
