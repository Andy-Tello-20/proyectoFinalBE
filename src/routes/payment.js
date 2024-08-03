import { Router } from "express";

import { authRolesMiddleware } from "../helpers/jwt.js";
import Stripe from "stripe"
const stripe = Stripe("sk_test_51PddhERu5oi1L0NT44lXe3E3K0T8rJJzDdww0VFVg1LWyOo73BlymCcER7PII2KFpiSsgxS9tFGlcqOLp0iAy0ki00IeitZzdt")


const router = Router()



router.post("/create-payment-intent", async (req, res) => {

    let {importe} = req.body
 
    const paymentIntent = await stripe.paymentIntents.create({
        amount: importe,
        currency: "usd",
     
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.send({
        clientSecret: paymentIntent.client_secret,
    });

})

export default router;