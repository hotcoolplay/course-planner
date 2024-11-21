import { useState } from "react";
import { useCombobox } from "downshift";
import { Program } from "@/types";
import down from "@/assets/caret-down.svg";
import up from "@/assets/caret-up.svg";
import "./Combobox.css";

type ExtensionSelectorProps = {
  extensions: Program[];
  setExtension: (ext: Program) => void;
};

export function ExtensionSelector({
  extensions,
  setExtension,
}: ExtensionSelectorProps) {
  const [items, setItems] = useState<Program[]>(extensions);
  function filterExtensions(input: string) {
    const lowerInput = input.toLowerCase();
    return function extensionFilter(extension: Program) {
      const extensionString = extension.name.toLowerCase();
      return !lowerInput || extensionString.includes(lowerInput);
    };
  }
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    onInputValueChange({ inputValue }) {
      setItems(extensions.filter(filterExtensions(inputValue)));
    },
    items,
    onSelectedItemChange({ selectedItem }) {
      setExtension(selectedItem);
    },
    itemToString(item) {
      return item ? item.name : "";
    },
  });
  return (
    <div className="selector">
      <div id="select-extension">
        <label {...getLabelProps()} />
        <div className="combobox-container">
          <input
            className="combobox-input"
            placeholder="Choose extension..."
            {...getInputProps()}
          />
          <button
            aria-label="toggle menu"
            className="user-button"
            type="button"
            {...getToggleButtonProps()}
          >
            <img className="toggle" src={isOpen ? up : down} />
          </button>
        </div>
      </div>
      <ul
        className={
          !(isOpen && items.length)
            ? "user-combobox-list-hidden"
            : "user-combobox-list"
        }
        {...getMenuProps()}
      >
        {isOpen &&
          items.map((item, index) => (
            <li
              className={
                highlightedIndex === index
                  ? "user-highlighted-item"
                  : "user-item"
              }
              key={index}
              {...getItemProps({ item, index })}
            >
              {item.name}
            </li>
          ))}
      </ul>
    </div>
  );
}
