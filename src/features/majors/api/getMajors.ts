import { queryOptions, useQuery } from "@tanstack/react-query";

import { client } from "@/lib/client";
import { Major } from "@/types";

function getMajors(): Promise<{ data: Major[] }> {
  return client.get(`/majors`);
}

function getMajorsQueryOptions() {
  return queryOptions({
    queryKey: ["majors"],
    queryFn: () => getMajors(),
  });
}

export function useMajors() {
  return useQuery({ ...getMajorsQueryOptions() });
}
