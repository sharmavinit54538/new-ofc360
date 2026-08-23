import { TabsContent } from "@/components/ui/tabs";
import { TeamAttendanceFilters } from "./TeamAttendanceFilters";
import { TeamAttendanceTable } from "./TeamAttendanceTable";
import { TeamAttendancePagination } from "./TeamAttendancePagination";

export function TeamAttendanceTab({ team }: { team: any }) {
  return (
    <TabsContent value="team" className="space-y-4">
      <TeamAttendanceFilters search={team.teamSearch} setSearch={(s: string) => { team.setTeamSearch(s); team.setTeamPage(1); }} date={team.teamDate} setDate={(d: string) => { team.setTeamDate(d); team.setTeamPage(1); }} status={team.teamStatus} setStatus={(st: string) => { team.setTeamStatus(st); team.setTeamPage(1); }} total={team.data?.total} />
      <div className="space-y-0">
        <TeamAttendanceTable isLoading={team.isLoading} items={team.data?.items} />
        <TeamAttendancePagination page={team.data?.page} totalPages={team.data?.totalPages} setPage={team.setTeamPage} />
      </div>
    </TabsContent>
  );
}
