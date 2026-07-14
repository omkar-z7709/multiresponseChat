import dotenv from 'dotenv';
import OpenAI from 'openai';
import { Roles } from 'openai/resources/admin/organization.mjs';
import { Content } from 'openai/resources/skills.mjs';
dotenv.config();


const client = new OpenAI({
    apiKey: process.env.API_KEY,
    baseURL:process.env.base_url
})

const SYSTEM_PROMPT = `
        You are specialist in human relation , who has done several reasearch work in human emotion and human psycology



`
const MESSAGE_DB = [];

async function gptResponse(prompt="") {

   

    try{
        const result = await client.chat.completions.create({
            model:"gpt-4o-mini",
            messages:[
                {role:"user", content:prompt},
                {role:"system", content:SYSTEM_PROMPT}
            ]
        })
        console.log(`------------------------GPT RESPONSE-------------------------------`)
        console.log(result.choices[0].message.content)
        MESSAGE_DB.push(result.choices[0].message.content)
    }catch(error){

            console.log("-------------------------GPT ERROR------------------------------")
             console.error("API Gateway Error:");
             console.error(error.message);
    }


    
}



async function claudeResponse(prompt="") {

   

    try{
        const result = await client.chat.completions.create({
            model:"claude-opus-4-8",
            messages:[
                {role:"user", content:prompt},
                {role:"system", content:SYSTEM_PROMPT}
            ]
        })
        
       console.log(`------------------------CLAUDE RESPONSE-------------------------------`)
        console.log(result.choices[0].message.content)
        MESSAGE_DB.push(result.choices[0].message.content)
    }catch(error){

            console.log("-------------------------CLAUDE ERROR------------------------------")
             console.error("API Gateway Error:");
             console.error(error.message);
    }


    
}

async function geminiResponse(prompt="") {

   

    try{
        const result = await client.chat.completions.create({
            model:"google/gemini-2.5-pro",
            messages:[
                {role:"user", content:prompt},
                {role:"system", content:SYSTEM_PROMPT}
            ]
        })
        console.log(`------------------------GEMINI RESPONSE-------------------------------`)
        console.log(result.choices[0].message.content)
        MESSAGE_DB.push(result.choices[0].message.content)
    }catch(error){

            console.log("-------------------------GEMINI ERROR------------------------------")
             console.error("API Gateway Error:");
             console.error(error.message);
    }


    
}



// console.log(`------------------------Final----------------------------`)

const FinalSystemPrompt = `

        you are a specialiist in analysing LLM response and you have to analyse the response of
         three LLMs and give a final response based on the three LLMs response.



`

async function finalOut() {

    const response = await client.chat.completions.create({
        model:'claude-opus-4-8',
        messages:[

            {role:"user", content:JSON.stringify(MESSAGE_DB)},
            {role:"system", content:FinalSystemPrompt}
        ]
        

})  

        console.log(`------------------------Final----------------------------`)
        console.log(`-----------------------Response----------------------------`)
        console.log(response.choices[0].message.content)
}



const prompt = `Why womens are more emotional than men?`





async function  runall(prompt) {
    
    try{
         console.log(`------------------------ Response Start-------------------------------`)

        await Promise.all(
            [
                gptResponse(prompt),
                claudeResponse(prompt),
                geminiResponse(prompt)
            ]
        )
        
         await finalOut()
         console.log(`------------------------ Response End-------------------------------`)
    }catch(error){
            console.log("-------------------------RUNALL ERROR------------------------------")
             console.error("API Gateway Error:");
             console.error(error.message);
    }


} 
    

runall(prompt)
