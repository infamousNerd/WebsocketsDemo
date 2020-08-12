const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool;
const queryFormat = require('pg-format');
const pool = new Pool({
  user: 'chava',
  host: 'localhost',
  database: 'files',
  password: 'bavagadu',
  port: 5432,
});
const delIds = [1,2,3,4,5,6,7,8];
// const router = express.Router();
function dataFetch () {
    return new Promise((res, rej) => {
        pool.query('SELECT * FROM filesinfo ORDER BY id ASC', (error, results) => {
            if (error) {
                rej(error);
            }
            res(results.rows);
        });
    });
} 
function getLandingData(req, res, next) {
   return dataFetch().then(rows => {
       res.json(rows);
   }).catch(err => {
       res.status(500).json(err);
   });
}
function addFile(req, res, next) {
    return new Promise((res, rej) => {
        const { file_name, status  } = req.body;
        pool.query('INSERT INTO filesinfo (file_name, status) VALUES ($1, $2)', [file_name, status], (error, results) => {
            if (error) {
              rej(error);
            }
            res(results);
        });
    })
    .then(dataFetch)
    .then(rows => {
        res.locals.newData = rows;
        next();
    }).catch(err => {
        res.status(500).json(err);
    });
}
function addFiles(req, res, next) {
    return new Promise((res, rej) => {
        const newRecords = req.body.addRecs && req.body.addRecs.length ? req.body.addRecs : require('../../addRecords.json').addRecords;
        const values = [];
        newRecords.forEach(rec => {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDay();
            const hours = date.getHours();
            const minutes = date.getMinuites();
            const seconds = date.getSeconds();
            const milliseconds = date.getMilliseconds();
            const lastModified = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds + '.' + milliseconds;
            const itrVals = [rec.file_name, rec.file_size, lastModified, rec.status, rec.file_type];
            values.push(itrVals);
        });
        const addFilesQuery = queryFormat('INSERT INTO filesinfo (file_name, file_size, last_modified, status, file_type) VALUES %L', values);
        pool.query(addFilesQuery, (error, results) => {
            if (error) {
              rej(error);
            }
            res(results);
        });
    })
    .then(dataFetch)
    .then(rows => {
        res.locals.newData = rows;
        next();
    }).catch(err => {
        res.status(500).json(err);
    });
}
function changeFile(req, res, next) {
    return new Promise((res, rej) => {
        const id = parseInt(req.params.id)
        const { file_name, status  } = req.body;
        pool.query('UPDATE filesinfo SET file_name = $1, status = $2 WHERE id = $3', [file_name, status, id], (error, results) => {
            if (error) {
              rej(error);
            } 
            res(results);
        });
    })
    .then(dataFetch)
    .then(rows => {
        res.locals.newData = rows;
        next();
    }).catch(err => {
        res.status(500).json(err);
    });
}
function deleteFile(req, res, next) {
    return new Promise((res, rej) => {
        const id = parseInt(req.params.id)
        pool.query('DELETE FROM filesinfo WHERE id = $1', [id], (error, results) => {
            if (error) {
              rej(error);
            }
            res(results);
        });
    })
    .then(dataFetch)
    .then(rows => {
        res.locals.newData = rows;
        next();
    }).catch(err => {
        res.status(500).json(err);
    });
}
function deleteFiles(req, res, next) {
    return new Promise((res, rej) => {
        const ids = (req.body.delIds && req.body.delIds.length) ? req.body.delIds : delIds;
        const delQuery = queryFormat('DELETE FROM filesinfo WHERE id IN %L', [ids]);
        pool.query(delQuery, (error, results) => {
            if (error) {
              rej(error);
            }
            res(results);
        });
    })
    .then(dataFetch)
    .then(rows => {
        res.locals.newData = rows;
        next();
    }).catch(err => {
        res.status(500).json(err);
    });
}
/* GET home page. */
router.get('/', getLandingData);
router.post('/addFile', addFile);
router.post('/addFiles', addFiles);
router.put('/changeFile/:id', changeFile);
router.delete('/deleteFile/:id', deleteFile);
router.post('/deleteFiles', deleteFiles);

module.exports = router;