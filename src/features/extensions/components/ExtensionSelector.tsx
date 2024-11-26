import { useRef, useState, useLayoutEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCombobox } from "downshift";

import { Program } from "@/types/index";
import down from "@/assets/caret-down.svg";
import up from "@/assets/caret-up.svg";

type ExtensionSelectorProps = {
  extensionList: Program[];
  setSelectedExtension: (extension: Program | null) => void;
  closeModal: () => void;
};

export function ExtensionSelector({
  extensionList,
  setSelectedExtension,
  closeModal,
}: ExtensionSelectorProps) {
  function filterExtensions(input: string) {
    const lowerInput = input.toLowerCase();
    return function extensionFilter(extension: Program) {
      const extensionString = extension.name.toLowerCase();
      return !lowerInput || extensionString.includes(lowerInput);
    };
  }

  const [items, setItems] = useState<Program[]>(extensionList);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onSelectedItemChange({ selectedItem }) {
      setSelectedExtension(selectedItem);
      closeModal();
    },
    onInputValueChange({ inputValue }) {
      setItems(extensionList.filter(filterExtensions(inputValue)));
    },
    items,
    itemToString(item) {
      return item ? item.name : "";
    },
  });
  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () =>
      Math.max(
        window.innerWidth * 2,
        Math.min(window.innerHeight * 6, window.innerWidth * 3)
      ) / 100,
    overscan: 5,
  });

  const estimatedSize = rowVirtualizer.getVirtualItems()[0]
    ? rowVirtualizer.getVirtualItems()[0].size
    : 35;

  useLayoutEffect(() => {
    rowVirtualizer?.measure?.();
  }, [rowVirtualizer, estimatedSize]);

  return (
    <div className="item-container">
      <label {...getLabelProps()} />
      <div className="input-container">
        <input
          className="item-input"
          placeholder="Add Extension..."
          {...getInputProps({ type: "text" })}
        />
        <button
          aria-label="toggle menu"
          className="select-button"
          type="button"
          {...getToggleButtonProps()}
        >
          <img className="select-icon" src={isOpen ? up : down} />
        </button>
      </div>
      <ul
        className={!(isOpen && items.length) ? "item-list-hidden" : "item-list"}
        {...getMenuProps({ ref: parentRef })}
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {isOpen &&
            rowVirtualizer.getVirtualItems().map((virtualRow) => (
              <li
                className={
                  highlightedIndex === virtualRow.index
                    ? "highlighted-item"
                    : "item"
                }
                key={items[virtualRow.index].id}
                {...getItemProps({
                  index: virtualRow.index,
                  item: items[virtualRow.index],
                  style: {
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  },
                })}
              >
                {`${items[virtualRow.index].name}`}
              </li>
            ))}
        </div>
      </ul>
    </div>
  );
}
