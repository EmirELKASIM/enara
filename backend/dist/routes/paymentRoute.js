"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const iyzipay_1 = __importDefault(require("iyzipay"));
const router = express_1.default.Router();
const iyzipay = new iyzipay_1.default({
    apiKey: process.env.IYZIPAY_APIKEY || "",
    secretKey: process.env.IYZIPAY_SECRETKEY || "",
    uri: "https://sandbox-api.iyzipay.com",
});
router.post("/callback-handler", (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(400).send("Token not found");
    }
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
    res.redirect(`${frontendUrl}/call-back?token=${token}`);
});
router.post("/verify-payment", (req, res) => {
    const { token } = req.body;
    iyzipay.checkoutForm.retrieve({
        locale: iyzipay_1.default.LOCALE.TR,
        token: token,
    }, function (err, result) {
        if (err)
            return res.status(500).send(err);
        if (result.paymentStatus === "SUCCESS") {
            return res.json({ status: "success" });
        }
        else {
            return res.json({ status: "failed" });
        }
    });
});
router.post("/create-payment", (req, res) => {
    const { name, surname, email, gsmNumber, address, city, country, } = req.body;
    const request = {
        locale: iyzipay_1.default.LOCALE.TR,
        conversationId: Date.now().toString(),
        price: "10.0",
        paidPrice: "10.5",
        currency: "TRY",
        basketId: "B67832",
        paymentGroup: "PRODUCT",
        callbackUrl: `${process.env.BACKEND_URL}/payment/callback-handler`,
        buyer: {
            id: "BY" + Date.now(),
            name,
            surname,
            email,
            gsmNumber,
            identityNumber: "12345678901",
            registrationAddress: address,
            ip: "85.34.78.112",
            city,
            country,
        },
        shippingAddress: {
            contactName: `${name} ${surname}`,
            city,
            country,
            address,
            zipCode: "34000",
        },
        billingAddress: {
            contactName: `${name} ${surname}`,
            city,
            country,
            address,
            zipCode: "34000",
        },
        basketItems: [
            {
                id: "BI101",
                name: "Test Product",
                category1: "Test Category",
                itemType: "PHYSICAL",
                price: "10.0",
            },
        ],
    };
    iyzipay.checkoutFormInitialize.create(request, function (err, result) {
        if (err)
            return res.status(500).send(err);
        res.json({ checkoutFormContent: result.checkoutFormContent });
    });
});
exports.default = router;
//# sourceMappingURL=paymentRoute.js.map