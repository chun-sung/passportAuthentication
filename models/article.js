// 게시글 정보 관리 모델 모듈파일 정의
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("article",
    {
      article_idx: {
        type: DataTypes.INTEGER,  // 숫자형
        autoIncrement: true,      // 자동채번
        primaryKey: true,         // PK 컬럼으로 설정
        allowNull: false,
        comment: "게시글 고유번호",
      },
      board_idx: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "게시판 고유번호 -FK",
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "글제목",
      },
      contents: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "글내용",
      },
      view_cnt: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "조회수",
      },     
      display_yn: {
        type: DataTypes.STRING(1),
        allowNull: false,
        comment: "게시여부-Y or N",
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
      modify_date: {
        type: DataTypes.DATE,
        allowNull: true, // 최초 입력시 수정이 아니니 null 로 들어가야 함
        comment: "수정일시",
      },
      modify_userid: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "수정자아이디",
      },
    },
    {
      timestamps: false,
      paranoid: false,
    }
  );
};
