-- 테이블 순서는 관계를 고려하여 한 번에 실행해도 에러가 발생하지 않게 정렬되었습니다.

-- Cafe Table Create SQL
CREATE TABLE Cafe
(
    `cafeId`               INT                NOT NULL    AUTO_INCREMENT COMMENT '카페 아이디',
    `cafeName`             VARCHAR(45)        NOT NULL    COMMENT '카페 이름',
    `cafeLocation`         VARCHAR(45)        NOT NULL    COMMENT '카페 위치 (주소)',
    `cafeInfo`             TEXT               NOT NULL    COMMENT '카페 설명',
    `cafeFee`              TEXT               NOT NULL    COMMENT '카페 요금',
    `cafeLatitude`         DECIMAL(20, 20)    NOT NULL    COMMENT '거리 계산에 사용',
    `cafeHardness`         DECIMAL(20, 20)    NOT NULL    COMMENT '거리 계산에 사용',
    `createdAt`            TIMESTAMP          NOT NULL    COMMENT '생성 시기',
    `updatedAt`            TIMESTAMP          NULL        COMMENT '업데이트 시기',
    `cafeStar`             TINYINT            NULL        COMMENT '모든 별점 합 / 리뷰 수',
    `cafePhoneNumber`      VARCHAR(20)        NULL        COMMENT '카페 전화번호',
    `cafeReservationPage`  VARCHAR(100)       NULL        COMMENT '카페 예약페이지',
    `cafelocationImgUrl`   VARCHAR(100)       NULL        COMMENT '카페 지도 이미지',
    `isDeleted`            CHAR(1)            NOT NULL    DEFAULT 'N' COMMENT 'N : 미삭제, Y : 삭제',
    `cafeHomePage`         VARCHAR(100)       NULL        COMMENT '카페 홈페이지',
    `cafeInfoOneLine`      VARCHAR(100)       NOT NULL    COMMENT '카페 한줄 소개',
    `isPremium`            CHAR(1)            NOT NULL    DEFAULT 'N' COMMENT 'Y : 프리미엄 N: 프리미엄 아님',
    PRIMARY KEY (cafeId)
);

ALTER TABLE Cafe COMMENT '방탈출 카페 테이블';


-- Cafe Table Create SQL
CREATE TABLE User
(
    `userId`                 INT                NOT NULL    COMMENT '사용자 아이디',
    `userName`               VARCHAR(45)        NOT NULL    COMMENT '사용자 닉네임',
    `userReviewCount`        TINYINT            NOT NULL    COMMENT '사용자 리뷰 카운트',
    `userInfoOpen`           CHAR(1)            NOT NULL    DEFAULT 'Y' COMMENT 'N : 비공개, Y: 공개',
    `userPushAlarm`          CHAR(1)            NOT NULL    DEFAULT 'Y' COMMENT 'N : 비동의, Y: 동의',
    `userPassword`           VARCHAR(45)        NOT NULL    COMMENT '사용자 패스워드',
    `userPoint`              INT                NULL        COMMENT '사용자 포인트',
    `userLatitude`           DECIMAL(20, 20)    NOT NULL    COMMENT '거리 계산에 사용',
    `userHardness`           DECIMAL(20, 20)    NOT NULL    COMMENT '거리 계산에 사용',
    `createdAt`              TIMESTAMP          NOT NULL    COMMENT '생성 시기',
    `updatedAt`              TIMESTAMP          NULL        COMMENT '업데이트 시기',
    `isDeleted`              CHAR(1)            NOT NULL    DEFAULT 'N' COMMENT 'N : 미삭제, Y : 삭제',
    `userImageUrl`           VARCHAR(100)       NOT NULL    DEFAULT 'https://aquerytool.com/' COMMENT '미설정시 앱 이미지url',
    `userSuccessRecordOpen`  CHAR(1)            NOT NULL    DEFAULT 'Y' COMMENT 'N : 비공개, Y: 공개',
    PRIMARY KEY (userId)
);

ALTER TABLE User COMMENT '사용자 테이블';


