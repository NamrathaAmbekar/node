var url = require("url");
    fs = require("fs"),
    formidable = require("formidable");
function displayForm(response) {
    console.log("Request handler 'start' was called.");
    var body = '<html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" '+
        'content="text/html; charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload" multiple="multiple">'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write(body);
    response.end();
}
function upload(response, request) {
    console.log("Request handler 'upload' was called.");
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    var filename;
    form.uploadDir = __dirname + '/uploads/';
        form.on('file', function(field, file) {
        //rename the incoming file to the file's name
             filename = file.name;
            fs.rename(file.path, form.uploadDir + "/" + file.name);
        })
        .on('error', function(err) {
            console.log("an error has occured with form upload");
            console.log(err);
            request.resume();
        })
        .on('aborted', function(err) {
            console.log("user aborted upload");
        })
        .on('end', function() {
            console.log('-> upload done');
        });

    form.parse(request, function(error, fields, files) {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("The File "+filename+" is uploaded successfully!!!");
        response.end();
    });
}

function show(response,request){
    var queryData = url.parse(request.url, true).query;
    console.log(queryData.filename);
    displayFileContent(response,request,queryData.filename);

}
function displayFileContent(response,request,filename) {
    var filename =  __dirname + '/uploads/'+filename;
    console.log(filename)

    // This line opens the file as a readable stream
    var readStream = fs.createReadStream(filename);

    // This will wait until we know the readable stream is actually valid before piping
    readStream.on('open', function () {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("received file:<br/>");
        readStream.pipe(response);
    });

    readStream.on('error', function(err) {
        console.log(err);
        response.end("File Not Found");
    });
    console.log("Request handler 'show' was called.");
}
exports.displayForm = displayForm;
exports.upload = upload;
exports.show = show;