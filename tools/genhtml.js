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
    }
});

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
        let fileContent = `<!DOCTYPE html><html lang="en">${blogConfig.head}<body><div class="blog-container" align="center">${md.render(data.toString())}</div></body></html>`

        fs.writeFile(writingPath + "/" + newName, fileContent, (err) => {
            if (err) return console.log(err);
            console.log(`* Generated ${writingPath}/${newName} form ${readingPath}/${oldName}`);
        })
    })
}

iterateThroughDirectory(writingPath, deleteFile);
iterateThroughDirectory(readingPath, generateHTMLPage);
