import express from 'express';
import {PrismaClient, type User} from "@prisma/client";
import authenticate from "../authenticate.ts";
import {fetchUser} from "../db/repository.ts";

const router = express.Router();
type Target = {
  id: number,
  name: string,
  photoHRef: string
}

router.get('/', authenticate.verifyUser, async (req, res) => {

  const userId = (req.user as User).id

  try {
    const dbUser: User = await fetchUser(userId)
    const targetList = dbUser.targets
    if (targetList && targetList.length != 0) {
      let typedTargets: Target[] = []
      for(let curTarget in targetList) {
        // @ts-ignore
        let targetUser = await fetchUser(curTarget)
        let typedCurTarget: Target = {id: targetUser.id, name: targetUser.name, photoHRef: "todo"}
        typedTargets.push(typedCurTarget)
      }
      res.status(200).json({ id: (req.user as User).id, targets: typedTargets }).end()
    } else {
      res.status(404).json({ message: "User has no targets"})
    }
  } catch(err) {
    console.log(err)
    res.status(500).json({ message: "Something went wrong when fetching the users targets"})
  }
})

export default router

