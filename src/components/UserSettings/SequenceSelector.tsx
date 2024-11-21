import { useSelect } from "downshift";
import { Sequence } from "@/types";
import down from "@/assets/caret-down.svg";
import up from "@/assets/caret-up.svg";
import "./Select.css";

type SequenceSelectorProps = {
  sequences: Sequence[];
  setSequence: (seq: Sequence) => void;
};

export function SequenceSelector({
  sequences,
  setSequence,
}: SequenceSelectorProps) {
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: sequences,
    onSelectedItemChange({ selectedItem }) {
      setSequence(selectedItem);
      console.log(selectedItem);
    },
    defaultSelectedItem: sequences[0],
    itemToString(item) {
      return item && item.name ? item.name : "";
    },
  });
  return (
    <div className="selector">
      <div id="select-sequence">
        <label {...getLabelProps()} />
        <div className="select-container" {...getToggleButtonProps()}>
          <span>{selectedItem ? selectedItem.name : "Choose sequence..."}</span>
          <img className="toggle" src={isOpen ? up : down} />
        </div>
      </div>
      <ul
        id="sequence-select-list"
        className={
          !(isOpen && sequences.length)
            ? "user-select-list-hidden"
            : "user-select-list"
        }
        {...getMenuProps()}
      >
        {isOpen &&
          sequences.map((item, index) => (
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
