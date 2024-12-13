import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1734085157729 implements MigrationInterface {
    name = 'CreateTables1734085157729'

    public async up(queryRunner: QueryRunner): Promise<void> {
      
        
        for (let index = 0; index < 100; index++) {
            await queryRunner.query(`
                INSERT INTO \`post\` (\`title\`, \`content\`, \`author\`, \`category\`) 
                VALUES 
                    ('Post Title ${index}', 'Post Content ${index}', 'John Doe', '자유게시판')`)
        }

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`nested_comment\` DROP FOREIGN KEY \`FK_061d41f55d8cedbc920118a0de2\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_94a85bb16d24033a2afdd5df060\``);
        await queryRunner.query(`DROP INDEX \`IDX_23c05c292c439d77b0de816b50\` ON \`category\``);
        await queryRunner.query(`DROP TABLE \`category\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`DROP TABLE \`nested_comment\``);
        await queryRunner.query(`DROP TABLE \`comment\``);
        await queryRunner.query(`DROP TABLE \`post\``);
    }

}
