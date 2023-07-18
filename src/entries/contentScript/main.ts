import { setUpLdrizeEventListener } from "./keyboard";
import { dispatch } from "./store";
import {
  candidateSelector,
  ldrizeSlice,
  startedSelector,
} from "./store/ldrize";

const getLinkFromItem = (item: Element): string | undefined => {
  return item.querySelector<HTMLAnchorElement>("div > a")?.href;
};

const createCandidates = (items: Array<Element>) => {
  return items.map((item) => {
    const link = getLinkFromItem(item) as string;
    const element = item as HTMLElement;
    const candidate = candidateSelector(link);
    const isSelected = candidate?.isSelected ?? false;
    const isPinned = candidate?.isPinned ?? false;

    return { element, link, isSelected, isPinned };
  });
};

const getItems = () => {
  return [...document.querySelectorAll("div.g")].filter(
    (item) =>
      item.classList.contains("g") &&
      item.className.startsWith("g") &&
      item.getBoundingClientRect().height > 0
  );
};

const updateItems = (items: Array<Element>) => {
  const candidates = createCandidates(items);
  dispatch(ldrizeSlice.actions.updateCandidates({ candidates }));
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      const items = getItems();
      if (items.length > 0) {
        if (startedSelector() === false) {
          dispatch(ldrizeSlice.actions.start());
          setUpLdrizeEventListener();
        }
        updateItems(items);
      }
    }
  });
});

const main = () => {
  observer.observe(document.body, { childList: true, subtree: true });

  const items = getItems();
  if (items.length > 0) {
    updateItems(items);
    dispatch(ldrizeSlice.actions.select({ index: 0 }));
  }
};

main();
