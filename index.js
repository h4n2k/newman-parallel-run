const path = require('path')
const async = require('async')
const newman = require('newman')
const beautify = require('json-beautify')

const PARALLEL_RUN_COUNT = 10

const parametersForTestRun = {
    collection: path.join(__dirname, 'postman/Test-Concurrent-Request-Context.postman_collection_user.json'), // your collection
    environment: path.join(__dirname, 'postman/B2B2X-Local.postman_environment.json'), //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

const parametersForTestRun2 = {
    collection: path.join(__dirname, 'postman/Test-Concurrent-Request-Context.postman_collection_admin.json'), // your collection
    environment: path.join(__dirname, 'postman/B2B2X-Local.postman_environment.json'), //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

const parametersForTestRun3 = {
    collection: path.join(__dirname, 'postman/Test-Concurrent-Request-Context.postman_collection_user2.json'), // your collection
    environment: path.join(__dirname, 'postman/B2B2X-Local.postman_environment.json'), //your env
    // reporters: 'json', // cli, json, junit, progress and emojitrain
    reporters: 'cli', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};


let parallelCollectionRun = (done) => {
    newman.run(parametersForTestRun, done);
};

let parallelCollectionRun2 = (done) => {
    newman.run(parametersForTestRun2, done);
};

let parallelCollectionRun3 = (done) => {
    newman.run(parametersForTestRun3, done);
};


// let commands = [ 
//     parallelCollectionRun, 
//     parallelCollectionRun2 
// ];
let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
    commands.push(parallelCollectionRun2);
    commands.push(parallelCollectionRun3);
}


// Runs the Postman sample collection thrice, in parallel.
async.parallel(
    commands,
    (err, results) => {
        err && console.error(err);

        // console.log('>>>>> result: ', results);

        results.forEach((result) => {

            // console.log('>>>> result e: ', result.run.executions);

            result.run.executions.forEach(execution => {

                // console.log('>>>> execution: ', execution);
                // console.log('>>> response: ', execution.response.stream.toString());
                console.log('>>> request: ');
                // console.log(execution.request);
                console.log(`${execution.request.url.protocol}://${execution.request.url.host.join('.')}:${execution.request.url.port}/${execution.request.url.path.join('/')}`);
                console.log('>>> response: ');
                // console.log(execution.response.stream.toString());
                let result =  JSON.parse(execution.response.stream.toString());
                // console.log('result: ', result);
                console.log(beautify(result, null, 2, 100));
            });

            let failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
        });
    });
