import { setUpLdrizeEventListener } from "./keyboard";
import { dispatch } from "./store";
import {
  candidateSelector,
  ldrizeSlice,
  startedSelector,
} from "./store/ldrize";

const INTERVAL = 100;

const createCandidates = (items: Element[]): any[] =>
  items.map((item) => {
    const link = item
      .getElementsByTagName("div")?.[0]
      ?.getElementsByTagName("a")?.[0]?.href;

    const element = item as HTMLElement;
    const candidate = candidateSelector(link);
    const isSelected = candidate?.isSelected ?? false;
    const isPinned = candidate?.isPinned ?? false;

    return { element, link, isSelected, isPinned };
  });

const getItems = () =>
  [...document.querySelectorAll("div.g")].filter((item) => {
    return (
      item.classList.contains("g") &&
      item.className.startsWith("g") &&
      item.className.length >= 2
    );
  });

const main = () => {
  setInterval(() => {
    const items = getItems();
    if (items.length === 0) {
      return;
    } else if (startedSelector() === false) {
      dispatch(ldrizeSlice.actions.start());
      setUpLdrizeEventListener();
    } else {
      const candidates = createCandidates(items);
      dispatch(ldrizeSlice.actions.updateCandidates({ candidates }));
    }
  }, INTERVAL);

  const items = getItems();
  const candidates = createCandidates(items);

  dispatch(ldrizeSlice.actions.updateCandidates({ candidates }));
  dispatch(ldrizeSlice.actions.select({ index: 0 }));
};

main();
