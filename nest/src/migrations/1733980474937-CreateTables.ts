import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1733980474937 implements MigrationInterface {
    name = 'CreateTables1733980474937'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`post\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`post\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
