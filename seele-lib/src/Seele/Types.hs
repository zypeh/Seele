{-# LANGUAGE DataKinds #-}
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE GeneralizedNewtypeDeriving #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TypeOperators #-}

module Seele.Types where

import Data.Aeson
import Import
import Servant.API

type SeeleAPI = UsersAPI

-- Service API
type UsersAPI =
    -- user test
    "api" :> "users" :> "troll" :> ReqBody '[JSON] LoginReq :> Post '[JSON] AuthToken
    :<|>
    -- signin
    "api" :> "users" :> "signin" :> ReqBody '[JSON] LoginReq :> Post '[JSON] SigninToken
    :<|>
    -- signout
    "api" :> "users" :> Authorized ("signout" :> Post '[JSON] ())

newtype SigninToken =
    SigninToken Text
    deriving (ToJSON, FromJSON, FromHttpApiData, ToHttpApiData, Ord, Eq)

data AuthToken = AuthToken {
    token :: String
    } deriving (Generic)

instance ToJSON AuthToken

data LoginReq = LoginReq {
    userid :: Text
  , password :: Text
} deriving (Generic)

instance FromJSON LoginReq
instance ToJSON LoginReq

-- Common prefixes and headers
type Authorized t = Header "Authorization" SigninToken :> t