const express = require('express');
const multer = require('multer');

const router = new express.Router();

const upload = multer({dest: 'uploads'});

router.post('/', upload.single('filedata'), function(req, res, next) {
  const filedata = req.file;

  if (filedata) {
    res.json({status: 'success', data: {
      path: filedata.path,
    }});
  } else {
    res.json({
      status: 'error',
      errors: [{name: 'UploadError', message: 'Upload Error'}],
    });
  }
});

module.exports = router;
