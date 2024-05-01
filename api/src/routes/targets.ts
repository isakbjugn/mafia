import express from 'express';
import authenticate from "../authenticate";
import { fetchUser, prisma } from "../db/repository";
import cors from "../cors";

const router = express.Router();

type Target = {
  id: string,
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
        const targetsWithInfo = await Promise.all(targetList
          .filter((targetId: string) => targetId !== '')
          .map(async (targetId: string): Promise<Target> => {
          const targetUser = await fetchUser(targetId);
          return { id: targetUser.id, name: targetUser.name, photoHref: targetUser.photoHref }
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