-- Cafe Table Create SQL
CREATE TABLE Theme
(
    `themeId`          INT             NOT NULL    COMMENT '테마 아이디',
    `themeName`        VARCHAR(45)     NOT NULL    COMMENT '테마 이름',
    `themeInfo`        TEXT            NOT NULL    COMMENT '테마 소개(정보)',
    `themeDifficulty`  TINYINT         NOT NULL    COMMENT '0:매우쉬움, 1:쉬움, 2:보통 3:어려움, 4:아주어려움',
    `createdAt`        TIMESTAMP       NOT NULL    COMMENT '생성 시기',
    `updatedAt`        TIMESTAMP       NULL        COMMENT '업데이트 시기',
    `themeStar`        INT             NULL        COMMENT '모든 별점 합 / 리뷰 수',
    `themeActivity`    TINYINT         NOT NULL    COMMENT '낮은 숫자일 수록 활동성 적음',
    `themeDevice`      TINYINT         NOT NULL    COMMENT '0:자물쇠 위주, 1:장치 위주, 2:혼합',
    `themeImgUrl`      VARCHAR(100)    NOT NULL    COMMENT '테마 이미지 url',
    `cafeId`           INT             NOT NULL    COMMENT '카페 아이디',
    `isDeleted`        CHAR(1)         NOT NULL    DEFAULT 'N' COMMENT 'N : 미삭제, Y : 삭제',
    `timeLimit`        INT             NOT NULL    DEFAULT 60 COMMENT '단위 : 분',
    PRIMARY KEY (themeId)
);

ALTER TABLE Theme COMMENT '방탈출 테마 정보';

