import { useState } from "react";
import { getParentData } from "../../i18n/parentDataDe";
import { useLanguage } from "../../i18n/useLanguage";

export function useActiveChild() {
  const { lang } = useLanguage();
  const data = getParentData(lang);
  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem("parent_active_child") || "ahmed";
  });

  const selectChild = (id) => {
    setActiveChildId(id);
    localStorage.setItem("parent_active_child", id);
  };

  const child =
    data.children.find((item) => item.id === activeChildId) ||
    data.children[0];

  return { activeChildId, child, selectChild, childrenList: data.children };
}
