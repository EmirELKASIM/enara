import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import { verifyJWT, generateJWT } from "../middlewares/helperJWT";
import jwt from "jsonwebtoken";
import { sendEmail, sendVerificationEmail } from "../utils/sendEmail";
import summaryModel from "../models/summaryModel";
import experienceModel from "../models/experienceModel";
import requestModel from "../models/requestModel";
import appointmentModel from "../models/appointmentModul";
import bookingModel from "../models/bookingModel";
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
export const register = async ({
  firstName,
  lastName,
  email,
  password,
  accountType,
  birthday,
  gender,
  maritalStatus,
  consultation,
  privacyPolicy,
  phoneNumber,
  codeNumber,
}: RegisterParams) => {
  const findUser = await userModel.findOne({ email });
  if (findUser) {
    return { data: "User already exists!", statusCode: 400 };
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age < 0 ? 0 : age; // حماية من تاريخ مستقبلي
  };
  const age = calculateAge(birthday);

  const newUser = new userModel({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    accountType,
    birthday,
    age,
    gender,
    maritalStatus,
    consultation,
    privacyPolicy,
    phoneNumber,
    codeNumber,
  });
  await newUser.save();
  await sendVerificationEmail(newUser);
  return {
    data: generateJWT({
      id: newUser._id,
      firstName,
      lastName,
      email,
      birthday,
      age,
      gender,
      maritalStatus,
      consultation,
      privacyPolicy,
      phoneNumber,
      codeNumber,
    }),
    statusCode: 200,
  };
};

interface LoginParams {
  email: string;
  password: string;
}

export const login = async ({ email, password }: LoginParams) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: " Incorrect email !", statusCode: 400 };
  }
  const checkVerify = await userModel.findOne({
    email,
    isEmailVerified: true
  })
  if(!checkVerify){
    return { data: "should verify your email", statusCode: 404}
  }
  const passwordMatch = await bcrypt.compare(password, findUser.password);
  if (!passwordMatch) {
    return { data: " Incorrect password !", statusCode: 400 };
  }
  if (passwordMatch) {
    return {
      data: generateJWT({
        id: findUser._id,
        email,
        firstName: findUser.firstName,
        lastName: findUser.lastName,
        accountType: findUser.accountType,
      }),
      statusCode: 200,
    };
  }

  return { data: "Incorrect email or password", statusCode: 400 };
};

export const getInfo = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return {
      data: "Invalid token",
      statusCode: 400,
    };
  }
  const findUser = await userModel.findById(tokenDetails.id);
  if (!findUser) {
    return { data: "User not found", statusCode: 400 };
  }
  return {
    data: {
      id: findUser._id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      accountType: findUser.accountType,
      gender: findUser.gender,
      age: findUser.age,
      maritalStatus: findUser.maritalStatus,
      consultation: findUser.consultation,
      phoneNumber: findUser.phoneNumber,
      codeNumber: findUser.codeNumber,
    },
    statusCode: 200,
  };
};

interface GetInfoWithId {
  userId: string;
}
export const getInfoWithId = async ({ userId }: GetInfoWithId) => {
  const findUser = await userModel.findById(userId);
  if (!findUser) {
    return { data: "User not found", statusCode: 400 };
  }
  return {
    data: {
      id: findUser._id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      accountType: findUser.accountType,
      gender: findUser.gender,
      age: findUser.age,
      maritalStatus: findUser.maritalStatus,
      consultation: findUser.consultation,
      phoneNumber: findUser.phoneNumber,
      codeNumber: findUser.codeNumber,
    },
    statusCode: 200,
  };
};

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

export const updateInfo = async ({
  id,
  firstName,
  lastName,
  gender,
  birthday,
  maritalStatus,
  phoneNumber,
  codeNumber,
}: updateInfoParams) => {
  const findUser = await userModel.findById(id);

  if (!findUser) {
    return { data: "User not found", statusCode: 401 };
  }

  const calculateAge = (birthday: string): number => {
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age < 0 ? 0 : age; // حماية من تاريخ مستقبلي
  };
  const age = calculateAge(birthday);

  findUser.firstName = firstName;
  findUser.lastName = lastName;
  findUser.gender = gender;
  findUser.birthday = birthday;
  findUser.age = age.toString();
  findUser.maritalStatus = maritalStatus;
  findUser.phoneNumber = phoneNumber;
  findUser.codeNumber = codeNumber;
  await findUser.save();
  return {
    data: {
      id: findUser._id,
      email: findUser.email,
      firstName: findUser.firstName,
      lastName: findUser.lastName,
      gender: findUser.gender,
      birthday: findUser.birthday,
      age: age,
      maritalStatus: findUser.maritalStatus,
      phoneNumber: findUser.phoneNumber,
      codeNumber: findUser.codeNumber,
    },
    statusCode: 200,
  };
};

