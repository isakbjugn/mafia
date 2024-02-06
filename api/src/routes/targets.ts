import express from 'express';
import authenticate from "../authenticate";
import { fetchUser, prisma } from "../db/repository";
import cors from "../cors";

const router = express.Router();

type Target = {
  id: number,
  name: string,
  photoHref: string
}

router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(204);
  })
  .get(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, async (req, res) => {
    try {
      const targetList = await prisma.user.getTargets(req.user!.id)
      if (targetList && targetList.length != 0) {
        const targetsWithInfo = await Promise.all(targetList.map(async (targetId: number): Promise<Target> => {
          const targetUser = await fetchUser(targetId);
          return { id: targetUser.id, name: targetUser.name, photoHref: "https://ca.slack-edge.com/EN04X3213-WNTCPN1L0-fe5e15863394-512"} // TODO
        }));
        res.status(200).json({ targets: targetsWithInfo }).end()
      } else {
        res.status(404).json({ message: "User has no targets"})
      }
    } catch(err) {
      console.log(err)
      res.status(500).json({ message: "Something went wrong when fetching the users targets"})
    }
  })

export default router

