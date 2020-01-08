// GitHub API
const fs = require('fs');
const axios = require('axios');
const inquirer = require('inquirer');
const util = require('util');
const generateHTML = require('./generateHTML');
const writeFileAsync = util.promisify(fs.writeFile);


function init() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is your GitHub username?? ',
        name: 'username'
      },
      {
        type: 'input',
        message:
          'Pick a color for your background!! (green/blue/pink/red):',
        name: 'color'
      }
    ])
    .then(function({ username, color }) {
      const config = { headers: { accept: 'application/json' } };
      let queryUrl = ` https://api.github.com/users/${username}`;
      return axios.get(queryUrl, config).then(userData => {
        let newUrl = `https://api.github.com/users/${username}/starred`;

        axios.get(newUrl, config).then(starredRepos => {
          data = {
            img: userData.data.avatar_url,
            location: userData.data.location,
            gitProfile: userData.data.html_url,
            userBlog: userData.data.blog,
            userBio: userData.data.bio,
            repoNum: userData.data.public_repos,
            followers: userData.data.followers,
            following: userData.data.following,
            starNum: starredRepos.data.length,
            username: username,
            color: color
          };
          generateHTML(data);
          writeHTML(generateHTML(data));
          makePdf(username);
        });
      });
    });
}

const writeHTML = function(generateHTML) {
  writeFileAsync('index.html', generateHTML);
};

init();


// PDF
const puppeteer = require('puppeteer');

async function makePdf(username) {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      'file:////Users/tai/Desktop/Profile-Generator/index.html'
    );
    await page.emulateMedia('screen');

    await page.pdf({
      path: `${username}.pdf`,
      format: 'Letter',
      printBackground: true,
      landscape: true
    });

    console.log('Convert completed!!!');
    await browser.close();
  } catch (error) {
    console.log('Something is wrong!');
  }
}
