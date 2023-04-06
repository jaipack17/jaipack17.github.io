// Generate html pages from markdown

const fs = require("fs");
const p = require("path")
const hljs = require("highlight.js");
const md = require('markdown-it')({
    html: true,
    typographer: true,
    linkify: true,
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang,  }).value;
          } catch (__) {}
        }
    
        return '';
    },
});

// const topbar = `<div class="topbar">
// <div class="icons">
//     <a href="https://twitter.com/jaipack17" target="_blank" >
//         <img class="topbar-icon" alt="twitter" src="../twitter.png" />
//     </a>
//     <a href="https://github.com/jaipack17" target="_blank" >
//         <img class="topbar-icon" alt="github" src="https://www.nicepng.com/png/full/52-520535_free-files-github-github-icon-png-white.png" />
//     </a>
//     <a href="https://www.roblox.com/users/1659338449/profile" target="_blank" >
//         <img class="topbar-icon" alt="roblox" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Roblox_Logo.svg/1200px-Roblox_Logo.svg.png" />
//     </a>
//     <a href="https://editor.p5js.org/jaipack17/sketches" target="_blank" >
//         <img class="topbar-icon" alt="p5js" src="https://samplavigne.gallerycdn.vsassets.io/extensions/samplavigne/p5-vscode/1.2.8/1630607331209/Microsoft.VisualStudio.Services.Icons.Default" />
//     </a>
// </div>
// </div>
// <br/><br/><br/>`

const topbar = ``

const readingPath = "voyage-content";
const writingPath = "voyage";
const blogConfig = require("./blog-config.json");

function iterateThroughDirectory(path, task) {
    fs.readdir(path, function (err, files) {
        if (err) return console.log('Unable to scan directory: ' + err);
        files.forEach(function (file) {
            task(`${path}/${file}`, file);
        });
    });
}

function deleteFile(path, _name) {
    fs.unlink(p.join(__dirname.replace("tools", ""), path), (err) => {
        if (err) return console.log(err);
    });
}

function generateHTMLPage(path, name) {
    fs.readFile(path, (err, data) => {
        if (err) return console.log(err);
        let oldName = name;
        let newName = name.replace("md", "html");
        let fileContent = `<!DOCTYPE html><html lang="en">${blogConfig.head}<body>${topbar}<br/>
        <div class="blog-container" align="center">
        <a href="../voyage.html" style+"text-decoration: none">← Back</a>
        ${md.render(data.toString())}
        </div></body></html>`

        fs.writeFile(writingPath + "/" + newName, fileContent, (err) => {
            if (err) return console.log(err);
            console.log(`* Generated ${writingPath}/${newName} form ${readingPath}/${oldName}`);
        })
    })
}

iterateThroughDirectory(writingPath, deleteFile);
iterateThroughDirectory(readingPath, generateHTMLPage);
