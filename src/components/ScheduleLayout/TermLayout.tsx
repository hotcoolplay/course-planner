import "./TermLayout.css";
import { Term, Course } from "@/types";
import { CourseSelector } from "@/components/CourseSelector";
import { useEffect, useState } from "react";
import { client } from "@/lib/client";
import { latestYear } from "@/utils/constants";

type TermLayoutProps = {
  year: number;
  term: Term;
  termType: string;
};

export function TermLayout({ year, term, termType }: TermLayoutProps) {
  const [courseList, setCourseList] = useState<Course[]>([]);
  useEffect(() => {
    client
      .get<Course[]>(
        `/courses/term/${term.toLowerCase()}-${
          year <= latestYear ? year : latestYear
        }`
      )
      .then((res) => {
        setCourseList(res.data);
      });
  }, [term]);
  const CourseSelectors: Course[][] = [];
  for (
    let i = 0;
    i < (termType.charAt(0) >= "0" && termType.charAt(0) <= "9" ? 7 : 3);
    ++i
  ) {
    CourseSelectors.push(courseList);
  }
  return (
    <>
      <h4>{`${term} ${
        termType === "Off"
          ? `(${termType})`
          : termType.includes("WT")
          ? `(Co-op)`
          : ""
      }`}</h4>
      {CourseSelectors.map((item) => (
        <CourseSelector courseList={item} />
      ))}
    </>
  );
}
