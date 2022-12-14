import { HandPalm, Play } from 'phosphor-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './style';
import { createContext, useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns'
import { NewCycleForm } from './NewCycleForm';
import { CountDown } from './countDown';
import { Form } from 'react-router-dom';

interface Cycle {
  id: string
  task: string
  miutesAmount: number
  startDate: Date 
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markyCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)


const newCycleFormValidationSchema =  zod.object({
  task: zod.string().min(1, "Informe a tarefa"),
  minutesAmount: zod.number().min(5, "O ciclo precisa ser de no minimo 5 minutos").max(60, "O ciclo pode ser de no máximo 60 minutos"),
})

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {
  const [ cycles, setCycles] = useState<Cycle[]>([])
  const [ activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [ amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const newCycleForm = useForm<NewCycleFormData> ({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm

  const activeCycle = cycles.find(cycle => cycle.id === activeCycleId)

  function  setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markyCurrentCycleAsFinished() {
    setCycles(state => 
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return{...cycle, finishedDate: new Date()}
        } else {
          return cycle
        }
      }),
    )
  }

  function handleCreateNewCicle(data: NewCycleFormData) {
    const id = String(new Date().getTime());
    const newCycle: Cycle = {
      id,
      task: data.task,
      miutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) =>  [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)
    

    reset();
  }

  function handleInterruptCycle() {

    setCycles((state) => 
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return{...cycle, interruptedDate: new Date()}
        } else {
          return cycle
        }
      }),
    )

    setActiveCycleId(null)

  }


  const task = watch('task')
  const  isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCicle)}>
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markyCurrentCycleAsFinished,  amountSecondsPassed, setSecondsPassed }}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm/>
          </FormProvider>
          <CountDown/>
        </CyclesContext.Provider>

        { activeCycle  ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            Interromper
            <HandPalm size={24}/>
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            Começar
            <Play size={24}/>
          </StartCountdownButton>
        )}

      </form>  
    </HomeContainer>
  )
}