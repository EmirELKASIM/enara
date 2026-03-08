import { verifyJWT } from "../../middlewares/helperJWT";
import experienceModel from "../models/experienceModel";
import userModel from "../models/userModel";

interface addExperienceParams {
  userId: string;
  experienceSummary: string;
  experienceDesc: string;
  certificates: string;
  language: string;
}

export const addExperience = async ({
  userId,
  experienceSummary,
  experienceDesc,
  certificates,
  language,
}: addExperienceParams) => {
  const findUser = await userModel.findById(userId);
  if (!findUser) {
    return { data: "User not found", statusCode: 401 };
  }
  const newExperience = new experienceModel({
    userId,
    experienceSummary,
    experienceDesc,
    certificates,
    language,
  });
  await newExperience.save();

  return { data: newExperience, statusCode: 200 };
};

export const getExperience = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return {
      data: "Invalid token",
      statusCode: 400,
    };
  }
  const findExperience = await experienceModel.findOne({
    userId: tokenDetails.id,
  });
  if (!findExperience) {
    return { data: "Put expertise on your account", statusCode: 200 };
  }
  return {
    data: {
      id: findExperience._id,
      experienceSummary: findExperience.experienceSummary,
      experienceDesc: findExperience.experienceDesc,
      certificates: findExperience.certificates,
      language: findExperience.language,
    },
    statusCode: 200,
  };
};
interface getExperienceWithId {
  userId:string;
}

export const getExperienceWithId = async ({ userId }:getExperienceWithId) => {
  
  const findExperience = await experienceModel.findOne({
    userId
  });
  if (!findExperience) {
    return { data: "expertise not found", statusCode: 200 };
  }
  return {
    data: {
      id: findExperience._id,
      experienceSummary: findExperience.experienceSummary,
      experienceDesc: findExperience.experienceDesc,
      certificates: findExperience.certificates,
      language: findExperience.language,
    },
    statusCode: 200,
  };
};



interface updateExperienceParams {
  userId: string;
  experienceSummary: string;
  experienceDesc: string;
  certificates: string;
  language: string;
}
export const updateExperience = async ({
  userId,
  experienceSummary,
  experienceDesc,
  certificates,
  language,
}: updateExperienceParams) => {
  const findExperience = await experienceModel.findOne({userId});
  if(!findExperience){
    const newExperience = new experienceModel({
      userId,
      experienceSummary,
  experienceDesc,
  certificates,
  language,
    });
    await newExperience.save();
    return { data:"New experience has been added", statusCode: 200}
  }
  findExperience.experienceSummary = experienceSummary;
  findExperience.experienceDesc = experienceDesc;
  findExperience.certificates = certificates;
  findExperience.language = language;
  await findExperience.save();
  return {
    data:{
      id: userId,
      experienceSummary: findExperience.experienceSummary,
      experienceDesc: findExperience.experienceDesc,
      certificates: findExperience.certificates,
      language: findExperience.language
    },
    statusCode: 200,
  }

};
