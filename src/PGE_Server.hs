{-# LANGUAGE TemplateHaskell #-}
{-# LANGUAGE DataKinds       #-}
{-# LANGUAGE TypeOperators   #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE DeriveGeneric #-}

module PGE_Server (startServer,APIType) where

import Network.Wai
import Network.Wai.Handler.Warp
import Servant
import Data.Aeson
import Data.Text (Text,pack,unpack)
import GHC.Generics
import CORSMiddleware
import Network.Wai.Middleware.RequestLogger (logStdoutDev)

import qualified Data.HashMap.Strict as HM

type PGE_API = "api" :> ReqBody '[JSON] Value :> Post '[JSON] Value

type APIType = String -> String

api :: Proxy PGE_API
api = Proxy

apiErr :: Text -> Value
apiErr s = Object $ HM.fromList [("error",String s)]

apiResp :: [(Text,Text)] -> Value
apiResp xs = let remap = map (\(a,b) -> (a,String b)) xs in
             Object $ HM.fromList remap
  --Object $ HM.fromList [(k,String v)]

handler :: APIType -> Value -> Handler Value
handler f o@(Object hm) = case HM.lookup "prog" hm of
                            (Just (String prog)) -> return $ apiResp [("content",pack $ f $ unpack prog)]
                            _                    -> return $ apiErr "Bad program"
handler _ _           = return $ apiErr "Bad JSON provided"

serverApp :: APIType -> Application
serverApp f = logStdoutDev. extraHeaders . corsified $ serve api (handler f)

startServer :: APIType -> IO ()
startServer f = run 8181 (serverApp f)
