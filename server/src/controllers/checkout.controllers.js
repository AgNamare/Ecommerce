import { initiateCheckout } from "../services/checkout.services.js";

export const initiateCheckoutHandler = async(req, res, next) => {
  try {
    const orderSummary = await initiateCheckout(req.body);
    console.log(orderSummary);
    res.status(200).json(orderSummary);
  } catch (error) {
    next(error);
  }
};
