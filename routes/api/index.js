"use strict";
const express = require("express");
const router = express.Router();

const ctrl = require("./ctrl.API");

// 게시글 목록 조회 API  http://localhost:3000/api/articles/list
router.get("/list", ctrl.show.list);

// 게시글 코멘트 목록 조회 API  - SP 예시
// http://localhost:3000/api/articles/comment?idx=2
// 또는 http://localhost:3000/api/articles/comment/2
router.get("/comment/", ctrl.show.comment);

// 프론트엔드에서 보내는 신규 게시글 등록 API 메소드  http://localhost:3000/api/articles/create
router.post("/create", ctrl.process.create);

// 게시글 정보를 수정하는 API 라우팅 메소드  http://localhost:3000/api/articles/update?idx=62
router.post("/update", ctrl.process.update);

// 게시글 삭제 처리 라우팅 메소드  http://localhost:3000/api/articles/delete?id=1
router.get("/delete", ctrl.process.delete);

// 단일 게시글 제공 API  http://localhost:3000/api/articles/1
router.get("/:idx", ctrl.show.listOne);

module.exports = router;
