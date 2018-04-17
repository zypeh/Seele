{-# LANGUAGE OverloadedStrings #-}

-- Reverse proxying HTTP requests
module Main where

import Control.Exception         (SomeException)
import Network.HTTP.ReverseProxy
import Network.HTTP.Client       (Manager, newManager, defaultManagerSettings)
import Network.HTTP.Types        (status404, status500)
import Network.Wai
import Network.Wai.Handler.Warp

app :: Manager -> Application
app = waiProxyTo forwardRequest onException

-- Inspects the request, and then gets to decide what to do with it.
forwardRequest :: Request -> IO WaiProxyResponse
forwardRequest incomingReq = case pathInfo incomingReq of
    -- seele-user
    ("auth" : _) -> pure (WPRProxyDest $ ProxyDest "127.0.0.1" 8082)
    -- seele-monolith
    ("g": _)     -> pure (WPRProxyDest $ ProxyDest "127.0.0.1" 8083)
    ("giql" : _) -> pure (WPRProxyDest $ ProxyDest "127.0.0.1" 8083)
    -- 404 NOT FOUND
    _ -> pure (WPRResponse (responseLBS status404 [] "¯\\_(ツ)_/¯ API not found. \n"))

-- Error handling
onException :: SomeException -> Application
onException exc _ sendResponse = sendResponse $ responseLBS
    status500
    [("content-type", "text/plain")]
    "Internal Service Error"

main :: IO ()
main = do
    manager <- newManager defaultManagerSettings
    run 8081 (app manager)