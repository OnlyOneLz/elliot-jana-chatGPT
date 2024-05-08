const express = require("express");
const router = express.Router();
const apiFetch = require("../controller/fetch");

router.post("/Api", apiFetch);

module.exports = router;
