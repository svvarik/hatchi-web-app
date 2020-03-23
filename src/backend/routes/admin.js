var express = require('express');
var router = express.Router();

/* get admin page */
router.get('/admin', (req, res) => {
    res.send('admin');
} )

module.exports = router;