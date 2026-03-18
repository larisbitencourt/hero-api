import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1771421610839 implements MigrationInterface {
  name = 'Init1771421610839';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "heroes" ("id" SERIAL NOT NULL, "civilName" character varying(100) NOT NULL, "heroName" character varying(100) NOT NULL, "age" integer NOT NULL, "team" character varying(100), CONSTRAINT "PK_9db096e6a3c6fe87c82c0af18fc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "heroes"`);
  }
}
