import { cache } from "react";
import { PronunciationFile } from "@/data/schema";
import raw from "@/data/json/pronunciation.json";

export const getPronunciation = cache(() => PronunciationFile.parse(raw));
