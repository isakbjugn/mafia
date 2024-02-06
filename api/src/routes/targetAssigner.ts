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
    const allUsers: number[] = await prisma.user.allUserIds()
    const extractedIds: number[] = allUsers.map((v) => {
      return v.id // No typing for you
    })
    const assignedTargets = assignTargets(extractedIds)
    await prisma.user.assignTargets(assignedTargets, extractedIds)
    res.status(204).end()
  })


export type TargetMap = {
  [key: number]: number[]
}

export const assignTargets = (userIds: number[]) => {
  const tmp = [...userIds]
  // Forskyver første løkke sånn at man ikke får seg selv som mål
  //tmp.push(tmp.shift()!)
  const tmp2 = shuffle(userIds)
  const loops =
    [
      tmp,
      tmp2,
      shuffle(userIds)
    ]
  let userMap: TargetMap | undefined;
  while(!validateArray(userMap, userIds.length)) { // bruteforce all the way :D
    userMap = shuffleAndAssignTargets(loops, userIds)
  }


  return userMap
}



const shuffleAndAssignTargets = (loops: number[][], userIds: number[]) => {
  loops[1] = shuffle(userIds)
  loops[2] = shuffle(userIds)

  const userMap: TargetMap  = {}

  const assignTargetForAssassin = (loop: number[], loopNum: number, ind: number) => {
    const curAssassin = loop[ind]
    userMap[curAssassin][loopNum] = loop[(ind+1) % userIds.length]
  }

  userIds.map((id: number) => {
    userMap[id] = [-1, -1, -1]
  })
  userIds.map((id: number, index: number) => {
    assignTargetForAssassin(loops[0], 0, index)
    assignTargetForAssassin(loops[1], 1, index)
    assignTargetForAssassin(loops[2], 2, index)
  })
  return userMap
}

const shuffle = (array: number[]) => {
  const resultArray: number[] = [...array]
  let currentIndex = array.length,  randomIndex;

  //For å beholde loopen setter vi første til å være siste i forrige array
  //swap(resultArray, 0, lastInPrev)

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [resultArray[currentIndex], resultArray[randomIndex]] = [
      resultArray[randomIndex], resultArray[currentIndex]];
  }
  /*if(arrNum === 2) {
    swap(resultArray, resultArray.length - 1, 2)
  }*/
  return resultArray;
}

const swap = (array: number[], indexToPlace:number, element: number) => {
  const tmpI = array.indexOf(element)
  const tmp = array[tmpI]
  array[tmpI] = array[indexToPlace]
  array[indexToPlace] = tmp
}

const validateArray = (userMap: TargetMap | undefined, l: number) => {
  if (!userMap) {
    return false
  }

  let i = 1
  while (i <= l) {
    let curTargets = userMap[i]
    if(curTargets[0] === curTargets[1] || curTargets[0] === curTargets[2] || curTargets[1] === curTargets[2]) { //sjekker om samme person har flere av samme mål
      console.log("Samme person har flere av samme mål")
      return false
    }
    i = i +1;
  }
  return true
}

export default router