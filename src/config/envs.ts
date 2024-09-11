import 'dotenv/config';
import * as joi from 'joi'
interface EnvVars{
    PORT:number
    DATABASE_URL:string
}
const envShema=joi.object({
    PORT:joi.number().required(),
    DATABASE_URL:joi.string().required()
}).unknown(true);

const {error,value}= envShema.validate(process.env)
if(error){
    throw new Error(` Config Validatioon errr :${error.message} `)
}
 const envVars: EnvVars=value
 export const envs={
    port:envVars.PORT,
    DATABASE_URL:envVars.DATABASE_URL
 }