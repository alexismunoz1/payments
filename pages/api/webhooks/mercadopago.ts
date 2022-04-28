import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";

export default async function (req: NextApiRequest, res: NextApiResponse) {
   const { id, topic } = req.query;

   if (topic == "merchant_order") {
      const order = await getMerchantOrder(id);
      if (order.order_status == "paid") {
         const orderId = order.external_reference;
         const myOrder = new Order(orderId);
         await myOrder.pull();
         myOrder.data.status = "closed";
         await myOrder.push();

         //sendEmail("Tu pago fue aceptado");
         //sendEmailInterno("Alguien compro un producto");
      }
   }
   res.send("ok");
}
