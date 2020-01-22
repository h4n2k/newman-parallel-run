const path = require('path')
const async = require('async')
const newman = require('newman')
const beautify = require("json-beautify")

const PARALLEL_RUN_COUNT = 2

const parametersForTestRun = {
    collection: path.join(__dirname, 'postman/Sequence-Funding-Accept-Test-0.postman_collection.json'), // your collection
    environment: path.join(__dirname, 'postman/Wallex-Burhan-Local.postman_environment.json'), //your env
    reporters: 'json', // cli, json, junit, progress and emojitrain
    color: 'off' // on, off and auto
};

parallelCollectionRun = (done) => {
    newman.run(parametersForTestRun, done);
};

let commands = []
for (let index = 0; index < PARALLEL_RUN_COUNT; index++) {
    commands.push(parallelCollectionRun);
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
