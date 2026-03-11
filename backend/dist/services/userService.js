"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImpersonalUsers = exports.getPersonalUsers = exports.verifyEmail = exports.deleteAccount = exports.changePasword = exports.resetPasword = exports.forgotPassword = exports.updateInfo = exports.getInfoWithId = exports.getInfo = exports.login = exports.register = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const helperJWT_1 = require("../middlewares/helperJWT");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sendEmail_1 = require("../utils/sendEmail");
const summaryModel_1 = __importDefault(require("../models/summaryModel"));
const experienceModel_1 = __importDefault(require("../models/experienceModel"));
const requestModel_1 = __importDefault(require("../models/requestModel"));
const appointmentModul_1 = __importDefault(require("../models/appointmentModul"));
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const register = async ({ firstName, lastName, email, password, accountType, birthday, gender, maritalStatus, consultation, privacyPolicy, phoneNumber, codeNumber, }) => {
    try {
        const findUser = await userModel_1.default.findOne({ email });
        if (findUser) {
            return { data: "User already exists!", statusCode: 400 };
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const calculateAge = (birthday) => {
            const birthDate = new Date(birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age < 0 ? 0 : age; // حماية من تاريخ مستقبلي
        };
        const age = calculateAge(birthday);
        const newUser = new userModel_1.default({
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
        setImmediate(async () => {
            console.log("2. Starting Email Call...");
            try {
                await (0, sendEmail_1.sendVerificationEmail)(newUser);
                console.log("Email sent successfully");
            }
            catch (err) {
                console.error("Email error:", err);
            }
            console.log("3. Email Call Finished");
        });
        return {
            data: (0, helperJWT_1.generateJWT)({
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
    }
    catch (error) {
        return { data: error.message, statusCode: 400 };
    }
};
exports.register = register;
const login = async ({ email, password }) => {
    const findUser = await userModel_1.default.findOne({ email });
    if (!findUser) {
        return { data: " Incorrect email !", statusCode: 400 };
    }
    const checkVerify = await userModel_1.default.findOne({
        email,
        isEmailVerified: true,
    });
    if (!checkVerify) {
        return { data: "should verify your email (check spam)", statusCode: 404 };
    }
    const passwordMatch = await bcrypt_1.default.compare(password, findUser.password);
    if (!passwordMatch) {
        return { data: " Incorrect password !", statusCode: 400 };
    }
    if (passwordMatch) {
        return {
            data: (0, helperJWT_1.generateJWT)({
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
exports.login = login;
const getInfo = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return {
            data: "Invalid token",
            statusCode: 400,
        };
    }
    const findUser = await userModel_1.default.findById(tokenDetails.id);
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
exports.getInfo = getInfo;
const getInfoWithId = async ({ userId }) => {
    const findUser = await userModel_1.default.findById(userId);
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
exports.getInfoWithId = getInfoWithId;
const updateInfo = async ({ id, firstName, lastName, gender, birthday, maritalStatus, phoneNumber, codeNumber, }) => {
    const findUser = await userModel_1.default.findById(id);
    if (!findUser) {
        return { data: "User not found", statusCode: 401 };
    }
    const calculateAge = (birthday) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
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
exports.updateInfo = updateInfo;
const forgotPassword = async ({ email }) => {
    const findUser = await userModel_1.default.findOne({ email });
    if (!findUser) {
        return { data: "User not found", statusCode: 401 };
    }
    const resetToken = jsonwebtoken_1.default.sign({ id: findUser._id }, process.env.JWT_SECRET || "", { expiresIn: "15m" });
    const resetLink = `http://localhost:4200/reset-password?token=${resetToken}`;
    await (0, sendEmail_1.sendEmail)(email, "Reset Password", `
    <h3>Password Reset</h3>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">${resetLink}</a>
    `);
    return { message: "Reset link sent to email", statusCode: 200 };
};
exports.forgotPassword = forgotPassword;
const resetPasword = async ({ token, newPassword, }) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        const findUser = await userModel_1.default.findById(decoded.id);
        if (!findUser) {
            return { message: "User not found", statusCode: 400 };
        }
        const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
        findUser.password = hashedPassword;
        await findUser.save();
        return { message: "Password updated successfully", statusCode: 200 };
    }
    catch (error) {
        console.error("RESET ERROR:", error);
        return { message: "Invalid or expired token", statusCode: 400 };
    }
};
exports.resetPasword = resetPasword;
const changePasword = async ({ token, newPassword, oldPassword, }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return {
            data: "Invalid token",
            statusCode: 400,
        };
    }
    const findUser = await userModel_1.default.findById(tokenDetails.id);
    if (!findUser) {
        return { data: "User not found", statusCode: 400 };
    }
    const passwordMatch = await bcrypt_1.default.compare(oldPassword, findUser.password);
    if (!passwordMatch) {
        return { data: " Incorrect password !", statusCode: 400 };
    }
    const hashedPassword = await bcrypt_1.default.hash(newPassword, 10);
    findUser.password = hashedPassword;
    await findUser.save();
    return { data: "password updated", statusCode: 200 };
};
exports.changePasword = changePasword;
const deleteAccount = async ({ token }) => {
    const tokenDetails = (0, helperJWT_1.verifyJWT)(token);
    if (!tokenDetails) {
        return {
            data: "Invalid token",
            statusCode: 400,
        };
    }
    const findUser = await userModel_1.default.findById(tokenDetails.id);
    if (!findUser) {
        return { data: "user not found", statusCode: 400 };
    }
    // حذف البيانات المرتبطة بالمستخدم
    await summaryModel_1.default.deleteMany({ userId: findUser._id });
    await experienceModel_1.default.deleteMany({ userId: findUser._id });
    await requestModel_1.default.deleteMany({
        $or: [{ patientId: findUser._id }, { doctorId: findUser._id }],
    });
    await appointmentModul_1.default.deleteMany({
        $or: [{ userId: findUser._id }],
    });
    await bookingModel_1.default.deleteMany({
        $or: [{ userId: findUser._id }, { doctorId: findUser._id }],
    });
    // حذف المستخدم نفسه
    const deleteUser = await userModel_1.default.findByIdAndDelete(findUser._id);
    return { data: { id: deleteUser?._id }, statusCode: 200 };
};
exports.deleteAccount = deleteAccount;
const verifyEmail = async ({ token }) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await userModel_1.default.findById(decoded.userId);
        if (!user) {
            return { data: "User not found", statusCode: 400 };
        }
        user.isEmailVerified = true;
        await user.save();
        return { data: "Email verified successfully", statusCode: 200 };
    }
    catch (error) {
        return { data: "Invalid or expired token", statusCode: 400 };
    }
};
exports.verifyEmail = verifyEmail;
//-------------------------------------------------------------------------------
const getPersonalUsers = async () => {
    const personalUsers = await userModel_1.default.find({
        accountType: "personal",
    });
    if (!personalUsers) {
        return { data: "users not found", statusCode: 400 };
    }
    return { data: personalUsers, statusCode: 200 };
};
exports.getPersonalUsers = getPersonalUsers;
const getImpersonalUsers = async () => {
    const impersonalUsers = await userModel_1.default.find({
        accountType: { $ne: "personal" },
    });
    if (!impersonalUsers) {
        return { data: "users not found", statusCode: 400 };
    }
    return { data: impersonalUsers, statusCode: 200 };
};
exports.getImpersonalUsers = getImpersonalUsers;
//# sourceMappingURL=userService.js.map