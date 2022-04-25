import { firestore } from "../firestore";

const collection = firestore.collection("orders");
export class Order {
   ref: FirebaseFirestore.DocumentReference;
   data: FirebaseFirestore.DocumentData;
   id: string;

   constructor(id) {
      this.id = id;
      this.ref = collection.doc(id);
   }

   async pull() {
      const snap = await this.ref.get();
      this.data = snap.data();
   }

   async push() {
      await this.ref.update(this.data);
   }

   static async createNewOrder(newOrderData={}) {
      const newOrderSnap = await collection.add(newOrderData);
      const newOrder = new Order(newOrderSnap.id);
      newOrder.data = newOrderData;
      return newOrder;
   }
}