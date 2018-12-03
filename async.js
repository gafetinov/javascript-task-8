'use strict';

/**
 * Сделано задание на звездочку
 * Реализована остановка промиса по таймауту
 */
const isStar = true;

/** Функция паралелльно запускает указанное число промисов
 * @param {Function<Promise>[]} jobs – функции, которые возвращают промисы
 * @param {Number} parallelNum - число одновременно исполняющихся промисов
 * @param {Number} timeout - таймаут работы промиса
 * @returns {Promise<Array>}
 */
function runParallel(jobs, parallelNum, timeout = 1000) {
    return new Promise(resolve => {
        const results = new Array(jobs.length);
        let finished = 0;
        let started = 0;
        for (var i = 0; i < Math.min(parallelNum, jobs.length); i++) {
            run(i);
        }
        function run(num) {
            const callback = result => {
                results[num] = result;
                if (++finished !== jobs.length) {
                    run(++started);
                } else {
                    return resolve(results);
                }
            };
            promiseTimeout(jobs[num]())
                .then(callback, callback);
        }
    });
    function promiseTimeout(job) {
        return Promise.race([job,
            new Promise((resolve, reject) => {
                setTimeout(() => reject(new Error('Promise timeout')), timeout);
            })]);
    }
}

module.exports = {
    runParallel,

    isStar
};
