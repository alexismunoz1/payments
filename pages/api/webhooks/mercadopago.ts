import type { NextApiRequest, NextApiResponse } from "next";
import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "lib/models/order";

export default async function (req: NextApiRequest, res: NextApiResponse) {
   const { id, topic } = req.query;

   if (topic == "merchant_order") {
      const order = await getMerchantOrder(id);
      if (order.order_status == "paid") {
         const orderId = order.external_reference;
         //es para nosotros dentro de la Api el orderId es el id de la orden
         //entonces ahi podemos ir a la db de firebase y buscar el orderID
         //que deveria tener asociado el userId
         //entonces ese userId es quien realizo a compra y quien realizo la orden
         // se la manda el mail al usar y se cambia el estado de la order a
         // "esto ya esta pago"
         const myOrder = new Order(orderId);
         myOrder.pull();
         myOrder.data.status = "closed";
         await myOrder.push();

         //sendEmail("Tu pago fue aceptado");
         //sendEmailInterno("Alguien compro un producto");
      }
   }
   res.send("ok");
}
