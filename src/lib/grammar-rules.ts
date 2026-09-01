import { cache } from "react";
import { GrammarFile } from "@/data/schema";
import raw from "@/data/json/grammar-rules.json";

export const getGrammarRules = cache(() => GrammarFile.parse(raw));

export function grammarPointsStored(): number {
  return getGrammarRules().points.length;
}

export function grammarComplete(): boolean {
  const file = getGrammarRules();
  return file.points.length === file.pointsExpected;
}

export function parseReadyAffixes() {
  return getGrammarRules().affixes.filter((affix) => affix.parseReady);
}

export function parseReadyCount(): number {
  return parseReadyAffixes().length;
}
