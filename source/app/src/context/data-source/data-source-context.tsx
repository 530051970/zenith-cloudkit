import { List } from "lodash";
import React from "react";
import { useImmerReducer } from 'use-immer'

type StateType = typeof initialDataSource
type ActionType = { type: 'CREATE_TYPE', payload: string}|
                  { type: 'UPDATE_INDIVIDUAL', payload: typeof initialDataSource.data.individualSource}|
                  { type: 'UPDATE_CLOUD_ACCOUNT', payload: typeof initialDataSource.data.cloudAccountSource}|
                  { type: 'UPDATE_JDBC_URLS', payload: any}|
                  { type: 'UPDATE_ADMINS', payload: string}|
                  { type: 'UPDATE_TAGS', payload: string}|
                  { type: 'ADD_ERROR', payload: number}|
                  { type: 'CHANGE_BTN_STATUS', payload: string}|
                  { type: 'CHANGE_STEP', payload: number}|
                  { type: 'HAS_ERROR', payload: boolean}|
                  { type: 'UPDATE_ACCOUNTS', payload: any}|
                  { type: 'CANCEL'}

type DataSourceContextType = { dataSource: StateType, dispatch: React.Dispatch<ActionType> }

const initialDataSource = {
    data:{
    createType: 'individual',
    individualSource: {
        addType: 'default',
        urlList: [''],
        file:''
    },
    cloudAccountSource: {
        cloudAccountInfos:[{
            accountId:'',
            accessKey:'',
            secretKey:''
        }],
        provider: 1,
        sourceList:[]
    },
    adminStr:'',
    tagStr:'',
    },
    btnStatus: 'normal',   // normal|loading
    errorCnt: 0,
    hasError: false,
    step: 1,
}

const dataSourceReducer = (prevState: StateType, action: ActionType) =>{
    // const error = prevState.errorNum
    switch(action.type){
        case "CREATE_TYPE":
            prevState.data={...initialDataSource.data, createType:action.payload}
            break
        case "UPDATE_INDIVIDUAL":
            console.log(action.payload)
            prevState.data.individualSource = action.payload
            break
        case "UPDATE_CLOUD_ACCOUNT":
            console.log(action.payload)
            prevState.data.cloudAccountSource = action.payload
            break
        case "UPDATE_JDBC_URLS":
            prevState.data.individualSource.urlList = action.payload
            break
        case "UPDATE_ADMINS":
            prevState.data.adminStr = action.payload
            break
        case "UPDATE_TAGS":
            prevState.data.tagStr = action.payload
            break
        case "ADD_ERROR":
            prevState.errorCnt = action.payload
            break
        case "HAS_ERROR":
            prevState.hasError = action.payload
            break
        case "CHANGE_BTN_STATUS":
            prevState.btnStatus = action.payload
            break
        case "CHANGE_STEP":
            prevState.step = prevState.step+action.payload
            break
        case "CANCEL":
            return {...initialDataSource, hasError:true}
        case 'UPDATE_ACCOUNTS':
            prevState.data.cloudAccountSource.cloudAccountInfos = action.payload
            break
        default:
            return prevState
          
    }
}

export const DataSourceContext= React.createContext<DataSourceContextType>({} as DataSourceContextType);

export const DataSourceContextWrapper: React.FC<React.PropsWithChildren> =(props) =>{
  const [state, dispatch] = useImmerReducer(dataSourceReducer, initialDataSource)
  return <DataSourceContext.Provider value ={{dataSource: state, dispatch}}>{props.children}</DataSourceContext.Provider>
}