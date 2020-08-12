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
            const itrVals = [rec.file_name, rec.file_size, date, rec.status, rec.file_type];
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
        const fname = req.params.fname;
        const date = new Date();
        const { status, fileSize, fileType } = req.body;
        pool.query('UPDATE filesinfo SET status = $2, file_size = $3, last_modified = $4, file_type = $5 WHERE file_name = $1', [fname, status, fileSize, date, fileType], (error, results) => {
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
        const fname = req.params.fname
        pool.query('DELETE FROM filesinfo WHERE file_name = $1', [fname], (error, results) => {
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
        const ids = req.body.delIds;
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
router.put('/changeFile/:fname', changeFile);
router.delete('/deleteFile/:fname', deleteFile);
router.post('/deleteFiles', deleteFiles);

module.exports = router;