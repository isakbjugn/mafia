import express from "express";
import cors from "../cors.ts";
import authenticate from "../authenticate.ts";
import { prisma } from "../db/repository.ts";


const router = express.Router();

router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(204);
  })
  .post(cors.corsWithSpecifiedOriginAndCredentials, authenticate.verifyUser, async (req, res) => {
    if(!req.user!.admin) {
      res.status(403).json({message: "User is not an admin"}).end()
    }
    const allUsers: number[] = prisma.user.allUserIds()
    const assignedTargets = assignTargets(allUsers)
    await prisma.user.assignTargets(assignedTargets, allUsers)
    res.status(204).end()
  })


export type TargetMap = {
  [key: number]: number[]
}

export const assignTargets = (userIds: number[]) => {
  // Forskyver første løkke sånn at man ikke får seg selv som mål
  const tmp = [...userIds]
  const first = tmp.shift()!
  const loops = [[...tmp, first], shuffle(userIds), shuffle(userIds)]

  while(!validateArray(loops[0], loops[1], loops[3])) { // bruteforce all the way :D
    // shuffler bare 2 og 3 siden de er de eneste som er random
    loops[1] = shuffle(userIds)
    loops[2] = shuffle(userIds)
  }

  const userMap: TargetMap  = {}
  userIds.map((id: number, index: number) => {
    userMap[id] = [loops[0][index], loops[1][index], loops[3][index]]
  })
  return userMap
}

const shuffle = (array: number[]) => { // fra stack overflow så du veit den er bra UwU
  const resultArray: number[] = [...array]
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [resultArray[currentIndex], resultArray[randomIndex]] = [
      resultArray[randomIndex], resultArray[currentIndex]];
  }

  return resultArray;
}

const validateArray = (arr1: number[], arr2: number[], arr3: number[]) => {
  let result = true
  arr1.forEach((val, i: number) => {
    if(val === arr2[i] || val === arr3[i] || arr2[i] === arr3[i] //sjekker om samme person har flere av samme mål
      || val === i+1 || arr2[i] === i+1 || arr3[i] === i+1    //sjekker om de har fått seg selv som mål
    ) {                                                     // å verifisere val === i-1 er bare sanity check
      result = false
    }
  })
  return result
}