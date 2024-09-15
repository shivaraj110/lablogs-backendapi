import emojis from './emojis';
import express from 'express';
const router = express.Router(); 
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import MessageResponse from '../interfaces/MessageResponse';
router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});
router.use('/emojis', emojis);
router.get('/test',(req,res)=>{
  return res.json({
    msg : "it is working!"
  })
})
type assignmentPayload = {
    title : string,
    description : string,
    codeSnippet : string,
    subjectId : number
}
export const addAssignment = async (payload : assignmentPayload) => {
  try{
    const res = prisma.assignment.create({
      data : {
          title : payload.title,
          codeSnippet : payload.codeSnippet,
          description : payload.description,
          subjectId : payload.subjectId
      },
      select : {
          title : true,
          subjectId :true
      }
  })
  return res  
  }
  catch(err){
console.log(err);
}    
}

interface userType{
    fname? : string,
    lname? : string,
    email : string,
    password : string,
}
    export const insertUser = async ( userPayload : userType ) => {
      try{
        const res = await prisma.user.create({
          data : {
              fname : userPayload.fname,
              lname : userPayload.lname,
              email : userPayload.email,
              password : userPayload.password,
          },
          select :{
              userId : true,
          }
      })
      return res
      }
      catch(err){
console.log(err);
    }

}



export const getUser = async (userPayload : userType) => {
  try{
    const res = await prisma.user.findUnique({
      where: {
        email: userPayload.email,
        password: userPayload.password,
      },
      select: {
        userId: true,
      },
    });
    return res
  }
  catch(err){
console.log();

}
    
}


export const addSubject = async (
    name: string,
    desc: string,
    userId: number
  ) => {
    try{
      const res = await prisma.user.update({
        where: {
          userId: userId,
        },
        data: {
          subjects: {
            create: {
              subjectName: name,
              subDescription: desc,
            },
          },
        },
        select: {
          subjects: {
            select: {
              subjectName: true,
            },
          },
          userId : true
        },
      });
      return res;
    }
    catch(err){
console.log(err);
    }
  };



  export const deleteAssignment = async ( assignmentId : number ) => {
    try{
      prisma.assignment.delete({
        where : {
          assignmentId : assignmentId
        }
      })
    }
    catch (err){
console.log(err);

    }
  }


  export const deleteSubject = async (subjectId : number) => {
    try{
      prisma.subject.delete({
        where : {
          subjectId : subjectId
        }
      })
    }
    catch(err){
console.log(err);
    }
  }
router.get('/',(req,res)=>{
  res.json({
    msg : "hey"
  })
})

router.post('/user',async(req,res) => {
  const payload = req.body
  const fname = payload.fname
  const lname = payload.lname
  const email = payload.email
  const password = payload.password
  try{
    const response = await insertUser({
      fname,
      lname,
      email,
      password
    })
  if(response){
    return res.json({
    userId  : response.userId
    })
  }
  else{
    return res.json({
      msg:'something went wrong!'
    })
  }
  }
  catch(err){
    console.log("error : " + err);
  }
})
router.get('/login' , async (req,res) => {
  const payload = req.body
  const email = payload.email
  const password = payload.password
  try{
    const response = await getUser({
      email,
      password
    })
    if(response){
     return res.json({
        userId :response.userId
      })
    }
    else{
    return  res.json({
        msg: 'user not found!'
      })
    }
  }
  catch(err){
    console.log( "error : " + err);
  }
})
router.get('/subjects',async (req,res) => {
  const userId = req.body.userId
  try{
    const response = await prisma.user.findMany({
      where: {
        userId: Number(userId),
      },
      select: {
        subjects: {
          select: {
            subjectId: true,
            subjectName: true,
            subDescription: true,
          },
        },
      },
    });
    if(response){
      return res.json({
        response
      })
    }
    else{
      return res.json({
        msg : "something went wrong"
      })
    }
  }catch(err){
    console.log("error " + err );
  }
} )
router.post('/subject', async (req,res) => {
  const name = req.body.name
  const description = req.body.description
  const userId = req.body.userId

  try{
    const response = await addSubject(
      name,
      description,
      userId
      )
      if(response){
        return res.json({
          userId 
        })
      }
      else{
       return res.json({
          msg : "something went wrong!"
        })
      }
  }
  catch(err){
    console.log("error : " + err);
    
  }
})
router.get('/assignments', async (req,res) => {
  const subjectId = req.body.subjectId
  try{
    const response = await prisma.assignment.findMany({
      where: {
        subjectId : Number(subjectId)
      },
      select: {
        title: true,
        description: true,
        codeSnippet: true,
        assignmentId: true,
      },
    });
    if(response){
        res.json({
            response
        })
    }
    else{
      return res.json({
        msg : "something went wrong!"
      })
    }
  }
  catch(err){
    console.log("error : " + err);
  }
})
router.post('/assignment', async (req,res) => {
  const body = req.body
  const subjectId = body.subjectId
  const title = body.title
  const description = body.description
  const codeSnippet = body.codeSnippet
  try{
    const response = await addAssignment({
      title,
      description,
      codeSnippet,
      subjectId
    });
    res.json({
        response
    })
  }
  catch(err){
    console.log('error' + err);
  }
})

export default router;
