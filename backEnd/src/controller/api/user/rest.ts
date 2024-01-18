/**
 * @author bh-lay
 * 
 */
// import { getDbCollection } from '@/database/DB'

// // 增加一条用户记录
// function add(parm,callback){
//   parm = parm || {}
//   getDbCollection('user')
//     .then(({collection, client}) => {
//       parm.id = utils.createID()

//       collection.insertOne(parm,function(err){
//         if(err) {
//           callback && callback(err)
//         }else {
//           callback && callback(null)
//         }
//         client.close()
//       })
//     }).catch(err => {
//       callback && callback(err)
//     })
// }
// // 修改用户记录
// function edit(parm,callback){
//   getDbCollection('user')
//     .then(({collection, client}) => {
//       collection.updateOne({
//         id : parm.id
//       }, {
//         $set: parm
//       }, function(err) {
//         if(err) {
//           callback && callback(err)
//         }else {
//           callback && callback(null)
//         }
//         client.close()
//       })
//     }).catch(err => {
//       callback && callback(err)
//     })
// }

// /**
//  * 获取用户列表
//  * 
//  */
// function get_list(data,callback){
//   var limit_num = parseInt(data['limit']) || 10,
//     skip_num = parseInt(data['skip'])|| 0
  
//   var resJSON = {
//     code:200,
//     'limit':limit_num,
//     'skip':skip_num,
//   }
//   getDbCollection('user')
//     .then(({collection, client}) => {
//       collection.countDocuments(function(err,count){
//         resJSON['count'] = count
        
//         collection.find({},{
//           limit:limit_num
//         }).sort({
//           id: -1
//         }).skip(skip_num).toArray(function(err, docs) {
//           client.close()
//           if(err){
//             resJSON.code = 2
//           }else{
//             for(var i=0,total=docs.length;i<total;i++){
//               delete docs[i].password
//             }
//             resJSON['list'] = docs
//           }
//           callback&&callback(resJSON)
//         })
//       })
//     }).catch(err => {
//       callback && callback(err)
//     })
// }

// // 增加或编辑用户记录
// exports.add_edit = function (connect){
//   parseRequestBody(connect.request,function(error, fields){
//     var data = fields
//     var parm = {
//       'id' : data['id'] || '',
//       'username' : data['username'] || '',
//       'password' : data['password'] ? utils.parse.md5(data['password']) : null,
//       'email' : data['email'] || null,
//       'avatar' : data['avatar'] || null,
//       'user_group' : data['user_group'] || '',
//     }
//     if(!parm['username']){
//       connect.writeJson({
//         code : 2,
//         'msg' : 'please insert complete code !'
//       })
//       return
//     }
    
//     connect.session(function(sessionInstance){
//       if(parm['id']&&parm['id'].length>2){
//         // check edit user power
//         if(sessionInstance.power(12)){
//           if(parm['password'] == null){
//             delete parm['password']
//           }
//           edit(parm,function(err){
//             if(err){
//               connect.writeJson({
//                 code:3,
//                 'msg':'modified faild!'
//               })
//               return
//             }
//             connect.writeJson({
//               code:1,
//               'msg':'modified success!'
//             })
//           })
//         }else{
//           connect.writeJson({
//             code:2,
//             'msg':'no power to edit user !'
//           })
//         }
//       }else{
//         // check add user power
//         if(sessionInstance.power(11)){
//           add(parm,function(err){
//             if(err){
//               connect.writeJson({
//                 code:3,
//                 'msg':'add faild!'
//               })
//               return
//             }
//             connect.writeJson({
//               code:1,
//               'msg':'add success!'
//             })
//           })
//         }else{
//           connect.writeJson({
//             code:2,
//             'msg':'no power to edit user !'
//           })
//         }
//       }
//     })
//   })
// }


// // 登出
// exports.exist = function(connect){
  
//   connect.session(function(sessionInstance){
//     sessionInstance.set({
//       user_group : 'guest',
//       uid : '',
//       powerCode : []
//     })
//     connect.writeJson({
//       code: 200,
//       msg : 'exist success !'
//     })
//   })
// }

// // 获取用户列表
// exports.list = function(connect){
//   parseRequestBody(connect.request,function(err,data){
//     if(err){
//       connect.writeJson({
//         code : 2,
//         'msg' : ''
//       })
//       return
//     }
//     get_list(data,function(json){
//       connect.writeJson(json)
//     })
//   })
// }