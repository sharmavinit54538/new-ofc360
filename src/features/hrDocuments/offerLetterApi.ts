// Re-export/reuse offer letter generation from recruitment offersApi
import {
  useCreateOfferMutation,
  useGetOffersQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
} from "@/features/recruitment/offersApi";

export {
  useCreateOfferMutation as useGenerateOfferLetterMutation,
  useGetOffersQuery as useGetOfferLettersQuery,
  useAcceptOfferMutation,
  useRejectOfferMutation,
};
