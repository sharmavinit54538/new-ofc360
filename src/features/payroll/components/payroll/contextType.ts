import { NavContext } from "./types/nav";
import { LoaderContext } from "./types/loaders";
import { Mutations1Context } from "./types/mutations1";
import { Mutations2Context } from "./types/mutations2";
import { ListContext } from "./types/lists";
import { ModalContext } from "./types/modals";
import { Forms1Context } from "./types/forms1";
import { Forms2Context } from "./types/forms2";
import { Forms3Context } from "./types/forms3";
import { CopilotContext } from "./types/copilot";
import { Actions1Context } from "./types/actions1";
import { Actions2Context } from "./types/actions2";

export interface PayrollContextType
  extends NavContext, LoaderContext, Mutations1Context, Mutations2Context,
    ListContext, ModalContext, Forms1Context, Forms2Context, Forms3Context,
    CopilotContext, Actions1Context, Actions2Context {}
