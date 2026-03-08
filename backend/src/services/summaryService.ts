import { generateJWT, verifyJWT } from "../../middlewares/helperJWT";
import { decrypt, encrypt } from "../../utils/encryption";
import summaryModel from "../models/summaryModel";
import userModel from "../models/userModel";

interface SummaryParams {
  userId: string;
  psychologicalSummary: string;
}

export const sendSummary = async ({
  userId,
  psychologicalSummary,
}: SummaryParams) => {
  const findUser = await userModel.findById(userId);
  if (!findUser) {
    return { data: "User not found", statusCode: 401 };
  }
  const newSummary = new summaryModel({
    userId,
    psychologicalSummary: encrypt(psychologicalSummary),
  });
  await newSummary.save();

  return {
    data: newSummary,
    statusCode: 200,
  };
};

export const getSummary = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return {
      data: "Invalid token",
      statusCode: 400,
    };
  }

  const findSummary = await summaryModel.findOne({ userId: tokenDetails.id });
  if (!findSummary) {
    return { data: "Write a summary of the patient's condition", statusCode: 400 };
  }
  return {
    data: {
      id: findSummary._id,
      psychologicalSummary: decrypt(findSummary.psychologicalSummary),
    },
    statusCode: 200,
  };
};

interface GetSummaryWithId {
  userId: string;
}
export const getSummaryWithId = async ({ userId }: GetSummaryWithId) => {
 
  const findSummary = await summaryModel.findOne({ userId });
  if (!findSummary) {
    return { data: "summary not found", statusCode: 400 };
  }
  return {
    data: {
      id: findSummary._id,
      psychologicalSummary: decrypt(findSummary.psychologicalSummary),
    },
    statusCode: 200,
  };
};


interface updateSummaryParams {
  userId: string;
  psychologicalSummary: string;
}

export const updateSummary = async ({
  userId,
  psychologicalSummary,
}: updateSummaryParams) => {
  const findSummary = await summaryModel.findOne({ userId });
  if (!findSummary) {
    const newSummary = new summaryModel({
      userId,
      psychologicalSummary: encrypt(psychologicalSummary),
    });
    await  newSummary.save();
    return { data: "A new summary has been added", statusCode: 200 };
  }
  findSummary.psychologicalSummary = encrypt(psychologicalSummary);
  await findSummary.save();
  return {
    data: {
      id: userId,
      psychologicalSummary: findSummary.psychologicalSummary,
    },
    statusCode: 200,
  };
};
