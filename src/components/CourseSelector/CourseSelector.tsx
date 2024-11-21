import { useRef, useState, useLayoutEffect } from "react";
import "./CourseSelector.css";
import { Course } from "@/types/index";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useCombobox } from "downshift";
import icon from "@/assets/rows-plus-bottom.svg";

type CourseSelectorProps = {
  courseList: Course[];
};

export function CourseSelector({ courseList }: CourseSelectorProps) {
  function filterCourses(input: string) {
    const lowerInput = input.toLowerCase();
    return function courseFilter(course: Course) {
      const courseString =
        course.subject.toLowerCase() + " " + course.catalogNumber.toLowerCase();
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
    onInputValueChange({ inputValue }) {
      setItems(courseList.filter(filterCourses(inputValue)));
    },
    items,
    itemToString(item) {
      return item ? item.subject + " " + item.catalogNumber : "";
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
    <div className="course-container">
      <label {...getLabelProps()} />
      <div className="input-container">
        <input
          className="course-input"
          placeholder="Add Course..."
          {...getInputProps({ type: "text" })}
        />
        <button
          aria-label="toggle menu"
          className="add-button"
          type="button"
          {...getToggleButtonProps()}
        >
          <img className="add-icon" src={icon} />
        </button>
      </div>
      <ul
        className={
          !(isOpen && items.length) ? "course-list-hidden" : "course-list"
        }
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
                    ? "highlighted-course"
                    : "course"
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
                {`${items[virtualRow.index].subject} ${
                  items[virtualRow.index].catalogNumber
                }`}
              </li>
            ))}
        </div>
      </ul>
    </div>
  );
}
