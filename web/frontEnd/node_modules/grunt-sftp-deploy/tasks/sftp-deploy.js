//
// Grunt Task File
// ---------------
//
// Task: SFTP Deploy
// Description: Deploy code over SFTP
// Dependencies: ssh2
//

module.exports = function(grunt) {

  grunt.util = grunt.util || grunt.utils;

  var async = grunt.util.async;
  var log = grunt.log;
  var _ = grunt.util._;
  var file = grunt.file;
  var fs = require('fs');
  var path = require('path');
  var util = require('util');
  var SSHConnection = require('ssh2');

  var toTransfer;
  var sftpConn;
  var sshConn;
  var localRoot;
  var remoteRoot;
  var remoteSep;
  var currPath;
  var remotePath;
  var authVals;
  var exclusions;

  // A method for parsing the source location and storing the information into a suitably formated object
  function dirParseSync(startDir, result) {
    var files;
    var i;
    var tmpPath;
    var currFile;

    // initialize the `result` object if it is the first iteration
    if (result === undefined) {
      result = {};
      result[path.sep] = [];
    }

    // check if `startDir` is a valid location
    if (!fs.existsSync(startDir)) {
      grunt.warn(startDir + ' is not an existing location');
    }

    // iterate throught the contents of the `startDir` location of the current iteration
    files = fs.readdirSync(startDir);
    for (i = 0; i < files.length; i++) {
      currFile = startDir + path.sep + files[i];
      if (!file.isMatch({matchBase: true}, exclusions, currFile)) {
        if (file.isDir(currFile)) {
          tmpPath = path.relative(localRoot, startDir + path.sep + files[i]);
          if (!_.has(result, tmpPath)) {
            result[tmpPath] = [];
          }
          dirParseSync(currFile, result);
        } else {
          tmpPath = path.relative(localRoot, startDir);
          if (!tmpPath.length) {
            tmpPath = path.sep;
          }
          result[tmpPath].push(files[i]);
        }
      }
    }

    return result;
  }

  // A method for uploading a single file
  function sftpPut(inFilename, cb) {
    var fromFile, toFile, from, to;

    if (inFilename == '.gitignore') {
      cb(null);
      return true;
    }

    if(currPath.indexOf(path.sep) !== -1){
      remotePath = currPath.split(path.sep).join(remoteSep);
    }else{
      remotePath = currPath;
    }

    if (currPath !== path.sep) {
      fromFile = localRoot + path.sep + currPath + path.sep + inFilename;
      toFile = remoteRoot + remoteSep + remotePath + remoteSep + inFilename;
    } else {
      fromFile = localRoot + path.sep + inFilename;
      toFile = remoteRoot + remoteSep + inFilename;
    }
    // console.log(fromFile + ' to ' + toFile);
    log.write(fromFile + ' to ' + toFile);

    sftpConn.fastPut( fromFile, toFile, function(err){
      if (err){
        log.write((' Error uploading file: ' + err.message).red + '\n');
        cb(false);
      } else {
        log.write(' done'.green + '\n' );
        cb(null);
      }
    } );

//    from = fs.createReadStream(fromFile);
//    to = sftpConn.createWriteStream(toFile, {
//      flags: 'w',
//      mode: 0644
//    });
//    // var to = process.stdout;
//
//    from.on('data', function(){
//      // console.log('fs.data ', inFilename);
//      process.stdout.write('.');
//    });
//
//    from.on('close', function(){
////       console.log('fs.close from', inFilename);
//      // sftpConn.end();
//    });
//
//    to.on('close', function(){
//      // console.log('sftp.close to', inFilename);
//      process.stdout.write(' done'+"\n");
//      // sftpConn.end();
//      cb(null);
//    });
//
//    from.pipe(to);
  }

  // A method that processes a location - changes to a folder and uploads all respective files
  function sftpProcessLocation (inPath, cb) {
    if (!toTransfer[inPath]) {
      cb(new Error('Data for ' + inPath + ' not found'));
    }
    var files;

    currPath = inPath;
    files = toTransfer[inPath];

    if(inPath.indexOf(path.sep) !== -1){
      remoteInPath = inPath.split(path.sep).join(remoteSep);
    }else{
      remoteInPath = inPath;
    }

    remotePath = remoteRoot + (remoteInPath == remoteSep ? remoteInPath : remoteSep + remoteInPath);

    sftpConn.mkdir(remotePath, {mode: 0755}, function(err) {
      console.log('mkdir ' + remotePath, err ? 'error or dir exists' : 'ok');

      // console.log(async);
      async.forEachLimit(files, 1, sftpPut, function (err) {
        // console.log('callback');
        cb(null);
      });
    });
  }

  function getAuthByKey (inKey) {
    var tmpStr;
    var retVal = null;

    if (fs.existsSync('.ftppass')) {
      tmpStr = grunt.file.read('.ftppass');
      if (inKey !== null && tmpStr.length) retVal = JSON.parse(tmpStr)[inKey];
    }
    return retVal;
  }

  function getKeyLocation(customKey) {
    var keyLocation = null;
    var defaultKeys = [
      process.env.HOME + '/.ssh/id_dsa',
      process.env.HOME + '/.ssh/id_rsa'
    ];

    if (customKey) {
      if (fs.existsSync(customKey)) keyLocation = customKey;
    } else {
      for (i = 0; i < defaultKeys.length; i++) {
        if (fs.existsSync(defaultKeys[i])) keyLocation = defaultKeys[i];
      }
    }

    if (keyLocation === null) grunt.warn('Could not find private key.');
    return keyLocation;
  }

  // The main grunt task
  grunt.registerMultiTask('sftp-deploy', 'Deploy code over SFTP', function() {
    var done = this.async();
    var connection = {};
    var keyLocation;

    // Init
    sshConn = new SSHConnection();

    localRoot = Array.isArray(this.data.src) ? this.data.src[0] : this.data.src;
    remoteRoot = Array.isArray(this.data.dest) ? this.data.dest[0] : this.data.dest;
    remoteSep = this.data.server_sep ? this.data.server_sep : path.sep;

    authVals = getAuthByKey(this.data.auth.authKey);
    exclusions = this.data.exclusions || [];

    toTransfer = dirParseSync(localRoot);

    connection = {
      host: this.data.auth.host,
      port: this.data.auth.port
    };


    // Use either password or key-based login
    if (authVals === null) {
      grunt.warn('.ftppass seems to be missing or incomplete');
    } else {

      connection.username = authVals.username;

      if (authVals.password === undefined) {
        keyLocation = getKeyLocation(authVals.keyLocation);
        connection.privateKey = fs.readFileSync(keyLocation);
        if (authVals.passphrase) connection.passphrase = authVals.passphrase;
        log.ok('Logging in with key at ' + keyLocation);
      } else {
        connection.password = authVals.password;
        log.ok('Logging in with username ' + authVals.username);
      }

    }

    sshConn.connect(connection);

    sshConn.on('connect', function () {
      // console.log('Connection :: connect');
    });
    sshConn.on('error', function (err) {
      console.log('Connection :: error ::', err);
    });
    sshConn.on('end', function () {
      // console.log('Connection :: end');
    });
    sshConn.on('close', function (had_error) {
      // console.log('Connection :: close', had_error);
    });

    sshConn.on('ready', function () {
      // console.log('Connection :: ready');

      sshConn.sftp(function (err, sftp) {
        if (err) throw err;

        sftpConn = sftp;

        sftp.on('end', function () {
          // console.log('SFTP :: SFTP session closed');
          // console.trace();
        });
        sftp.on('close', function () {
          // console.log('SFTP :: close');
          // console.trace();
          sshConn.end();
        });
        sftp.on('error', function (e) {
          console.log('SFTP :: error', e);
          sshConn.end();
        });
        sftp.on('open', function (e) {
          // console.log('SFTP :: open');
        });

        var locations = _.keys(toTransfer);
        // console.dir(locations);

        // Iterating through all location from the `localRoot` in parallel
        async.forEachSeries(locations, sftpProcessLocation, function() {
          log.ok('Uploads done.');
          sftp.end();
          done();
        });

      });
    });

    if (grunt.errors) {
      return false;
    }
  });
};
