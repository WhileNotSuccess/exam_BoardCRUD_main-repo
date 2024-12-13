import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734065137238 implements MigrationInterface {
    name = 'CreateTables1734065137238'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`content\` longtext NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`content\` varchar(255) NOT NULL`);
    }

}
