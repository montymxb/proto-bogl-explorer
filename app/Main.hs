module Main where

import ProtoBoglExplorer
import PGE_Server

main :: IO ()
main = startServer protoBoglExplorer
