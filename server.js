const express=require('express');
const cors=require ('cors');
const websocket=require('ws');
const app=express();
app.use(cors());
app.use(express.json());
let user={
    'username':{
username:'james jude',
email:'jamesjude@gmail.com',
phone:'0790289521',
tickets: [
    {id:12345,eventName:"event 1",datepurchased:"2025-01-01",status:"active"},
    {id:67890,eventname:"event 2",datepurchased:"2025-02-13",status:"expired"},
]
    }
};
let notification =[
    {userid:'jamesjude',message:'you have 2 active tickets'}
];
app.get('/api/user/:username',(req,res)=>{
    const user=user[req.params.username];
    res.json(user);
});
app.put('/api/user/:username', (req,res)=>{
    const user=user[req.params.username];
    user.phone=req.body.phone;
    res.json(user);
});
app.get('/api/tickets/:username', (req,res)=>{
    res.json(user[req.params.username].tickets);
});
app.get('/api/notifications/:username',(req,res)=>{
    res.json(notification.filter(n=>n.userid===req.params.username));
});
const server=app.listen(3000,()=>{
    console.log('API serving running on port 3000');
});
const wss=new websocket.server({server});
wss.on('connection', (ws)=>{
    console.log('client connected');
    ws.on('close',()=>{
        console.log('client disconnected');
    });
});
function broadcastupdate(username){
    const data=JSON.stringify({
        type:'update',
        username
    });
    wss.clients.forEach(client=>{
        if(client.readystate===websocket.OPEN){
            client.send(data);
        }
    });
}
module.exports=server;