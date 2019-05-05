const {UserError} = require("graphql-errors")
const formatFitter=function(fitter){
    if(fitter==undefined){return {}}
    for(let key in fitter){
        if(typeof(fitter[key])=="string"){
            fitter[key]=fitter[key].trim()
            let ff=fitter[key].substring(0,1)
            let end=fitter[key].substring(1).trim()
            switch(ff){
                case ">":
                    fitter[key]={$gt:end}
                break;
                case "<":
                    fitter[key]={$lt:end}
                break;
                case "=":
                    fitter[key]=end
                break;
                case "?":
                    fitter[key]={$regex:new RegExp( end )}
                break;
                default:
                    fitter[key]=fitter[key]
            }
        }
        
        
    }
    return fitter
}


const formatLimit=function(limit){
    if(limit==undefined){return {page:1,num:20,index:0}}
    limit.num=limit.num<=0?20:limit.num
    limit.page=limit.page!=undefined?limit.page:1
    limit.page=limit.page<=1?1:limit.page
    limit.index=(limit.page-1)*limit.num
    return limit
}

// const getUid=async function(token){
//     if(token==undefined){
//         return {_id:undefined,group:undefined,status:undefined}
//     }
//     let tokens=await Token.findById(token)
//     if(tokens.user==undefined || tokens.user==null){
//         throw new UserError('you token must be close'); 
//     }
//     let userInfo=await User.findById(tokens.user)
//     if(userInfo==undefined || userInfo==null){
//         return {_id:undefined,group:undefined,status:undefined}
//     }
//     return userInfo
// }
const formatInput = async (resolve, root, args, context, info) => {

    // let token=context.req.headers.authorization
    // let actName=info.path.key
    // console.log(actName)
    // let user=await getUid(token)
    // if(actName.substring(0,6)=="delete" && user.group!="admin"){
    //     throw new UserError('Permission denied.');
    // }
    // info.user=user
    // info.ccc=1234
    // console.log(context)
    args=args==undefined?{}:args
    if(args._fitter){
        args._fitter.fitter=formatFitter(args._fitter.fitter)
    }
    if(args._fitter){
        args._fitter.limit=formatLimit(args._fitter.limit)
    }
    // console.log(args)
    const result = await resolve(root, args, context, info)
    return result
  }
module.exports = [formatInput];
