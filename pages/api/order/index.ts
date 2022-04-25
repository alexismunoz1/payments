import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { createPreference } from "lib/mercadopago";
import { Order } from "lib/models/order";
import method from "micro-method-router";

const products = {
   1236: {
      title: "Mate de apx",
      description: "Descripcion del mate",
      price: 700,
   },
};

async function postHandler(req: NextApiRequest, res: NextApiResponse, token) {
   const { productId } = req.query as any;
   const product = products[productId];

   if (!product) {
      res.status(404).json({ messsage: "Product not found" });
      return;
   }

   const order = await Order.createNewOrder({
      aditionalInfo: req.body, //datos adicionales de la compra
      productId, // que compara
      userId: token.userId, // quien compra
      status: "pending", // estado de la compra
   });

   const pref = await createPreference({
      external_reference: order.id,
      items: [
         {
            title: product.title,
            description: "Dummy description",
            picture_url: "http://www.myapp.com/myimage.jpg",
            category_id: "car_electronics123",
            quantity: 1,
            currency_id: "ARS",
            unit_price: product.price,
         },
      ],
      notification_url:
         "https://payments-am3puqw45-alexismunoz1.vercel.app/api/webhooks/mercadopago",
      back_urls: {
         success: "http://apx.school",
      },
   });

   res.send({
      url: pref.init_point,
   });
}

const handler = method({
   post: postHandler,
});

export default authMiddleware(postHandler);
