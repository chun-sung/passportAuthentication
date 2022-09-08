// 게시글 정보 관리 모델 모듈파일 정의
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("member",
    {
      member_idx: {
        type: DataTypes.INTEGER,  // 숫자형
        autoIncrement: true,      // 자동채번
        primaryKey: true,         // PK 컬럼으로 설정
        allowNull: false,
        comment: "회원 고유번호",
      },
      user_id: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "회원의 아이디",
      },
      password: {
        type: DataTypes.STRING(200),
        allowNull: false,
        comment: "회워의 비밀번호",
      },     
      nickName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        comment: "회원의 닉네임",
      },
    },
    {
      timestamps: true,
      paranoid: true,
    }
  );
};
