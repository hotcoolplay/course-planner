import { useRef, useState, useLayoutEffect } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCombobox } from "downshift";

import { Course } from "@/types/index";
import down from "@/assets/caret-down.svg";
import up from "@/assets/caret-up.svg";

type CourseSelectorProps = {
  courseList: Course[];
  setSelectedCourse: (course: Course | null) => void;
  closeModal: () => void;
};

export function CourseSelector({
  courseList,
  setSelectedCourse,
  closeModal,
}: CourseSelectorProps) {
  function filterCourses(input: string) {
    const lowerInput = input.toLowerCase();
    return function courseFilter(course: Course) {
      const courseString =
        course.subject.toLowerCase() + course.catalogNumber.toLowerCase();
      return !lowerInput || courseString.includes(lowerInput);
    };
  }

  const [items, setItems] = useState<Course[]>(courseList);

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
      setSelectedCourse(selectedItem);
      closeModal();
    },
    onInputValueChange({ inputValue }) {
      setItems(courseList.filter(filterCourses(inputValue)));
    },
    items,
    itemToString(item) {
      return item ? item.subject + item.catalogNumber : "";
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
          placeholder="Add Course..."
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
                {`${
                  items[virtualRow.index].subject +
                  items[virtualRow.index].catalogNumber
                }`}
              </li>
            ))}
        </div>
      </ul>
    </div>
  );
}
