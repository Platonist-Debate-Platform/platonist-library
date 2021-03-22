import { RequestActionType, RequestStatus } from './Keys';
import { KeysOfRequestIDs, ReactReduxRequestActions, ReactReduxRequestState, ReactReduxRequestError } from './Types';
import { createRequestActionType } from './Utils';
import { isArray, merge, unionBy } from 'lodash'
import { randomHash } from '../Utils';

const createInitialState = <Payload extends Object = {}, Meta extends Object = {}>(id: KeysOfRequestIDs): ReactReduxRequestState<Payload, Meta> => ({
  error: undefined,
  hash: randomHash(32),
  id,
  result: undefined,
  status: RequestStatus.Initial,
});



export const createReducer = <Payload extends Object = {}, Meta extends Object = {} >(id: KeysOfRequestIDs) => {
  const initialState = {
    ...createInitialState<Payload, Meta>(id),
    hash: randomHash(32),
  };

  const reducer = (state: ReactReduxRequestState<Payload, Meta> = initialState, action: ReactReduxRequestActions): ReactReduxRequestState<Payload, Meta> => {
    const update = action.meta && (action.meta as Meta & {update: boolean}).update ? true : false;

    switch(action.type) {
      case createRequestActionType(RequestActionType.Cancel, id):
        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          status: RequestStatus.Loaded,
        };

      case createRequestActionType(RequestActionType.Clear, id):
        return {
          ...initialState,
          hash: randomHash(32),
        };

      case createRequestActionType(RequestActionType.Fail, id): 
        return {
          ...state,
          hash: randomHash(32),
          error: action.payload as ReactReduxRequestError,
          meta: action.meta as Meta,
          status: RequestStatus.Error,
        }

      case createRequestActionType(RequestActionType.Load, id): 
        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          status: RequestStatus.Updating,
          result: update ? state.result : undefined,
        }

      case createRequestActionType(RequestActionType.Receive, id):
        const stateValue = state.result && (state.result as any).value;
        const payloadValue = action.payload && (action.payload as any).value 
        const hasValue = stateValue ? true : false;
        
        let result: Object = action.payload || {};

        if (hasValue) {
          (result as any).value = isArray(stateValue) ?
          unionBy(stateValue|| [], payloadValue, 'id') : merge(payloadValue || {}, stateValue || {});
        } else {
          result = (!state.result && isArray(result)) || isArray(state.result) ?
          unionBy<Payload>(action.payload as [] || [], state.result || [], 'id') : merge(state.result || {}, action.payload || {});
        }

        if (action.meta && (action.meta as any).update) {
          delete (action.meta as any).update;
        }

        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          result: result as Payload,
          status: RequestStatus.Loaded
        }

      case createRequestActionType(RequestActionType.Update, id):
        return {
          ...state,
          hash: randomHash(32),
          error: undefined,
          meta: action.meta as Meta,
          result: state.result as Payload,
          status: RequestStatus.Updating
        }
      
      default:
        return state;
    }
  };

  return reducer;
}