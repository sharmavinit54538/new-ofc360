import { useGetHolidaysQuery, useCreateHolidayMutation, useDeleteHolidayMutation } from "../../attendanceApi";

export function useHolidayQueries() {
  const { data: holidaysApiRes, refetch: refetchHolidays } = useGetHolidaysQuery();
  const [createHolidayApi] = useCreateHolidayMutation();
  const [deleteHolidayApi] = useDeleteHolidayMutation();
  return { holidaysApiRes, refetchHolidays, createHolidayApi, deleteHolidayApi };
}
