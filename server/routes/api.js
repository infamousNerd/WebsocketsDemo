const express = require('express');
const router = express.Router();
const Pool = require('pg').Pool
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
/* GET home page. */
router.get('/', getLandingData);
router.post('/addFile', addFile);
router.put('/changeFile/:id', changeFile);
router.delete('/deleteFile/:id', deleteFile);

module.exports = router;