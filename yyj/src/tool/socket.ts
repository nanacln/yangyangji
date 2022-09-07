function getSocket(){
  let socket:null|WebSocket=null
  return function(){
    if(!socket){
      socket=new WebSocket('ws://localhost:3000/')
      // socket=new WebSocket('ws://106.14.172.134:3000/')
    }
    socket.addEventListener('open', () => {
      console.log('建立连接')
      // type  1上线  2私聊  3 群聊  0服务器存储消息失败 4刚进入私聊（去获取未在线时，别人发的消息）
    })
    return socket
  }
}
export default getSocket()