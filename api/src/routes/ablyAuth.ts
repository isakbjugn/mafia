import cors from "../cors";
import express from "express";
import Ably, {Types} from "ably";



const router = express.Router();
const ablyRestClient = new Ably.Rest({key: "fyllInn"})

router.route('/')
  .options(cors.corsWithSpecifiedOriginAndCredentials, (req, res) => {
    res.sendStatus(204);
  })
  .get(cors.corsWithSpecifiedOriginAndCredentials, //authenticate.verifyUser,
    async (req, res) => {

    const tokenParams: Types.TokenParams = {
      capability: { "*": ["publish", "subscribe"] },
      clientId: "TODO"//req.user.id.toString()
    }

    const callbackFunction = (err: Types.ErrorInfo, tokenRequest: Types.TokenRequest) => {
      if(err) {
        console.error("Could not generate tokenRequest for client: ", err.message)
        res.status(500).end()
        return
      }

      res.status(200).json(tokenRequest).end()
    }

    ablyRestClient.auth.createTokenRequest(tokenParams, callbackFunction)
  })

export default router