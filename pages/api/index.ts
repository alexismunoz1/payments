import type { NextApiRequest, NextApiResponse } from "next";
import { sendCode } from "lib/controller/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
   const auth = await sendCode(req.body.email);
   res.send(auth);
}
