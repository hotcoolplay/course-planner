import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "@/lib/client";
import { SelectedProgram } from "@/types";

function getSelectedExtension(id: number): Promise<{ data: SelectedProgram }> {
  return client.get(`/programs/selected-program/${id}`);
}

function getSelectedExtensionQueryOptions(id: number) {
  return queryOptions({
    queryKey: ["extensions", id],
    queryFn: () => getSelectedExtension(id),
  });
}

export function useSelectedExtension(id: number) {
  return useQuery({ ...getSelectedExtensionQueryOptions(id) });
}
