import { useQuery, queryOptions } from "@tanstack/react-query";

import { client } from "@/lib/client";
import { Course } from "@/types";

export const getCoursesForTerm = (
  term: string
): Promise<{ data: Course[] }> => {
  return client.get(`/courses/term/${term}`);
};

export const getCoursesQueryOptions = (term: string) => {
  return queryOptions({
    queryKey: ["courses", term],
    queryFn: () => getCoursesForTerm(term),
  });
};

export const useCourses = (term: string) => {
  return useQuery({
    ...getCoursesQueryOptions(term),
  });
};
