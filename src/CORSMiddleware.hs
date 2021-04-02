{-# LANGUAGE OverloadedStrings #-}
{-|
Module      : API.CORSMiddleware
Description : CORS Middleware for the Spiel Server API
Copyright   : (c)
License     : BSD-3

Based on @https://stackoverflow.com/questions/41399055/haskell-yesod-cors-problems-with-browsers-options-requests-when-doing-post-req
Enables CORS requests to be made to this server by accepting all origins

-}

module CORSMiddleware where

import Network.Wai                       (Middleware)
import Network.Wai.Middleware.AddHeaders (addHeaders)
import Network.Wai.Middleware.Cors       (CorsResourcePolicy(..), cors)

-- | CORS middleware configured with 'appCorsResourcePolicy'.
corsified :: Middleware
corsified = cors (const $ Just appCorsResourcePolicy)

extraHeaders :: Middleware
-- no extra headers at the moment...but here if needed
extraHeaders = addHeaders []

-- | Cors resource policy to be used with 'corsified' middleware.
appCorsResourcePolicy :: CorsResourcePolicy
appCorsResourcePolicy = CorsResourcePolicy {
    corsOrigins        = Just (["null","http://localhost:3000","http://bogl.research.uphouseworks.com","https://bogl.research.uphouseworks.com"], False)
  , corsMethods        = ["OPTIONS", "GET", "POST"]
  , corsRequestHeaders = ["Content-Type", "Allow", "X-PGE-Key"]
  , corsExposedHeaders = Nothing
  , corsMaxAge         = Nothing -- Just 7200 = cache preflight requests for 2 hours (helpful for deployment)
  , corsVaryOrigin     = True
  , corsRequireOrigin  = True
  , corsIgnoreFailures = False
}
