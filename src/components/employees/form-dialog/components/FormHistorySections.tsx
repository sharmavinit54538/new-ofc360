import type { NestedListsState } from "../types/nestedListTypes";
import { AddressesSection } from "./AddressesSection";
import { KycSection } from "./KycSection";
import { EducationSection } from "./EducationSection";
import { WorkExpSection } from "./WorkExpSection";

export function FormHistorySections({ lists }: { lists: NestedListsState }) {
  return (
    <>
      <AddressesSection addresses={lists.addresses} setAddresses={lists.setAddresses} />
      <KycSection kycDocuments={lists.kycDocuments} setKycDocuments={lists.setKycDocuments} />
      <EducationSection education={lists.education} setEducation={lists.setEducation} />
      <WorkExpSection workExperience={lists.workExperience} setWorkExperience={lists.setWorkExperience} />
    </>
  );
}
