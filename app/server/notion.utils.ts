import { TitlePropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export const findTitleKey = (properties: Record<string, TitlePropertyItemObjectResponse>) => {
  if(properties != null) { 
    for (const key in properties) {
      if (properties[key].id === "title") {
        return key;
      }
    }
  }
  return "이름";
}