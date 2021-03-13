module ProtoBoglExplorer (protoBoglExplorer) where

import Data.Aeson()
import PGE_Server
import System.Directory
import FormalConceptAnalysis
import Bogl_Specifics
import Data.Aeson
import Data.Text (Text,pack,unpack)
import qualified Data.Vector as Vect
import qualified Data.HashMap.Strict as HM

--getBGLFileFromDir :: String -> String -> (String,IO String)

getFileFromDir :: String -> String -> String -> IO (String, String)
getFileFromDir ext dir s = do
  content <- readFile $ dir ++ s ++ ext
  return (s,content)

tail4 :: [a] -> [a]
tail4 = tail . tail . tail . tail

getAllBGLFilesFromDir :: String -> IO [(String, String)]
getAllBGLFilesFromDir dir = do
  files <- listDirectory dir
  let f2 = map (\x -> reverse $ tail4 $ reverse x) (filter (filterFile . reverse) files)
  bgls <- mapM (\x -> getFileFromDir ".bgl" dir x) f2
  return bgls
  where
    filterFile :: String -> Bool
    filterFile ('l':'g':'b':'.':_) = True
    filterFile _ = False


protoBoglExplorer :: APIType
protoBoglExplorer kProg gProg = do
  let dir = "db/"
  --let dir = "/Users/Bfriedman/OSU/Research/ConceptGraph/db_programs/"
  --let dir160 = "/Users/Bfriedman/Downloads/CS160-BoGL-section/assignment_9_tictactoe/"
  --let dir160 = "/Users/Bfriedman/Downloads/CS160-BoGL-section/assignment_8_nim_board/"
  --let dir160 = "/Users/Bfriedman/Downloads/CS160-BoGL-section/sub_8/"

  let getSimpleBGLFile = getFileFromDir ".bgl" (dir ++ "simple/")
  let getGameBGLFile = getFileFromDir ".bgl" (dir ++ "games/")

  bglFiles1 <- getAllBGLFilesFromDir (dir ++ "simple/")
  bglFiles2 <- getAllBGLFilesFromDir (dir ++ "games/")
  let bglFiles'= bglFiles1 ++ bglFiles2
  let bglFiles = rightProgs $ parseBOGLPrograms $ bglFiles'

  let kn = parseBOGLPrograms [("Known",kProg)]
  let known = rightProgs kn
  -- k1,k2,k3,k4,k5,k6,k7 has empty classification!

  --g1 <- getSimpleBGLFile "V_LetAddSub"
  --g2 <- getGameBGLFile "tictactoe"
  let gn = parseBOGLPrograms [("Goal",gProg)]
  let goal = rightProgs gn

  let extraProgs    = []
  let extraAttribs  = []

  (dotContent,nextProgs) <- fca (FCA
        boglConceptMapping
        known
        goal
        bglFiles
        extraProgs
        extraAttribs)

  let npNames = map fst nextProgs
  let nps' = filter (\(a,b) -> elem a (map fst nextProgs)) bglFiles'
  let nps2 = map (\(a,b) -> (a,b,case lookup a nextProgs of
                                    Just attrs -> attrs
                                    Nothing    -> [])) nps'
  let npsf = map (\(a,b,c) -> (pack a, Object $ HM.fromList [(pack "code",String $ pack b),(pack "attrs", Array $ Vect.fromList (map (String . pack) c))])) nps2

  let lpk = leftProgs kn
  return $ case length lpk of
    0 -> Object $ HM.fromList $ (pack "content", String $ pack dotContent) : npsf
    _ -> Object $ HM.fromList [(pack "error", String $ pack $ show $ snd $ head lpk)]
