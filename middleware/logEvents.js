const path = require('path')
const fs = require('fs')

function createUpdateTXT(log){
    if(!fs.existsSync(path.resolve('logs'))){
        fs.mkdir(path.resolve('logs'), (err) => console.error("Nie udalo sie stworzyc folderu logs"))
    }
    const logsPATH = path.resolve('logs/reqLog.txt')
    fs.appendFile(logsPATH, log, (err) => {
        err ? console.error(err) : console.log("Dodano LOG poprawnie")    // DEV
    })
}


function logEvents(req,res,next){
    const dateTime = new Date().toLocaleString('pl', {dateStyle: 'short', timeStyle: 'long'})
    let log = `\n${dateTime}\t${req.headers.origin}\t${req.method} ${req.path}`;  

    if (log.match('.css|.html|.jpg|.png'))
        log = `${log}\tSTATIC`

    createUpdateTXT(log)

    // if (otherLog){
    //     log = `\n${dateTime}\t${otherLog}`;
    //     createUpdateTXT(log);
    //     console.error(log)
    //     return;
    // }

    console.log(log)   // GET users/1234
    return next()
}


function logOtherEvents(req,res,otherLog){
    const dateTime = new Date().toLocaleString('pl', {dateStyle: 'short', timeStyle: 'long'})
    let log = `\n${dateTime}\t${otherLog}`;
    createUpdateTXT(log)

    console.log(log)   // GET users/1234
    return ;
}


module.exports = { logEvents, logOtherEvents } 