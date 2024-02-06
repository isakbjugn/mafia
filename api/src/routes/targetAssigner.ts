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
  tmp.push(tmp.shift()!)
  const tmp2 = shuffle(userIds, tmp[tmp.length-1], 1)
  const loops =
    [
      tmp,
      tmp2,
      shuffle(userIds, tmp2[tmp2.length-1], 2)
    ]

  while(!validateArray(loops[0], loops[1], loops[2])) { // bruteforce all the way :D
    // shuffler bare 2 og 3 siden de er de eneste som er random
    loops[1] = shuffle(userIds, loops[0][loops[0].length-1], 1)
    loops[2] = shuffle(userIds, loops[1][loops[1].length-1], 2)
  }

  const userMap: TargetMap  = {}
  userIds.map((id: number, index: number) => {
    userMap[id] = [loops[0][index], loops[1][index], loops[2][index]]
  })
  return userMap
}

const shuffle = (array: number[], lastInPrev: number, arrNum: number) => {
  const resultArray: number[] = [...array]
  let currentIndex = array.length,  randomIndex;

  //For å beholde loopen setter vi første til å være siste i forrige array
  swap(resultArray, 0, lastInPrev)

  // While there remain elements to shuffle.
  while (currentIndex > 1) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [resultArray[currentIndex], resultArray[randomIndex]] = [
      resultArray[randomIndex], resultArray[currentIndex]];
  }
  if(arrNum === 2) {
    swap(resultArray, resultArray.length - 1, 2)
  }
  return resultArray;
}

const swap = (array: number[], indexToPlace:number, element: number) => {
  const tmpI = array.indexOf(element)
  const tmp = array[tmpI]
  array[tmpI] = array[indexToPlace]
  array[indexToPlace] = tmp
}

const validateArray = (arr1: number[], arr2: number[], arr3: number[]) => {
  let result = true
  if(arr1.length !== arr2.length || arr1.length !== arr3.length || arr2.length !== arr3.length) {
    console.log("Feil lengde på arrays")
    return false
  }
  arr1.forEach((val, i: number) => {
    if(val === arr2[i] || val === arr3[i] || arr2[i] === arr3[i]) { //sjekker om samme person har flere av samme mål
      result = false
      console.log("Samme person har flere av samme mål")
    }
    if (val === i+1 || arr2[i] === i+1 || arr3[i] === i+1    //sjekker om de har fått seg selv som mål
    ) {                                                     // å verifisere val === i-1 er bare sanity check
      result = false
      console.log("Person har seg selv som mål")
    }
    if(i !== 0) {
      if (arr2[arr2[i] - 1] === i + 1 || arr3[arr3[i] - 1] === i+1) { //sjekker etter umiddelbare loops
        result = false
      }
    }
  })
  return result
}

export default router