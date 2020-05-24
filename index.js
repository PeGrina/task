/***/
'use strict';
const {VKApi, ConsoleLogger, BotsLongPollUpdatesProvider}= require('node-vk-sdk');
const Brawlstars = require("brawlstars.js");
const token = "Found your token >:-("
const client = new Brawlstars.Client(token);
let api = new VKApi({
    token: "Found your token >:-(",
    logger: new ConsoleLogger()
})
console.log("flag_nrtj:{!Found_me!}");
console.log("#74#68#69#73#20#69#73#20#64#6f#6e#27#74#20#66#6c#61#67#20#73#65#65#20#64#6f#77#6e#20#6f#6e#20#67#65#74#52#61#6e#64#6f#6d#49#64");
console.log("Bot started and tuned");
function message_new(message, user){
    function getRandomId(min = 0, max = 416669476554) {
        // случайное число от min до (max+1)
        // Hex max
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
      }
    function getMessagePlayer(player){
        console.log(player);
        let message = `
🔷Информация об игроке - ${player.tag}
🛃Ник - ${player.name}
📊Уровень - ${player.data.expLevel}
💰Кубки - ${player.trophies}
💰Максимальные кубки - ${player.highestTrophies}
💣Персонажей - ${player.brawlerCount}/36
        `;
        return message;
    }
    function getMessageCheck(player){
        console.log(player);
        let fs = require('fs');
        let users = JSON.parse(fs.readFileSync("users.json", {encoding: 'utf8'}));
        let n = 0;
        if(player.tag in users){
            n = users[player.tag];
        }else{
            let newN = getRandomId(100,800);
            users[player.tag] = newN;
            fs.writeFileSync("users.json", JSON.stringify(users), 'utf8');
            n = newN;
        }
        let message = `
🔷Информация об игроке - ${player.tag}
🛃Ник - ${player.name}
💰Кубки - ${player.trophies}
🔷Следующий легендарный боец через ${n} сундуков
        `;
        return message;
    }
    function getMessageClub(clan){
        console.log(clan);
        let types = {
            open: "📩Открытый",
            closed: "✉️Закрытый"
        }
        let memberTypes = {
            member: "🙎‍♂️Участник",
            president: "🤴Президент"
        }
        let members = "";
        for(let i = 0; i < clan.members.length;i++){
            let member = `
${i+1}. ${clan.members[i].name} - ${clan.members[i].tag}\n🧙‍♀️Роль - ${memberTypes[clan.members[i].role]}\n💰Кубки - ${clan.members[i].trophies}\n`;
            members += member;
        }
        let message = `
🔷Информация о клане - ${clan.tag}
🛃Имя - ${clan.name}
⚛️Описание - ${clan.description}
📮Тип - ${types[clan.type]}
👨‍🦲Кол-во участников - ${clan.memberCount}/50
▂▃▅▆▇█•Участники•█▇▆▅▃▂
${members}
        `;
        return message;
    }
    console.log(user);
    let text = message.text.toLowerCase();
    if(/player #*/.exec(message.text)){
        ;(async()=>{
            const player = await client.getPlayer(message.text.substring(7));
            api.messagesSend({
                user_id: user[0].id,
                message: getMessagePlayer(player),
                random_id: getRandomId()
            }).then(response => {
                if(typeof response != "number"){
                    console.log(response);
                }
            });
        })()
    }
    if(/club #*/.exec(message.text)){
        ;(async()=>{
            const club = await client.getClub(message.text.substring(5));
            api.messagesSend({
                user_id: user[0].id,
                message: getMessageClub(club),
                random_id: getRandomId()
            }).then(response => { 
                if(typeof response != "number"){
                    console.log(response);
                }
            });
        })()
    }
    if(/check #*/.exec(message.text)){
        ;(async()=>{
            const player = await client.getPlayer(message.text.substring(6));
            api.messagesSend({
                user_id: user[0].id,
                message: getMessageCheck(player),
                random_id: getRandomId()
            }).then(response => { 
                if(typeof response != "number"){
                    console.log(response);
                }
            });
        })()
    }
    if(text == "начать" || text == "команды"){
        api.messagesSend({
            user_id: user[0].id,
            message: `✋🏻Привет, я бот по Brawl Stars!\n🕹Мои команды:\n🔷 player TAG - вместо TAG поставьте тег игрока, информацию о котором хотите посмотреть.\n🔷 club TAG - вместо TAG поставьте тег клуба, информацию о котором хотите посмотреть.`,
            random_id: getRandomId()
        }).then(response=>{
            if(typeof response != "number"){
                console.log(response);
            }
        })
    }
}
let longpoll = new BotsLongPollUpdatesProvider(api, 182951281);
longpoll.getUpdates(updates => {
    console.log(updates);
    if(updates.length != 0){
        let type = updates[0].type;
        switch(type){
            case "message_new":
                let message = updates[0].object.message;
                let date = Number(message.date);
                let now = (+new Date);
                console.log("Time spent on information transfer - " + (now-date*1000) + " ms");
                console.log(message);
                api.usersGet({ user_ids: [message.from_id]}).then(response => {
                    message_new(message, response);
                });
            break;
        }
    }
})
