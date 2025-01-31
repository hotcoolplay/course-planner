import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "@/lib/client";
import { SelectedCourse } from "@/types";

function getSelectedCourse(id: number): Promise<{ data: SelectedCourse }> {
  return client.get(`/courses/selected-course/${id}`);
}

function getSelectedCourseQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["selectedCourse", id],
    queryFn: () => getSelectedCourse(id),
    enabled: id !== 0,
  });
}

export function useSelectedCourse(id: number) {
  return useQuery({ ...getSelectedCourseQueryOptions(id) });
}
