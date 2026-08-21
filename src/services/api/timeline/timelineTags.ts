export const timelineProvidesTags = (_res: any, _err: any, employeeId: string) => [
  { type: "Timeline" as const, id: employeeId }, "Timeline" as const,
];

export const timelineInvalidatesTags = (_res: any, _err: any, { employeeId }: { employeeId: string }) => [
  { type: "Timeline" as const, id: employeeId }, { type: "Employee" as const, id: employeeId }, "Timeline" as const,
];
