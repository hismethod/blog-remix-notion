export const findTitleKey = (properties: Record<string, any>) => {
  if (properties != null) {
    for (const key in properties) {
      if (properties[key].id === "title") {
        return key;
      }
    }
  }
  return "이름";
};

export const getSlugKey = () => "slug";
