import express from 'express';
import authenticate from "../authenticate.ts";
import { fetchUser, prisma } from "../db/repository.ts";
import cors from "../cors.ts";

const router = express.Router();

type Target = {
  id: number,
  name: string,
  photoHref: string
}

router.route('/')
  .get(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, async (req, res) => {
    try {
      const targetList = prisma.user.getTargets(req.user!.id)
      if (targetList && targetList.length != 0) {
        const targetsWithInfo = targetList.map(async (targetId: number): Promise<Target> => {
          const targetUser = await fetchUser(targetId);
          return { id: targetUser.id, name: targetUser.name, photoHref: "todo"}
        });
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

