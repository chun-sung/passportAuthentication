"use strict";
const db = require("../../models");

const show = {
    list: async (req, res, next) => {
        let articleList = await db.Article.findAll();
        res.json(articleList);
    },
    listOne: async (req, res) => {
        var articleIdx = req.params.idx;
        var article = await db.Article.findOne({
            where: { article_idx: articleIdx },
        });
        res.json(article);
    },
    comment: async (req, res, next) => {
        var commentList = await db.sequelize.query(
            //직접 SQL 또는  SP를 호출합니다.
            "CALL SP_GET_COMMENTS(:P_ARTICLE_IDX)",
            {
                replacements: {
                    P_ARTICLE_IDX: req.query.idx, // 쿼리로 전달되는 idx 값
                },
            }
        );
        res.json(commentList);
    },
};

const process = {
    create: async (req, res) => {
        //클라이언트에서 보내준 게시글 정보
        var article = {
            board_idx: req.body.board_idx,
            title: req.body.title,
            contents: req.body.contents,
            view_cnt: 0,
            display_yn: "Y",
            regist_date: Date.now(),
            regist_userid: req.body.regist_userid,
        };
        var registedArticle = await db.Article.create(article);

        //신규 등록된 최종 데이터를 호출한 클라이언트에 json 데이터로 제공
        res.json(registedArticle);
    },

    // 게시글 수정 http://localhost:3000/api/articles/update?idx=62
    update: async (req, res) => {
        var updateArticle = {
            title: req.body.title,
            contents: req.body.contents,
            display_yn: req.body.display_yn,
            modify_date: Date.now(),
            modify_userid: req.body.modify_userid,
        };

        var updateCnt = await db.Article.update(updateArticle, {
            where: { article_idx: req.query.idx }, // 게시글 번호 확인
        });

        var result = {
            result: "ok",
            code: "200",
            data: "수정완료",
        };
        res.json(result);
    },
    delete: async (req, res) => {
        // 삭제하려는 사용자의 고유번호 추출
        let userIdx = req.query.idx;
        const deletedCnt = await db.Article.destroy({
            where: { article_idx: userIdx },
        });
        res.json({
            result: "OK",
            code: 200,
            data: deletedCnt + " 건이 삭제되었습니다.",
        });
    },
};

module.exports = {
    show,
    process,
};
