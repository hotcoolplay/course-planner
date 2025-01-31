import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "@/lib/client";
import { SelectedMajor } from "@/types";

function getSelectedMajor(id: number): Promise<{ data: SelectedMajor }> {
  return client.get(`/majors/selected-major/${id}`);
}

function getSelectedMajorQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["majors", id],
    queryFn: () => getSelectedMajor(id),
    enabled: id !== 0,
  });
}

export function useSelectedMajor(id: number) {
  return useQuery({ ...getSelectedMajorQueryOptions(id) });
}
