// 게시판(공지게시판, 블로그게시판, 문의게시판) 정보 관리 모델 모듈파일 정의
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("comment",
    {
      comment_idx: {
        type: DataTypes.INTEGER,   // 숫자형
        autoIncrement: true,       // 자동채번
        primaryKey: true,          // PK 컬럼으로 설정
        allowNull: false,
        comment: "댓글 고유번호",
      },
      article_idx: {
        type: DataTypes.INTEGER,    // 숫자형
        allowNull: false,
        comment: "게시글 고유번호",
      },
      comment: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        comment: "댓글내용",
      },
      regist_date: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "등록일시",
      },
      regist_userid: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: "등록자 아이디",
      },
    },
    {
      timestamps: false,
      paranoid: false,
    }
  );
};
