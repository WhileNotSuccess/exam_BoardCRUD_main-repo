import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734257152039 implements MigrationInterface {
    name = 'CreateTables1734257152039'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`createAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`updateAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`updateAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`createAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
