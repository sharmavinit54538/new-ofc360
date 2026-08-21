import {
  useGetCalendarHolidaysQuery,
  useCreateCalendarHolidaysMutation,
  useDeleteCalendarHolidaysIdMutation,
} from "../services/attendanceApi";

export function useHolidayQueries() {
  const { data: holidaysApiRes, isLoading: isHolidaysLoading, refetch: refetchHolidays } = useGetCalendarHolidaysQuery(undefined);
  const [createHolidayApi, { isLoading: isCreatingHoliday }] = useCreateCalendarHolidaysMutation();
  const [deleteHolidayApi] = useDeleteCalendarHolidaysIdMutation();

  return { holidaysApiRes, isHolidaysLoading, refetchHolidays, createHolidayApi, isCreatingHoliday, deleteHolidayApi };
}
