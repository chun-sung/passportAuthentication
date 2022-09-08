"use strict";
const db = require("../../models");
var moment = require("moment");

const show = {
    boards: function (req, res, next) {
        res.send("boards");
    },
    list: async (req, res, next) => {
        if(!req.session.passport.user) {
            res.render('./home/notaccess', {nickName:'' } );
        } else {
            const articles = await db.Article.findAll();
            res.render("boards/list", { articles, moment, nickName: req.session.passport.user});          
        }
    },
    create: async (req, res, next) => {
        res.render("boards/create",{nickName:req.session.nickName});
    },
    modify: async (req, res, next) => {
        let article_idx = req.query.idx;

        let article = await db.Article.findOne({
            where: { article_idx: article_idx },
        });

        console.log("정보", article.display_yn);

        res.render("boards/modify", { article, nickName:req.session.nickName });

        // 조회수 업데이트
        let view = { view_cnt: article.view_cnt + 1 };
        let update_view_cnt = await db.Article.update(view, {
            where: { article_idx: article_idx },
        });
    },
};

const process = {
    create: async (req, res, next) => {
        let title = req.body.title;
        let contents = req.body.contents;
        let display = req.body.display;
        // let display_yn = req.body.display;
        let display_yn = "Y";
        // console.log(display_yn);

        const articleData = {
            board_idx: 1,
            title,
            contents,
            display_yn: display,
            view_cnt: 0,
            regist_date: Date.now(),
            regist_userid: "springstar",
        };

        const registArticleData = await db.Article.create(articleData);
        res.redirect("/boards/list");
    },
    update: async (req, res, next) => {
        let articleIdx = req.body.article_idx;
        let updateArticle = {
            title: req.body.title,
            contents: req.body.contents,
            modify_date: Date.now(),
            modify_userid: "ADMIN",
            display_yn: req.body.display,
        };
        db.Article.update(updateArticle, {
            where: { article_idx: articleIdx },
        });
        res.redirect("/boards/list");
    },
    delete: async (req, res) => {
        let articleIdx = req.query.idx;
        let deletedCnt = await db.Article.destroy({
            where: { article_idx: articleIdx },
        });
        res.redirect("/boards/list");
    },
};

module.exports = {
    show,
    process,
};
