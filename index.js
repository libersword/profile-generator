const fs = require('fs'),
    convertFactory = require('electron-html-to');
const axios = require("axios");
const inquirer = require("inquirer");
const util = require("util");
const electron = require('electron');
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
        // writeFileAsync('index.html', html);
        generatePDF(html)
    });
    });
  }

  function generatePDF(html){
    var conversion = convertFactory({
      converterPath: convertFactory.converters.PDF
    });
    
    conversion({ html: html }, function(err, result) {
      if (err) {
        console.log(html);
        return console.error(err);
      }
      console.log(result.logs);
      result.stream.pipe(fs.createWriteStream('githubProfile.pdf'));
    });
}
  function generateHTML(name, username, bio, location, profile, following, followers, repos, picture) {
    const colors = {
      green: {
        wrapperBackground: "#E6E1C3",
        headerBackground: "#C1C72C",
        headerColor: "black",
        photoBorderColor: "#black"
      },
      blue: {
        wrapperBackground: "#5F64D3",
        headerBackground: "#26175A",
        headerColor: "white",
        photoBorderColor: "#73448C"
      },
      pink: {
        wrapperBackground: "#879CDF",
        headerBackground: "#FF8374",
        headerColor: "white",
        photoBorderColor: "#FEE24C"
      },
      red: {
        wrapperBackground: "#DE9967",
        headerBackground: "#870603",
        headerColor: "white",
        photoBorderColor: "white"
      }
    };
    return `<!DOCTYPE html>
  <html lang="en">
     <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.1/css/all.css"/>
        <link href="https://fonts.googleapis.com/css?family=BioRhyme|Cabin&display=swap" rel="stylesheet">
        <title>Document</title>
        <style>
            @page {
              margin: 0;
            }
           *,
           *::after,
           *::before {
           box-sizing: border-box;
           }
           html, body {
           padding: 0;
           margin: 0;
           }
           .wrapper {
           background-color: ${colors.red.wrapperBackground};
           padding-top: 100px;
           }
           body {
           background-color: white;
           -webkit-print-color-adjust: exact !important;
           font-family: 'Cabin', sans-serif;
           }
           main {
           background-color: #E9EDEE;
           height: auto;
           padding-top: 30px;
           }
           h1, h2, h3, h4, h5, h6 {
           font-family: 'BioRhyme', serif;
           margin: 0;
           }
           h1 {
           font-size: 2em;
           }
           h2 {
           font-size: 1.5em;
           }
           h3 {
           font-size: 1em;
           }
           h4 {
           font-size: 1em;
           }
           h5 {
           font-size: 1em;
           }
           h6 {
           font-size: 1em;
           }
           .photo-header {
           position: relative;
           margin: 0 auto;
           margin-bottom: -50px;
           display: flex;
           justify-content: center;
           flex-wrap: wrap;
           background-color: ${colors.red.headerBackground};
           color: ${colors.red.headerColor};
           padding: 10px;
           width: 95%;
           border-radius: 6px;
           }
           .photo-header img {
           width: 250px;
           height: 250px;
           border-radius: 50%;
           object-fit: cover;
           margin-top: -75px;
           border: 6px solid ${colors.red.photoBorderColor};
           box-shadow: rgba(0, 0, 0, 0.3) 4px 1px 20px 4px;
           }
           .photo-header h1, .photo-header h2 {
           width: 100%;
           text-align: center;
           }
           .photo-header h1 {
           margin-top: 10px;
           }
           .links-nav {
           width: 100%;
           text-align: center;
           padding: 20px 0;
           font-size: 1.1em;
           }
           .nav-link {
           display: inline-block;
           margin: 5px 10px;
           }
           .workExp-date {
           font-style: italic;
           font-size: .7em;
           text-align: right;
           margin-top: 10px;
           }
           .container {
           padding: 50px;
           padding-left: 100px;
           padding-right: 100px;
           }
  
           .row {
             display: flex;
             flex-wrap: wrap;
             justify-content: space-between;
             margin-top: 20px;
             margin-bottom: 20px;
           }
  
           .card {
            padding: 20px;
            border-radius: 6px;
            flex-basis: 45%;
            background-color: #870603;
            color: white;
            margin: 0 auto;
            margin-top: 100px;
            margin-left: 30px;
            margin-bottom: 30px;
             background-color: ${colors.red.headerBackground};
             color: ${colors.red.headerColor};
           }
           
           .col {
           flex: 1;
           text-align: center;
           }
  
           a, a:hover {
           text-decoration: none;
           color: inherit;
           font-weight: bold;
           }
  
           @media print { 
            body { 
              zoom: .75; 
            } 
           }
        </style>
        <body>
        <div class="wrapper">
              <div class="main">
                <div class="photo-header">
                <img src = ${picture}/>
                <h1>${name}</h1>
                <h2>${username}</h2>
                <h2>${bio}</h2>
                <div class="links-nav">
                <div class="nav-link">
                <a href='${profile}'>Github</a><br>
                ${profile}
                </div>
                <div class="nav-link">
                <a href="https://www.google.com/maps/place/${location}">Location</a><br>
                ${location}
                </div>
        </div>
        </div>
        <div class="row">
        <div class="card">
        <h2>Followers: ${followers}</h2>
        <h2>Following: ${following}</h2>
        </div>
        <div class="card">
        <h2>Repos: ${repos}</h2>
        </div>
        </div>
        <div id="print-this">
        <button id ="print-this-btn">Print this resume</button>
        </div>
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
  