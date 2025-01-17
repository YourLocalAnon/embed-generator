import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { MessageAction, MessageActionSet } from "../discord/schema";
import { getUniqueId } from "../util";

export interface ActionsStore {
  clear(): void;
  setActionSet: (id: string, actionSet: MessageActionSet) => void;
  addAction: (id: string, action: MessageAction) => void;
  clearActions: (id: string) => void;
  deleteAction: (id: string, i: number) => void;
  moveActionUp: (id: string, i: number) => void;
  moveActionDown: (id: string, i: number) => void;
  duplicateAction: (id: string, i: number) => void;
  setActionType: (id: string, i: number, type: number) => void;
  setActionText: (id: string, i: number, text: string) => void;
  setActionTargetId: (id: string, i: number, target: string) => void;
  setActionPublic: (id: string, i: number, val: boolean) => void;

  actions: Record<string, MessageActionSet>;
}

export const createMessageStore = (key: string) =>
  create<ActionsStore>()(
    immer(
      persist(
        (set, get) => ({
          actions: {},

          clear: () => set({ actions: {} }),
          setActionSet: (id: string, actionSet: MessageActionSet) =>
            set((state) => {
              state.actions[id] = actionSet;
            }),
          addAction: (id: string, action: MessageAction) =>
            set((state) => {
              const actionSet = state.actions[id];
              if (actionSet) {
                actionSet.actions.push(action);
              } else {
                state.actions[id] = { actions: [action] };
              }
            }),
          clearActions: (id: string) =>
            set((state) => {
              const actionSet = state.actions[id];
              if (actionSet) {
                actionSet.actions = [];
              }
            }),
          deleteAction: (id: string, i: number) =>
            set((state) => {
              const actionSet = state.actions[id];
              if (actionSet) {
                actionSet.actions.splice(i, 1);
              }
            }),
          moveActionUp: (id: string, i: number) =>
            set((state) => {
              const actionSet = state.actions[id];
              if (actionSet) {
                const action = actionSet.actions[i];
                if (action) {
                  actionSet.actions.splice(i, 1);
                  actionSet.actions.splice(i - 1, 0, action);
                }
              }
            }),
          moveActionDown: (id: string, i: number) => {
            set((state) => {
              const actionSet = state.actions[id];
              if (actionSet) {
                const action = actionSet.actions[i];
                if (action) {
                  actionSet.actions.splice(i, 1);
                  actionSet.actions.splice(i + 1, 0, action);
                }
              }
            });
          },
          duplicateAction: (id: string, i: number) => {
            set((state) => {
              const actionSet = state.actions[id];
              if (actionSet) {
                const action = actionSet.actions[i];
                if (action) {
                  actionSet.actions.splice(i + 1, 0, {
                    ...action,
                    id: getUniqueId(),
                  });
                }
              }
            });
          },
          setActionType: (id: string, i: number, type: number) =>
            set((state) => {
              const actionSet = state.actions[id];
              const action = actionSet.actions[i];

              if (type === 1 || type === 6 || type === 8) {
                actionSet.actions[i] = {
                  type,
                  id: action.id,
                  text: "",
                  public: false,
                };
              } else if (
                type === 2 ||
                type === 3 ||
                type === 4 ||
                type === 5 ||
                type === 7 ||
                type === 9
              ) {
                actionSet.actions[i] = {
                  type,
                  id: action.id,
                  target_id: "",
                  public: false,
                };
              }
            }),
          setActionText: (id: string, i: number, text: string) =>
            set((state) => {
              const actionSet = state.actions[id];
              const action = actionSet.actions[i];
              if (action.type === 1 || action.type === 6 || action.type === 8) {
                action.text = text;
              }
            }),
          setActionTargetId: (id: string, i: number, target: string) =>
            set((state) => {
              const actionSet = state.actions[id];
              const action = actionSet.actions[i];
              if (
                action.type === 2 ||
                action.type === 3 ||
                action.type === 4 ||
                action.type === 5 ||
                action.type === 7 ||
                action.type === 9
              ) {
                action.target_id = target;
              }
            }),
          setActionPublic: (id: string, i: number, val: boolean) =>
            set((state) => {
              const actionSet = state.actions[id];
              const action = actionSet.actions[i];
              action.public = val;
            }),
        }),
        { name: key, version: 0 }
      )
    )
  );

// TODO: move message actions into this store instead of current message store
export const useCurrentMessageActionsStore = createMessageStore(
  "current-message-actions"
);

export const useCommandActionsStore = createMessageStore(
  "custom-commands-actions"
);