interface forgotPasswordParams {
  email: string;
}

export const forgotPassword = async ({ email }: forgotPasswordParams) => {
  const findUser = await userModel.findOne({ email });
  if (!findUser) {
    return { data: "User not found", statusCode: 401 };
  }

  const resetToken = jwt.sign(
    { id: findUser._id },
    process.env.JWT_SECRET || "",
    { expiresIn: "15m" },
  );

  const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;

  await sendEmail(
    email,
    "Reset Password",
    `
    <h3>Password Reset</h3>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    `,
  );

  return { message: "Reset link sent to email", statusCode: 200 };
};

interface resetPasswordParams {
  token: any;
  newPassword: string;
}
export const resetPasword = async ({
  token,
  newPassword,
}: resetPasswordParams) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as any;
    const findUser = await userModel.findById(decoded.id);
    if (!findUser) {
      return { message: "User not found", statusCode: 400 };
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    findUser.password = hashedPassword;
    await findUser.save();
    return { message: "Password updated successfully", statusCode: 200 };
  } catch (error) {
    console.error("RESET ERROR:", error);
    return { message: "Invalid or expired token", statusCode: 400 };
  }
};

interface changePasswordParams {
  token: any;
  oldPassword: string;
  newPassword: string;
}
export const changePasword = async ({
  token,
  newPassword,
  oldPassword,
}: changePasswordParams) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return {
      data: "Invalid token",
      statusCode: 400,
    };
  }

  const findUser = await userModel.findById(tokenDetails.id);
  if (!findUser) {
    return { data: "User not found", statusCode: 400 };
  }

  const passwordMatch = await bcrypt.compare(oldPassword, findUser.password);
  if (!passwordMatch) {
    return { data: " Incorrect password !", statusCode: 400 };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  findUser.password = hashedPassword;
  await findUser.save();
  return { data: "password updated", statusCode: 200 };
};

export const deleteAccount = async ({ token }: any) => {
  const tokenDetails = verifyJWT(token);
  if (!tokenDetails) {
    return {
      data: "Invalid token",
      statusCode: 400,
    };
  }

  const findUser = await userModel.findById(tokenDetails.id);
  if (!findUser) {
    return { data: "user not found", statusCode: 400 };
  }
  // حذف البيانات المرتبطة بالمستخدم
  await summaryModel.deleteMany({ userId: findUser._id });
  await experienceModel.deleteMany({ userId: findUser._id });

  await requestModel.deleteMany({
    $or: [{ patientId: findUser._id }, { doctorId: findUser._id }],
  });

  await appointmentModel.deleteMany({
    $or: [{ userId: findUser._id }],
  });

  await bookingModel.deleteMany({
    $or: [{ userId: findUser._id }, { doctorId: findUser._id }],
  });
  // حذف المستخدم نفسه
  const deleteUser = await userModel.findByIdAndDelete(findUser._id);
  return { data: { id: deleteUser?._id }, statusCode: 200 };
};
export const verifyEmail = async ({ token }: any) => {
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await userModel.findById(decoded.userId);

    if (!user) {
      return { data: "User not found", statusCode: 400 };
    }

    user.isEmailVerified = true;

    await user.save();

    return { data: "Email verified successfully", statusCode: 200 };
  } catch (error) {
    return { data: "Invalid or expired token", statusCode: 400 };
  }
};
//-------------------------------------------------------------------------------

export const getPersonalUsers = async () => {
  const personalUsers = await userModel.find({
    accountType: "personal",
  });
  if (!personalUsers) {
    return { data: "users not found", statusCode: 400 };
  }
  return { data: personalUsers, statusCode: 200 };
};

export const getImpersonalUsers = async () => {
  const impersonalUsers = await userModel.find({
    accountType: { $ne: "personal" },
  });
  if (!impersonalUsers) {
    return { data: "users not found", statusCode: 400 };
  }
  return { data: impersonalUsers, statusCode: 200 };
};


