const {replace_string, get_answer} = require('./helper');

const BASE_LINK = "http://www.bsoftnamkam.xyz/japaneselisten/";
var fs = require('fs');
var Excel = require('exceljs');
var workbook = new Excel.Workbook();

// create a new sheet writer with pageSetup settings for fit-to-page
var worksheetWriter = workbook.addWorksheet('My Sheet');

// adjust pageSetup settings afterwards
worksheetWriter.pageSetup.margins = {
    left: 0.7, right: 0.7,
    top: 0.75, bottom: 0.75,
    header: 0.3, footer: 0.3
};

// Set Print Area for a sheet
worksheetWriter.pageSetup.printArea = 'A1:G20';

// Repeat specific rows on every printed page
worksheetWriter.pageSetup.printTitlesRow = '1:3';

worksheetWriter.columns = [
    {header: 'Question', key: 'question', width: 50},
    {header: 'answer1', key: 'answer1', width: 10},
    {header: 'Explain', key: 'explain', width: 50},
    {header: 'answer2', key: 'answer2', width: 10},
    {header: 'answer3', key: 'answer3', width: 10},
    {header: 'answer4', key: 'answer4', width: 10},
    {header: 'mp3link', key: 'mp3link', width: 10},
];

fs.readFile('./data/part' + process.argv[2] + '.json', 'utf8', function (err, data) {
    if (err) throw err; // we'll not consider error handling for now
    var obj = JSON.parse(data.toString());//:)) done, dm ddaij luc nay m thay kieu lol gi vay????
    // console.log("asdf");
    console.log(obj);
    obj.forEach(function (object) {
        var content = object.content;
        var anscontent = object.anscontent;
        var answer = object.answer;
        var explain = object.explain;
        var mp3link = BASE_LINK.concat(object.mp3link);

        // var content = obj[0].content;
        // var anscontent = obj[0].anscontent;
        // var answer = obj[0].answer;
        // var explain = obj[0].explain;
        // var mp3link = BASE_LINK.concat(obj[0].mp3link);
        var answer1, answer2, answer3, answer4, question;

        explain = replace_string(explain, "newline");
        content = replace_string(content, "newline");
        answer1 = get_answer("１", content);
        answer2 = get_answer("２", content);
        answer3 = get_answer("３", content);
        answer4 = get_answer("４", content);
        question = content.replace(answer1, "").replace(answer2, "").replace(answer3, "").replace(answer4, "").trim();
        // question = "#." + question;
        explain = "$b." + question + anscontent + explain;
        // console.log(answer);
        // console.log(mp3link);

        if (answer1.includes(answer)) {
            answer1 = answer1.replace("１", "*.");
            answer2 = answer2.replace("２", "");
            answer3 = answer3.replace("３", "");
            answer4 = answer4.replace("４", "");
        } else if (answer2.includes(answer)) {
            answer2 = answer2.replace("２", "*.");
            answer1 = answer1.replace("１", "");
            answer3 = answer3.replace("３", "");
            answer4 = answer4.replace("４", "");
            [answer2, answer1] = [answer1, answer2];
        } else if (answer3.includes(answer)) {
            answer3 = answer3.replace("３", "*.");
            answer2 = answer2.replace("２", "");
            answer1 = answer1.replace("１", "");
            answer4 = answer4.replace("４", "");
            [answer3, answer1] = [answer1, answer3];
        } else {
            answer4 = answer4.replace("４", "*.");
            answer2 = answer2.replace("２", "");
            answer3 = answer3.replace("３", "");
            answer1 = answer1.replace("１", "");
            [answer4, answer1] = [answer1, answer4];
        }
        console.log(question);
        console.log(answer1);
        console.log(answer2);
        console.log(answer3);
        console.log(answer4);

        worksheetWriter.addRow(
            {
                question: "#.",
                answer1: answer1,
                explain: explain,
                answer2: answer2,
                answer3: answer3,
                answer4: answer4,
                mp3link: mp3link
            });
        worksheetWriter.addRow(
            {
                question: "",
                answer1: "",
                explain: "",
                answer2: "",
                answer3: "",
                answer4: "",
                mp3link: ""
            });
    });
    workbook.xlsx.writeFile('part' + process.argv[2] + '.xlsx')
        .then(function () {
            console.log('ok');
        });

});