ALTER TABLE Theme
    ADD CONSTRAINT FK_Theme_cafeId_Cafe_cafeId FOREIGN KEY (cafeId)
        REFERENCES Cafe (cafeId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE ThemeReview
(
    `reviewId`                 INT          NOT NULL    AUTO_INCREMENT COMMENT '리뷰 아이디',
    `content`                  TEXT         NOT NULL    COMMENT '리뷰 내용',
    `createdAt`                TIMESTAMP    NOT NULL    COMMENT '생성 시기',
    `updatedAt`                TIMESTAMP    NULL        COMMENT '업데이트 시기',
    `likeCount`                TINYINT      NOT NULL    DEFAULT 0 COMMENT '좋아요 수',
    `themeStar`                TINYINT      NOT NULL    COMMENT '테마 별점',
    `themeDifficulty`          TINYINT      NOT NULL    COMMENT '0:매우쉬움, 1:쉬움, 2:보통 3:어려움, 4:아주어려움',
    `useHintCount`             TINYINT      NULL        DEFAULT 0 COMMENT '사용 힌트 수',
    `userId`                   INT          NOT NULL    COMMENT '사용자 아이디',
    `themeId`                  INT          NOT NULL    COMMENT '테마 아이디',
    `escapeSuccess`            CHAR(1)      NOT NULL    COMMENT 'N : 실패 Y : 성공',
    `remainTime`               INT          NULL        COMMENT '남은 시간',
    `escapeSuccessWithNoHint`  CHAR(1)      NOT NULL    COMMENT 'N : 실패 Y : 성공',
    PRIMARY KEY (reviewId)
);

ALTER TABLE ThemeReview COMMENT '방탈출 테마 리뷰';

ALTER TABLE ThemeReview
    ADD CONSTRAINT FK_ThemeReview_themeId_Theme_themeId FOREIGN KEY (themeId)
        REFERENCES Theme (themeId) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE ThemeReview
    ADD CONSTRAINT FK_ThemeReview_userId_User_userId FOREIGN KEY (userId)
        REFERENCES User (userId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE CafeReview
(
    `reviewId`   INT          NOT NULL    AUTO_INCREMENT COMMENT '리뷰 아이디',
    `content`    TEXT         NOT NULL    COMMENT '리뷰 내용',
    `createdAt`  TIMESTAMP    NOT NULL    COMMENT '생성 시기',
    `updatedAt`  TIMESTAMP    NULL        COMMENT '업데이트 시기',
    `cafeStar`   TINYINT      NOT NULL    COMMENT '별점 0 - 5점',
    `userId`     INT          NOT NULL    COMMENT '사용자 아이디',
    `cafeId`     INT          NOT NULL    COMMENT '카페 아이디',
    PRIMARY KEY (reviewId)
);

ALTER TABLE CafeReview COMMENT '방탈출 카페 리뷰 테이블';

ALTER TABLE CafeReview
    ADD CONSTRAINT FK_CafeReview_cafeId_Cafe_cafeId FOREIGN KEY (cafeId)
        REFERENCES Cafe (cafeId) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE CafeReview
    ADD CONSTRAINT FK_CafeReview_userId_User_userId FOREIGN KEY (userId)
        REFERENCES User (userId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE UserEscapeRecord
(
    `userEsacpeRecordId`  INT        NOT NULL    AUTO_INCREMENT COMMENT '탈출일지 아이디',
    `userId`              INT        NOT NULL    COMMENT '사용자 아이디',
    `reviewId`            INT        NOT NULL    COMMENT '리뷰 아이디',
    `reviewCount`         TINYINT    NOT NULL    DEFAULT 0 COMMENT '총 리뷰 수',
    `successRate`         FLOAT      NULL        DEFAULT 0 COMMENT '성공 횟수(성공률)',
    `noHintSuccessRate`   FLOAT      NULL        DEFAULT 0 COMMENT '노 힌트 횟수(성공률)',
    PRIMARY KEY (userEsacpeRecordId)
);

ALTER TABLE UserEscapeRecord COMMENT '사용자 탈출 일지';

ALTER TABLE UserEscapeRecord
    ADD CONSTRAINT FK_UserEscapeRecord_reviewId_ThemeReview_reviewId FOREIGN KEY (reviewId)
        REFERENCES ThemeReview (reviewId) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE UserEscapeRecord
    ADD CONSTRAINT FK_UserEscapeRecord_userId_User_userId FOREIGN KEY (userId)
        REFERENCES User (userId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE Hearted
(
    `userId`   INT    NOT NULL    COMMENT '사용자 아이디',
    `cafeId`   INT    NOT NULL    COMMENT '찜한 카페 아이디',
    `themeId`  INT    NOT NULL    COMMENT '찜한 테마 아아디',
    PRIMARY KEY (userId)
);

ALTER TABLE Hearted COMMENT '찜한 카페, 아이디';

ALTER TABLE Hearted
    ADD CONSTRAINT FK_Hearted_userId_User_userId FOREIGN KEY (userId)
        REFERENCES User (userId) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE Hearted
    ADD CONSTRAINT FK_Hearted_cafeId_Cafe_cafeId FOREIGN KEY (cafeId)
        REFERENCES Cafe (cafeId) ON DELETE RESTRICT ON UPDATE RESTRICT;

ALTER TABLE Hearted
    ADD CONSTRAINT FK_Hearted_themeId_Theme_themeId FOREIGN KEY (themeId)
        REFERENCES Theme (themeId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE ThemeGenre
(
    `themeId`  INT            NOT NULL    COMMENT '테마 아이디',
    `genre`    VARCHAR(20)    NOT NULL    COMMENT '장르',
    PRIMARY KEY (themeId)
);

ALTER TABLE ThemeGenre COMMENT '테마 장르, 하나의 테마가 여러개의 장르를 가질 수 있음.';

ALTER TABLE ThemeGenre
    ADD CONSTRAINT FK_ThemeGenre_themeId_Theme_themeId FOREIGN KEY (themeId)
        REFERENCES Theme (themeId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE cafeImg
(
    `cafeId`        INT             NOT NULL    COMMENT '카페 아이디',
    `cafeImageUrl`  VARCHAR(100)    NOT NULL    COMMENT '카페 이미지 url',
    PRIMARY KEY (cafeId)
);

ALTER TABLE cafeImg COMMENT '카페 이미지 테이블, 하나의 카페의 이미지가 여러개 있을 수 있음';

ALTER TABLE cafeImg
    ADD CONSTRAINT FK_cafeImg_cafeId_Cafe_cafeId FOREIGN KEY (cafeId)
        REFERENCES Cafe (cafeId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE Notice
(
    `noticeId`       INT            NOT NULL    AUTO_INCREMENT COMMENT '공지사항 아이디',
    `noticeName`     VARCHAR(45)    NOT NULL    COMMENT '공지사항 이름',
    `noticeContent`  TEXT           NOT NULL    COMMENT '공지사항 내용',
    `createdAt`      TIMESTAMP      NOT NULL    COMMENT '생성 시기',
    `updatedAt`      TIMESTAMP      NULL        COMMENT '업데이트 시기',
    PRIMARY KEY (noticeId)
);

ALTER TABLE Notice COMMENT '공지사항 테이블';


-- Cafe Table Create SQL
CREATE TABLE RecommendedPersonnel
(
    `themeId`         INT        NOT NULL    COMMENT '테마 아이디',
    `themePersonnel`  TINYINT    NULL        COMMENT '테마 권장인원',
    PRIMARY KEY (themeId)
);

ALTER TABLE RecommendedPersonnel COMMENT '권장인원, 권장인원 수는 중복 될 수 있음.';

ALTER TABLE RecommendedPersonnel
    ADD CONSTRAINT FK_RecommendedPersonnel_themeId_Theme_themeId FOREIGN KEY (themeId)
        REFERENCES Theme (themeId) ON DELETE RESTRICT ON UPDATE RESTRICT;


-- Cafe Table Create SQL
CREATE TABLE Event
(
    `eventId`      INT             NOT NULL    AUTO_INCREMENT COMMENT '이벤트 아이디',
    `eventName`    VARCHAR(100)    NOT NULL    COMMENT '이벤트명',
    `eventImgUrl`  VARCHAR(100)    NOT NULL    COMMENT '이벤트 이미지 주소',
    `eventPage`    VARCHAR(100)    NOT NULL    COMMENT '이벤트 페이지 주소',
    `isDeleted`    CHAR(1)         NOT NULL    DEFAULT 'N' COMMENT 'N : 미삭제, Y : 삭제',
    `createdAt`    TIMESTAMP       NOT NULL    COMMENT '생성 시기',
    `updatedAt`    TIMESTAMP       NULL        COMMENT '업데이트 시기',
    PRIMARY KEY (eventId)
);

ALTER TABLE Event COMMENT '메인페이지의 이벤트 테이블';

select * from Cafe;

-- 거리를 계산하는 쿼리

SELECT

    (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)

    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))

    AS distance

FROM Cafe,User

-- HAVING distance <= (이 값을 지정하면 특정거리 이하만 출력하게 할 수 있음)

ORDER BY distance;

-- 페이지 1 쿼리
select themeId,themeName as '테마 \이름',
   (case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
    )as '테마 난이도',

       timeLimit as '테마 제한시간',
       themeStar as '테마 평균별점',
   (case
        when themeActivity = '0' then '낮음'
        when themeActivity = '1' then '보통'
        when themeActivity = '2' then '높음'
        when themeActivity = '3' then '매우 높음'
        end
   )as '테마 활동성',
   (case
        when themeDevice = '0' then '자물쇠 위주'
        when themeDevice = '1' then '장치 위주'
        when themeDevice = '2' then '혼합'
        end
   )as '테마 장치',
       themeImgUrl as '테마 이미지'
from Theme;

select Theme.themeId,themeName as '테마 \이름',genre as '장르' from ThemeGenre
inner join Theme on Theme.themeId = ThemeGenre.themeId
;

select RecommendedPersonnel.themeId,themeName as '테마 \이름',
    (case
        when themePersonnel = '1' then '1인'
        when themePersonnel = '2' then '2인'
        when themePersonnel = '3' then '3인'
        when themePersonnel = '4' then '4인'
        else 'error'
        end
   )as '테마 권장인원'
from RecommendedPersonnel
inner join Theme on Theme.themeId = RecommendedPersonnel.themeId
;

-- 페이지 2 쿼리
select themeId,themeName as '테미 \이름',
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as '테마 난이도',
timeLimit as '제한 시간',themeImgUrl as '테마 이미지',
(case
        when themeActivity = '0' then '낮음'
        when themeActivity = '1' then '보통'
        when themeActivity = '2' then '높음'
        when themeActivity = '3' then '매우 높음'
        end
)as '테마 활동성',
(case
        when themeDevice = '0' then '자물쇠 위주'
        when themeDevice = '1' then '장치 위주'
        when themeDevice = '2' then '혼합'
        end
)as '테마 장치',
themeInfo as '테마 소개',themeStar as '테마 별점'
from Theme
;
select
    Hearted.themeId
as '찜한 \테마'
from Hearted
inner join Theme
inner join User
where User.userId='1'  -- 유저 1기준
And Hearted.themeId =Theme.themeId;

select ThemeGenre.themeId,themeName as '테마 \이름',genre as '장르' from ThemeGenre
inner join Theme on Theme.themeId = ThemeGenre.themeId;

select Theme.themeId,themeName as '테마 \이름',
    (case
        when themePersonnel = '1' then '1인'
        when themePersonnel = '2' then '2인'
        when themePersonnel = '3' then '3인'
        when themePersonnel = '4' then '4인'
        else 'error'
        end
   )as '테마 권장인원'
from RecommendedPersonnel
inner join Theme on Theme.themeId = RecommendedPersonnel.themeId
;

-- 테마 리뷰
select content as 내용 ,
       date_format(ThemeReview.createdAt,'%Y.%m.%d')as '생성 \시간',

       likeCount as '좋아요 수',themeStar as '테마 별점',
       (case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as '테마 난이도',
    useHintCount as '사용힌트 수', userName as '사용자 닉네임',
    escapeSuccess as '성공여부', remainTime as '남은 시간',userReviewCount as '메달', themeId
from ThemeReview
inner join User on User.userId = ThemeReview.userId
where themeId = '3'
order by ThemeReview.createdAt desc;


-- 카페 검색
select cafeId,cafeName ,cafeStar ,isPremium ,
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS 'cafeDistance',cafeImgUrl,isHearted

FROM Cafe
inner join User on User.userId = '1';

-- 카페 상세 정보 (유저 1 기준) --테마는 따로 빼는게 좋을지 고민  -- 수정해서 이를 두개로 나눴음.
select Cafe.cafeId,cafeName ,cafeStar,
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS 'cafefDistance',
       cafeImgUrl,cafeInfoOneLine,
       cafeInfo,cafeFee,cafeLocation,
       cafelocationImgUrl, cafePhoneNumber,
       cafeReservationPage,
themeName,
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as 'themeDifficulty', themeImgUrl, themeStar

FROM Cafe
inner join User on User.userId = '1'
inner join Theme on Theme.cafeId = Cafe.cafeId;

-- 카페 상세 정보
select Cafe.cafeId,cafeName ,cafeStar,
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS 'cafefDistance',
       cafeImgUrl,cafeInfoOneLine,
       cafeInfo,cafeFee,cafeLocation,
       cafelocationImgUrl, cafePhoneNumber,
       cafeReservationPage

FROM Cafe
inner join User on User.userId = '1';
-- 카페 상세 정보 -- 카페 테마 정보
select themeName,
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as 'themeDifficulty', themeImgUrl, themeStar,themeGenre

FROM Theme where cafeId = '1';


-- 카페리뷰 더보기
select reviewId,User.userId,CafeReview.cafeId,
       cafeName as '카페이름',
       content as '내용', date_format(CafeReview.createdAt,'%Y.%m.%d')as '생성 \시간',
       CafeReview.cafeStar as '카페 벌점',User.userName as '사용자 이름'

       from CafeReview
inner join User on User.userId = CafeReview.userId
inner join Cafe on Cafe.cafeId = CafeReview.cafeId
order by CafeReview.createdAt desc;

select reviewId,User.userId,
       content, date_format(CafeReview.createdAt,'%Y.%m.%d')as 'createdTime',
       CafeReview.cafeStar,User.userName

       from CafeReview
inner join User on User.userId = CafeReview.userId
where CafeReview.cafeId = '1' -- 카페 아이디가 1인 카페리뷰만 조회
order by CafeReview.createdAt desc;

-- 탈출 일지 엿보기
select User.userId,User.userName,
       reviewCount as '총 \플레이 \수 ', successRate as '성공률', noHintSuccessRate as '노힌트 성공률'
from UserEscapeRecord
inner join User on UserEscapeRecord.userId='1'
inner join ThemeReview on ThemeReview.reviewId = UserEscapeRecord.reviewId;

-- 나의 탈출 일지
select

       Cafe.cafeName,Theme.themeName,
       ThemeReview.themeStar,
       ThemeReview.escapeSuccess, ThemeReview.remainTime ,
        (case
          when ThemeReview.themeDifficulty = '0' then '매우 쉬움'
          when ThemeReview.themeDifficulty = '1' then '쉬움'
          when ThemeReview.themeDifficulty = '2' then '보통'
          when ThemeReview.themeDifficulty = '3' then '어려움'
          when ThemeReview.themeDifficulty = '4' then '아주 어려움'
          else 'error'
          end
        )as 'themeDifficulty',
       date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createAt'

from ThemeReview
inner join Theme on Theme.themeId = ThemeReview.themeId
inner join Cafe on Cafe.cafeId = Theme.cafeId

where ThemeReview.userId = '1'
order by ThemeReview.createdAt desc
;

select count(reviewId) as reviewCount,
       count(case when(escapeSuccess='Y')then 1 end) as successCount

from ThemeReview
;




-- 메인 페이지
select eventId,eventName as '이벤트 \이름',eventImgUrl as '이벤트 이미지',eventPage as '이벤트 페이지',
       date_format(Event.createdAt,'%Y.%m.%d')as '생성 \시간'
from Event
order by Event.createdAt desc;

select cafeId,cafeName as '카페 이름',cafeStar as '카페 별점',
       (6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude))))
    AS '카페 \까지 \거리',
       cafeImgUrl as '카페 이미지'
FROM Cafe
inner join User on User.userId = '1';

-- 테마 검색 페이지
select themeId,themeDevice,themeActivity,
       recommendedPerTwoOn,recommendedPerThreeOn,recommendedPerFourOn,
           themeImgUrl,themeName,
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as 'themeDifficulty',
themeStar,timeLimit,cafeName,themeGenre,themeDevice

from Theme
inner join Cafe where Cafe.cafeId = Theme.cafeId;

-- 테마 탐색 테마 상세 탐색
select Theme.themeId,themeDevice,themeActivity,
       recommendedPerTwoOn,recommendedPerThreeOn,recommendedPerFourOn,
           themeImgUrl,themeName,
(case
        when themeDifficulty = '0' then '매우 쉬움'
        when themeDifficulty = '1' then '쉬움'
        when themeDifficulty = '2' then '보통'
        when themeDifficulty = '3' then '어려움'
        when themeDifficulty = '4' then '아주 어려움'
        else 'error'
        end
)as 'themeDifficulty',
themeStar,timeLimit,cafeName,themeInfo,ThemeHearted.isHearted

from Theme
inner join ThemeHearted
inner join Cafe where Cafe.cafeId = Theme.cafeId And Theme.themeId='3'
                  And UserId = '1' And ThemeHearted.themeId ='3' -- 유저 1 기준

;

-- User
select userName,
       userImageUrl,userPoint

       from User where userId='9';

show databases ;

select * from User;

INSERT INTO CafeReview(reviewId,content,cafeStar,userId,cafeId)
        VALUES ('4','this is test',4,1,2);


 INSERT INTO CafeReview(content,cafeStar,userId,cafeId)
  VALUES ('this is test test!!',4,1,1);


update CafeReview set content=? , cafeStar=? where reviewId = 1;

delete from CafeReview where reviewId = ?;

-- 테마 리뷰 더보기 부분
select content,
  date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createdTime',

  likeCount,themeStar,
  (case
   when themeDifficulty = '0' then '매우 쉬움'
   when themeDifficulty = '1' then '쉬움'
   when themeDifficulty = '2' then '보통'
   when themeDifficulty = '3' then '어려움'
   when themeDifficulty = '4' then '아주 어려움'
   else 'error'
   end
)as 'themeDifficulty',
useHintCount, userName,
escapeSuccess, remainTime,userReviewCount
from ThemeReview
inner join User on User.userId = ThemeReview.userId
where themeId = 3
order by ThemeReview.createdAt desc; -- 작성 시기로 정렬

update ThemeReview set updatedAt = current_time where reviewId = '4';

select count(*) as reviewCount,
       count(case when escapeSuccess = 'Y' then 1 end) as 'successCount',
       count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) as 'successCountWithNoHint',

concat(round( count(case when escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentage,
       concat(round( count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentageWithNoHint

from ThemeReview where userId = '1';


select count(*) as reviewCount,
       count(case when escapeSuccess = 'Y' then 1 end) as 'successCount',
       count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) as 'successCountWithNoHint'
       from ThemeReview where userId = '1';


 select

       Cafe.cafeName,Theme.themeName,
       ThemeReview.themeStar,
       ThemeReview.escapeSuccess, ThemeReview.remainTime ,
        (case
          when ThemeReview.themeDifficulty = '0' then '매우 쉬움'
          when ThemeReview.themeDifficulty = '1' then '쉬움'
          when ThemeReview.themeDifficulty = '2' then '보통'
          when ThemeReview.themeDifficulty = '3' then '어려움'
          when ThemeReview.themeDifficulty = '4' then '아주 어려움'
          else 'error'
          end
        )as 'themeDifficulty',
       date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createdAt'

from ThemeReview
inner join Theme on Theme.themeId = ThemeReview.themeId
inner join Cafe on Cafe.cafeId = Theme.cafeId

where ThemeReview.userId = '1'
order by ThemeReview.createdAt desc;

 update CafeReview set content='친절! 서비스 굳 !' , cafeStar=5,updatedAt=current_time
  where reviewId = '2';

 delete from CafeReview where reviewId = 4;

 SELECT userId, userEmail , userPassword, userName, status
                FROM User
                WHERE userEmail = 'liyusang1@naver.com';

select cafeName,cafeStar,
       round((6371*acos(cos(radians(userLatitude))*cos(radians(cafeLatitude))*cos(radians(cafeHardness)
    -radians(userHardness))+sin(radians(userLatitude))*sin(radians(cafeLatitude)))),1)
    AS 'cafeDistance',cafeImgUrl
       from Cafe
inner join User
inner join CafeHearted where CafeHearted.userId = '1' AND CafeHearted.cafeId=Cafe.cafeId
And User.userId = CafeHearted.userId;

select userId, cafeId from CafeHearted where userId ='3' and cafeId = '3'

INSERT INTO CafeHearted(userId,cafeId)
        VALUES ();

delete from CafeHearted where userId= '1' and cafeId ='4';

select Theme.themeId,themeImgUrl,themeActivity,themeDevice,themeStar,themeDifficulty,timeLimit,
       themeName,themeGenre,cafeName
       from Theme
inner join User
inner join Cafe
inner join ThemeHearted where ThemeHearted.userId = '1' AND ThemeHearted.themeId=Theme.themeId
                          and Cafe.cafeId = Theme.cafeId

And User.userId = ThemeHearted.userId
order by ThemeHearted.createdAt desc;

select userId from CafeReview where reviewId ='3';

select reviewId,User.userId,
       content, date_format(CafeReview.createdAt,'%Y.%m.%d')as 'createdTime',
       CafeReview.cafeStar,User.userName

       from CafeReview

inner join User
where CafeReview.cafeId = 1 and CafeReview.userId=User.userId
order by CafeReview.createdAt desc;


select

       Cafe.cafeName,Theme.themeName,
       ThemeReview.themeStar,
       ThemeReview.escapeSuccess, ThemeReview.remainTime ,
        (case
          when ThemeReview.themeDifficulty = '0' then '매우 쉬움'
          when ThemeReview.themeDifficulty = '1' then '쉬움'
          when ThemeReview.themeDifficulty = '2' then '보통'
          when ThemeReview.themeDifficulty = '3' then '어려움'
          when ThemeReview.themeDifficulty = '4' then '아주 어려움'
          else 'error'
          end
        )as 'themeDifficulty',
       date_format(ThemeReview.createdAt,'%Y.%m.%d')as 'createdAt'

from ThemeReview
inner join Theme on Theme.themeId = ThemeReview.themeId
inner join Cafe on Cafe.cafeId = Theme.cafeId
inner join User

where User.userName= ? and User.userId=ThemeReview.userId
order by ThemeReview.createdAt desc;

select count(*) as reviewCount,
       count(case when escapeSuccess = 'Y' then 1 end) as 'successCount',
       count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) as 'successCountWithNoHint',

concat(round( count(case when escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentage,
       concat(round( count(case when useHintCount= 0 and escapeSuccess = 'Y' then 1 end) / count(*)*100,2),'%') AS successPercentageWithNoHint

from ThemeReview
inner join User
where User.userName='콜드플레이' and User.userId=ThemeReview.userId;

delete from CafeHearted where userId= 14 and cafeId =2;