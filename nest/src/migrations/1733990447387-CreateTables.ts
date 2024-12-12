import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1733990447387 implements MigrationInterface {
    name = 'CreateTables1733990447387'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP FOREIGN KEY \`FK_1077d47e0112cad3c16bbcea6cd\``);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`nested_comment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`commentId\` int NOT NULL, \`author\` varchar(255) NOT NULL, \`content\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`categoryId\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`post_id\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`postId\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`author\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_94a85bb16d24033a2afdd5df060\` FOREIGN KEY (\`postId\`) REFERENCES \`post\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`nested_comment\` ADD CONSTRAINT \`FK_061d41f55d8cedbc920118a0de2\` FOREIGN KEY (\`commentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nested_comment\` DROP FOREIGN KEY \`FK_061d41f55d8cedbc920118a0de2\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`updateAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`createAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`author\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`postId\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`post_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`categoryId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`DROP TABLE \`nested_comment\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD CONSTRAINT \`FK_1077d47e0112cad3c16bbcea6cd\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
