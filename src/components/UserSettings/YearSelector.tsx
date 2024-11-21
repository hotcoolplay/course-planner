import { useSelect } from "downshift";
import down from "@/assets/caret-down.svg";
import up from "@/assets/caret-up.svg";
import "./Select.css";

type YearSelectorProps = {
  setYear: (seq: number) => void;
};

export function YearSelector({ setYear }: YearSelectorProps) {
  const years = [2020, 2021, 2022, 2023, 2024];
  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: years,
    onSelectedItemChange({ selectedItem }) {
      setYear(selectedItem);
      console.log(selectedItem);
    },
    defaultSelectedItem: years[years.length - 1],
    itemToString(item) {
      return item ? item.toString() : "";
    },
  });
  return (
    <div className="selector">
      <div id="select-year">
        <label {...getLabelProps()} />
        <div className="select-container" {...getToggleButtonProps()}>
          <span>
            {selectedItem ? selectedItem.toString() : "Choose year..."}
          </span>
          <img className="toggle" src={isOpen ? up : down} />
        </div>
      </div>
      <ul
        id="year-select-list"
        className={
          !(isOpen && years.length)
            ? "user-select-list-hidden"
            : "user-select-list"
        }
        {...getMenuProps()}
      >
        {isOpen &&
          years.map((item, index) => (
            <li
              className={
                highlightedIndex === index
                  ? "user-highlighted-item"
                  : "user-item"
              }
              key={index}
              {...getItemProps({ item, index })}
            >
              {item.toString()}
            </li>
          ))}
      </ul>
    </div>
  );
}
