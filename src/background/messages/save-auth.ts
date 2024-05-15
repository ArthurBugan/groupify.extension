import type { PlasmoMessaging } from "@plasmohq/messaging"

import { Storage } from "@plasmohq/storage"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const storage = new Storage();

  const channelsStorage = new Storage({
    area: "local"
  });

  let channels = await channelsStorage.get("channels");

  try {
    const { token, uid, refreshToken } = req.body
    await storage.set("authorization", token);

    res.send({
      status: channels
    })
  } catch (err) {
    console.log("There was an error")
    console.error(err)
    res.send({ err })
  }
}

export default handler