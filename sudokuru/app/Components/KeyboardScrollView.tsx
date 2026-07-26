import React, { useEffect, useRef } from "react";
import { Platform, ScrollView, ScrollViewProps } from "react-native";

const registeredNodes = new Set<Element>();
let listenerAttached = false;

function handleKeyDown(e: KeyboardEvent) {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
  if (e.defaultPrevented) return;

  for (const node of registeredNodes) {
    if (
      node &&
      node.scrollHeight > node.clientHeight &&
      node.clientHeight > 0
    ) {
      e.preventDefault();
      const amount = e.key === "ArrowDown" ? 50 : -50;
      node.scrollBy({ top: amount, behavior: "smooth" });
      return;
    }
  }
}

const KeyboardScrollView = React.forwardRef<ScrollView, ScrollViewProps>(
  (props, ref) => {
    const innerRef = useRef<ScrollView>(null);

    useEffect(() => {
      if (Platform.OS !== "web") return;

      const scrollView = innerRef.current;
      let node: Element | undefined;

      const timer = setTimeout(() => {
        node = (scrollView as any)?.getScrollableNode?.();
        if (node) {
          registeredNodes.add(node);
          if (!listenerAttached) {
            globalThis.addEventListener("keydown", handleKeyDown);
            listenerAttached = true;
          }
        }
      }, 0);

      return () => {
        clearTimeout(timer);
        if (node) {
          registeredNodes.delete(node);
        }
        if (registeredNodes.size === 0 && listenerAttached) {
          globalThis.removeEventListener("keydown", handleKeyDown);
          listenerAttached = false;
        }
      };
    }, []);

    return <ScrollView {...props} ref={innerRef} />;
  },
);

KeyboardScrollView.displayName = "KeyboardScrollView";

export default KeyboardScrollView;
