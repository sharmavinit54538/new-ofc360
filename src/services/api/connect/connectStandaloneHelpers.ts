import { store } from "@/app/store";
import { connectUsersApi } from "./connectUsersEndpoints";
import { connectConversationsApi } from "./connectConversationsEndpoints";
import { connectChannelsApi } from "./connectChannelsEndpoints";
import { connectMeetingsApi } from "./connectMeetingsEndpoints";

export const getMe = async () => store.dispatch(connectUsersApi.endpoints.getMe.initiate()).unwrap();
export const getColleagues = async (params?: any) => store.dispatch(connectUsersApi.endpoints.getColleagues.initiate(params)).unwrap();
export const getConversations = async () => store.dispatch(connectConversationsApi.endpoints.getConversations.initiate()).unwrap();
export const getChannels = async () => store.dispatch(connectChannelsApi.endpoints.getChannels.initiate()).unwrap();
export const getMeetings = async () => store.dispatch(connectMeetingsApi.endpoints.getMeetings.initiate()).unwrap();
export const getConversationMessages = async (params: any) => store.dispatch(connectConversationsApi.endpoints.getConversationMessages.initiate(params)).unwrap();
export const getChannelMessages = async (params: any) => store.dispatch(connectChannelsApi.endpoints.getChannelMessages.initiate(params)).unwrap();
