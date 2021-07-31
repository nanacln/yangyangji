	    function getSocket(){
		  let socket:null|WebSocket=null
		  return function(){
		    if(!socket){
		      socket=new WebSocket('ws://localhost:3000/')
		    }
		    return socket
		  }
		}
		export default getSocket