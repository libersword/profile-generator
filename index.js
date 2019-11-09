const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

let username = '';
let bio = '';
let name = '';
let location = '';
let profile = '';
let picture = '';
let followers = 0;
let following = 0;
let repos = 0;
let starsLink = '';
let stars = 0;

function getGithub(){
  return inquirer
    .prompt({
      message: "Enter your GitHub username",
      name: "username"
    })
    .then(function({ username }) {
      const queryUrl = `https://api.github.com/users/${username}`;
      axios
      .get(queryUrl)
      .then(function(res) {
        const results = res.data;
        console.log(results);
        name = results.name;
        username = results.login;
        location = results.location;
        profile = results.html_url;
        bio = results.bio;
        followers = results.followers;
        following = results.following;
        repos = results.public_repos;
        picture = results.avatar_url;
        const html = generateHTML(name, username, bio, location, profile, following, followers, repos, picture);
        writeFileAsync('index.html', html);
    });
    });
  }
  
    function generateHTML(name, username, bio, location, profile, following, followers, repos, picture){
      return  `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
      </head>
      <body>
        <h1>Name: ${name}</h1>
        <h2>Username: ${username}</h2>
        <h2>Location: ${location}</h2>
        <h2>Bio: ${bio}</h2>
        <h2>Profile: ${profile}</h2>
        <h2>Followers: ${followers}</h2>
        <h2>Following: ${following}</h2>
        <h2>Repos: ${repos}</h2>
        <img src = ${picture}/>
      </body>
      </html>
      `
    }
  
    async function init(){
      try{
        await getGithub();
    
      }catch(error){
        console.log(error);
      }
    }
    
    init();
  