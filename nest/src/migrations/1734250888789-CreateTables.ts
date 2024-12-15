import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734250888789 implements MigrationInterface {
    name = 'CreateTables1734250888789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` longtext NOT NULL, \`author\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`author\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nested_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`commentId\` int NOT NULL, \`author\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`profilePicture\` varchar(255) NOT NULL, \`googleId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nested_comment\` ADD CONSTRAINT \`FK_061d41f55d8cedbc920118a0de2\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`
            INSERT INTO final_exam.user (name, profilePicture, googleId) 
            VALUES ('ムンソンユン', 'https://lh3.googleusercontent.com/a/ACg8ocIzUC27IVCdapdhE5L-jYipixipbLvP1u6DeXFnl3QzIqDV2w=s96-c', '107456411040176622724');
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.category (name) VALUES ('자유게시판');
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.category (name) VALUES ('공지사항');
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.category (name) VALUES ('축제게시판');
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.category (name) VALUES ('조원소개');
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.category (name) VALUES ('현지학기제');
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.post (title, content, author, category) 
            VALUES (
              '주중일본어 학습', 
              '<p>평일에는 오사카외어학원에서 수업을 듣습니다.</p><figure class="image"><img style="aspect-ratio:1080/811;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/37d12cf0-babf-11ef-a764-7feccf7223eb" width="1080" height="811"></figure><p>수업은 매일 9시부터 3시까지입니다.</p><figure class="image"><img style="aspect-ratio:4032/3024;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/cf7ce250-bac0-11ef-a764-7feccf7223eb" width="4032" height="3024"></figure><p>자세한 시간표입니다.</p><p>오전에는 JLPT 문법을 공부했습니다.</p><p>오후에는 비즈니스 일본어를 공부했습니다. 롤플레이를 하거나, 경어를 공부했습니다.</p><figure class="image"><img style="aspect-ratio:4320/2252;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/a002c270-babf-11ef-a764-7feccf7223eb" width="4320" height="2252"></figure><p>교실 안 풍경입니다.</p><figure class="image"><img style="aspect-ratio:1373/1030;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/da219ad0-babf-11ef-a764-7feccf7223eb" width="1373" height="1030"></figure><p>사카이스지혼마치역 근처에 위치하고 있습니다.</p>', 
              'ムンソンユン', 
              '현지학기제'
            );
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.post (title, content, author, category) 
            VALUES (
              '조별활동',
              '<p>주말에는 조원과 함께 오사카를 돌아다녔습니다.</p><figure class="image"><img style="aspect-ratio:2252/4000;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/66b72320-bac0-11ef-a764-7feccf7223eb" width="2252" height="4000"></figure><p>같이 맛있는 걸 먹으러 가기도 하고,&nbsp;</p><figure class="image"><img style="aspect-ratio:1050/1400;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/20938d10-bac1-11ef-a764-7feccf7223eb" width="1050" height="1400"></figure><p>오사카 성을 가거나,</p><figure class="image"><img style="aspect-ratio:1400/1050;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/26af6ca0-bac1-11ef-a764-7feccf7223eb" width="1400" height="1050"></figure><p>나라의 사슴공원을 가기도 했습니다.</p><figure class="image"><img style="aspect-ratio:2310/1829;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/40bd58a0-bac1-11ef-a764-7feccf7223eb" width="2310" height="1829"></figure><p>한일교류회에 참가해서 일본인들과 대화하는 시간을 가지기도 했습니다.&nbsp;</p>',
              'ムンソンユン', 
              '현지학기제'
            );
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.post (title, content, author, category) 
            VALUES (
              '문성윤',
              '<figure class="image"><img style="aspect-ratio:568/948;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/a22394b0-bac1-11ef-a764-7feccf7223eb" width="568" height="948"></figure><p>이름: 문성윤</p><p>직책: 조장</p><p>관심있는 분야: 백엔드, 데이터베이스, 일본어</p><p>한마디: 4조 화이팅</p>',
              'ムンソンユン', 
              '조별활동'
            );
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.post (title, content, author, category) 
            VALUES (
              '권기현',
              '<figure class="image"><img style="aspect-ratio:1080/1440;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/00156a80-bac2-11ef-a764-7feccf7223eb" width="1080" height="1440"></figure><p>이름: 권기현</p><p>직책: 프론트엔드 개발자</p><p>관심있는 분야: 프론트엔드, SEO, 시멘틱HTML</p><p>한마디: 더욱 열심히 하겠습니다.</p>',
              'ムンソンユン', 
              '조별활동'
            );
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.post (title, content, author, category) 
            VALUES (
              '최현서',
              '<figure class="image"><img style="aspect-ratio:1020/857;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/59db5470-bac3-11ef-a764-7feccf7223eb" width="1020" height="857"></figure><p>이름: 최현서</p><p>직책: 프론트엔드 개발자</p><p>관심있는 분야: 프론트엔드, NextJS</p><p>한마디: 일본 취업 화이팅</p>',
              'ムンソンユン', 
              '조별활동'
            );
          `);
          
          await queryRunner.query(`
            INSERT INTO final_exam.post (title, content, author, category) 
            VALUES (
              '이한',
              '<figure class="image"><img style="aspect-ratio:354/472;" src="https://community-while-not-success.s3.amazonaws.com/final-exam-image/934c3990-bac3-11ef-a764-7feccf7223eb" width="354" height="472"></figure><p>이름: 이한</p><p>직책: 백엔드 개발자</p><p>관심있는 분야: NestJS, 쿠키, 세션, 데이터베이스</p><p>한마디: 열심히 하겠습니다.</p>',
              'ムンソンユン', 
              '조별활동'
            );
          `);
          
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nested_comment\` DROP FOREIGN KEY \`FK_061d41f55d8cedbc920118a0de2\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`nested_comment\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`post\``);
    }

}
