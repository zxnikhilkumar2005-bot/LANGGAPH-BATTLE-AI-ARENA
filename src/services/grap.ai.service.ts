import { StateSchema, MessagesValue, ReducedValue, StateGraph, START, END } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { mistralModel,cohereModel , geminiModel} from "./models.service.js";
import { createAgent,providerStrategy } from "langchain";
import {promise, z} from 'zod' 
const State = new StateSchema({
  messages: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""),{
    reducer:(current,next) =>{
        return next
    }
  }),
  solution_2: new ReducedValue(z.string().default(""),{
    reducer:(current,next) =>{
        return next
    }
  }),
  judge_recommendation: new ReducedValue(z.object().default({
    solution_1_score: 0,
    solution_2_score: 0,
  }),{
    reducer:(current,next) =>{
        return next
    }
  }),
});

const solutionNode = async (state: typeof State.State) => {


  console.log(state)


  const [mistral_solution,cohere_solution] = await Promise.all([
    mistralModel.invoke(state.messages[0].text),
    cohereModel.invoke(state.messages[0].text)
  ])
    


    return {
        solution_1: mistral_solution.text,
        solution_2: cohere_solution.text
    }
}

const judgeNode = async (state: typeof State.State)=>{

  console.log('invoking jude with state',state)

  const {solution_1,solution_2} = state;
  const judge = createAgent({
    model:geminiModel,
    tools:[],
    responseFormat:providerStrategy(z.object({
      solution_1_score:z.number().min(0).max(10),
      solution_2_score:z.number().min(0).max(10)
    }))
  })

  const judgeResponse = await judge.invoke({
    messages:[
      new HumanMessage(`you are a judge tasked with evaluating the quality of two solutions to a problem . the problem is ${state.messages[0].text}. The first solution is ${state.solution_1} . The second solution is ${state.solution_2} . please provide a score between 0 to 10 for each solution,where 0 means the solution is completely incorrenct or irrelevant and 10 means the solution is perfect and 10 means the solution is perfect and fully addresses the problem. `)
    ]
  })

  const result = judgeResponse.structuredResponse

  return{
    judge_recommendation:result
  }


}

const graph = new StateGraph(State)
    .addNode("solution",solutionNode)
    .addNode("judge", judgeNode)
    .addEdge(START,"solution")
    .addEdge("solution","judge")
    .addEdge("judge",END)      
    .compile();

export default async function(userMessage:string){
    const result = await graph.invoke({
        messages:[
            new HumanMessage(userMessage)
        ]
    })
    console.log(result)
    return result.messages;
}