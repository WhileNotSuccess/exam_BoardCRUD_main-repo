import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734073082279 implements MigrationInterface {
    name = 'CreateTables1734073082279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`profilePicture\` varchar(255) NOT NULL, \`googleId\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nested_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`commentId\` int NOT NULL, \`author\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`postId\` int NOT NULL, \`author\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`post\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`content\` longtext NOT NULL, \`author\` varchar(255) NOT NULL, \`category\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`category\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_23c05c292c439d77b0de816b50\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`nested_comment\` ADD CONSTRAINT \`FK_061d41f55d8cedbc920118a0de2\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`INSERT INTO \`user\` (\`name\`, \`profilePicture\`, \`googleId\`) VALUES ('John Doe', 'profile1.jpg', 'google-id-1'), ('Jane Smith', 'profile2.jpg', 'google-id-2')`);
        await queryRunner.query(`INSERT INTO \`category\` (\`name\`) VALUES ('자유게시판'), ('공지사항'), ('조원소개'), ('현지학기제')`);
        await queryRunner.query(`INSERT INTO \`post\` (\`title\`, \`content\`, \`author\`, \`category\`) VALUES ('Post Title 1', 'Post Content 1', 'John Doe', '자유게시판'), ('Post Title 2', 'Post Content 2', 'Jane Smith', '현지학기제')`);
        await queryRunner.query(`INSERT INTO \`comment\` (\`postId\`, \`author\`, \`content\`) VALUES (1, 'John Doe', 'Comment Content 1'), (2, 'Jane Smith', 'Comment Content 2')`);
        await queryRunner.query(`INSERT INTO \`nested_comment\` (\`commentId\`, \`author\`, \`content\`) VALUES (1, 'John Doe', 'Nested Comment Content 1'), (2, 'Jane Smith', 'Nested Comment Content 2')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`nested_comment\` DROP FOREIGN KEY \`FK_061d41f55d8cedbc920118a0de2\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`post\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`nested_comment\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
