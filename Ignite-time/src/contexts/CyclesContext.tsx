import { differenceInSeconds } from "date-fns";
import React, { createContext, ReactNode, useState, useReducer, useEffect } from "react";
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentAsFinishedAcion } from "../reducers/cycles/action";
import { Cycle, cyclesReducers } from "../reducers/cycles/reducers"

interface CreateCycleData {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markyCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle:  () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({ 
  children, 
}: CyclesContextProviderProps) {
  const [ cyclesState, dispatch] = useReducer(cyclesReducers,{
    cycles: [],
    activeCycleId: null,
  }, (initialState) => {
    const storedStateAsJSON = localStorage.getItem('@Timer-pomodoro: cycles-state-1.0.0')

    if (storedStateAsJSON) {
      return JSON.parse(storedStateAsJSON)
    }

    return initialState
  })

  const { cycles, activeCycleId } = cyclesState
  
  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  const [ amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(
        new Date(), 
        new Date(activeCycle.startDate
      ))
    }

    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@Timer-pomodoro: cycles-state-1.0.0', stateJSON)
  }, [cyclesState])


  function  setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markyCurrentCycleAsFinished() {

    dispatch(markCurrentAsFinishedAcion())
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      miutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    /*setCycles((state) =>  [...state, newCycle])*/
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {

    dispatch(interruptCurrentCycleAction())

    /*
    setCycles((state) => 
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return{...cycle, interruptedDate: new Date()}
        } else {
          return cycle
        }
      }),
    )*/

  }

  return (
    <CyclesContext.Provider 
      value={{ 
        cycles,
        activeCycle, 
        activeCycleId,
        markyCurrentCycleAsFinished,  
        amountSecondsPassed, 
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}


/*
export const CyclesContext = createContext({} as CyclesContextType)
 */