import Collapsable from "./Collapsable";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import EditorInput from "./EditorInput";
import { RoleSelect } from "./RoleSelect";
import SavedMessageSelect from "./SavedMessageSelect";
import { useMemo } from "react";
import { MessageAction } from "../discord/schema";

interface Props {
  guildId: string | null;
  actionCount: number;
  maxActions: number;
  actionIndex: number;
  action: MessageAction;

  collapsableId: string;
  valiationPathPrefix?: string;

  moveUp: () => void;
  moveDown: () => void;
  duplicate: () => void;
  remove: () => void;
  setType(type: number): void;
  setText(text: string): void;
  setTargetId(targetId: string): void;
  setPublic(p: boolean): void;
}

const actionTypes = {
  1: "Text Response",
  6: "Text DM",
  8: "Text Message Edit",
  5: "Saved Message Response",
  7: "Saved Message DM",
  9: "Saved Message Edit",
  2: "Toggle Role",
  3: "Add Role",
  4: "Remove Role",
} as const;

const actionDescriptions = {
  1: "Respond with a text message to the channel.",
  2: "Toggle a role for the user.",
  3: "Add a role to the user.",
  4: "Remove a role from the user.",
  5: "Respond with a saved message to the channel.",
  6: "Send a text message to the user via DM.",
  7: "Send a saved message to the user via DM.",
  8: "Edit the message with a new text message.",
  9: "Edit the message with a saved message.",
} as const;

export default function Action({
  guildId,
  actionCount,
  maxActions,
  actionIndex,
  action,
  collapsableId,
  valiationPathPrefix,
  moveUp,
  moveDown,
  duplicate,
  remove,
  setType,
  setText,
  setTargetId,
  setPublic,
}: Props) {
  const actionTypeGroup = useMemo(() => {
    switch (action.type) {
      case 1:
      case 6:
      case 8:
        return "text_response";
      case 5:
      case 7:
      case 9:
        return "saved_message_response";
      case 2:
        return "toggle_role";
      case 3:
        return "add_role";
      case 4:
        return "remove_role";
    }
  }, [action.type]);

  function setActionTypeGroup(type: string) {
    switch (type) {
      case "text_response":
        setType(1);
        break;
      case "saved_message_response":
        setType(5);
        break;
      case "toggle_role":
        setType(2);
        break;
      case "add_role":
        setType(3);
        break;
      case "remove_role":
        setType(4);
        break;
    }
  }

  const responseStyle = useMemo(() => {
    switch (action.type) {
      case 1 || 5:
        return "channel";
      case 6 || 7:
        return "dm";
      case 8 || 9:
        return "edit";
    }
  }, [action.type]);

  function setResponseStyle(style: string) {
    switch (style) {
      case "channel":
        if (actionTypeGroup === "text_response") {
          setType(1);
        } else {
          setType(5);
        }
        break;
      case "dm":
        if (actionTypeGroup === "text_response") {
          setType(6);
        } else {
          setType(7);
        }
        break;
      case "edit":
        if (actionTypeGroup === "text_response") {
          setType(8);
        } else {
          setType(9);
        }
        break;
    }
  }

  return (
    <div className="p-3 border-2 border-dark-6 rounded-md">
      <Collapsable
        id={collapsableId}
        valiationPathPrefix={valiationPathPrefix}
        title={`Action ${actionIndex + 1}`}
        buttons={
          <div className="flex-none text-gray-300 flex items-center space-x-2">
            {actionIndex > 0 && (
              <ChevronUpIcon
                className="h-6 w-6 flex-none"
                role="button"
                onClick={moveUp}
              />
            )}
            {actionIndex < actionCount - 1 && (
              <ChevronDownIcon
                className="h-6 w-6 flex-none"
                role="button"
                onClick={moveDown}
              />
            )}
            {actionCount < maxActions && (
              <DocumentDuplicateIcon
                className="h-5 w-5 flex-none"
                role="button"
                onClick={duplicate}
              />
            )}
            <TrashIcon
              className="h-5 w-5 flex-none"
              role="button"
              onClick={remove}
            />
          </div>
        }
        extra={
          <div className="text-gray-500 truncate flex space-x-2 pl-2">
            <div>-</div>
            <div className="truncate">{actionTypes[action.type]}</div>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col space-y-3 lg:flex-row lg:space-x-3 lg:space-y-0">
            <div className="flex-none">
              <div className="mb-1.5 flex">
                <div className="uppercase text-gray-300 text-sm font-medium">
                  Type
                </div>
              </div>
              <select
                className="bg-dark-2 rounded p-2 w-full no-ring font-light cursor-pointer text-white"
                value={actionTypeGroup}
                onChange={(v) => setActionTypeGroup(v.target.value)}
              >
                <option value="text_response">Text Response</option>
                <option value="saved_message_response">
                  Saved Message Response
                </option>
                <option value="toggle_role">Toggle Role</option>
                <option value="add_role">Add Role</option>
                <option value="remove_role">Remove Role</option>
              </select>
            </div>
            {(actionTypeGroup === "text_response" ||
              actionTypeGroup === "saved_message_response") && (
              <div className="flex-none">
                <div className="mb-1.5 flex">
                  <div className="uppercase text-gray-300 text-sm font-medium">
                    Target
                  </div>
                </div>
                <select
                  className="bg-dark-2 rounded p-2 w-full no-ring font-light cursor-pointer text-white"
                  value={responseStyle}
                  onChange={(v) => setResponseStyle(v.target.value)}
                >
                  <option value="channel">Channel Message</option>
                  <option value="dm">Direct Message</option>
                  <option value="edit">Edit Message</option>
                </select>
              </div>
            )}
            {(action.type === 1 || action.type === 5) && (
              <div className="flex-none">
                <div className="mb-1.5 flex">
                  <div className="uppercase text-gray-300 text-sm font-medium">
                    Public
                  </div>
                </div>
                <div
                  role="button"
                  onClick={() => setPublic(!action.public)}
                  className="h-9 w-9 rounded bg-dark-2 p-1"
                >
                  {action.public && <CheckIcon className="text-white" />}
                </div>
              </div>
            )}
          </div>
          {action.type === 1 || action.type === 6 || action.type === 8 ? (
            <EditorInput
              label="Response"
              type="textarea"
              value={action.text}
              onChange={(v) => setText(v)}
              controls={true}
            />
          ) : action.type === 2 || action.type === 3 || action.type === 4 ? (
            <RoleSelect
              guildId={guildId}
              roleId={action.target_id || null}
              onChange={(v) => setTargetId(v || "")}
            />
          ) : action.type === 5 || action.type === 7 || action.type === 9 ? (
            <SavedMessageSelect
              guildId={guildId}
              messageId={action.target_id || null}
              onChange={(v) => setTargetId(v || "")}
            />
          ) : null}

          <div className="text-gray-500 text-sm whitespace-normal">
            {actionDescriptions[action.type]}
          </div>
        </div>
      </Collapsable>
    </div>
  );
}
