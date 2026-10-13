import { MigrationInterface, QueryRunner } from 'typeorm';

export class Especialidades1791863788588 implements MigrationInterface {
  name = 'Especialidades1791863788588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`especialidades\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(150) NOT NULL, \`activo\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_e86aa92137833eed8ba2656dbc\` (\`nombre\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`medicos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`numero_colegiado\` varchar(50) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`usuario_id\` int NULL, \`especialidad_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_798e841a009e33762edb7fc0c1\` (\`numero_colegiado\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`medicos\` ADD CONSTRAINT \`FK_ced065017c1ddddcd50c7718b12\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`medicos\` ADD CONSTRAINT \`FK_b348ac93bc12e810de99ecc6594\` FOREIGN KEY (\`especialidad_id\`) REFERENCES \`especialidades\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`medicos\` ADD CONSTRAINT \`FK_66bf91a6ca170fbab2535eca668\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`medicos\` ADD CONSTRAINT \`FK_1478cd2fbbbbe9fefb81e15b296\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`medicos\` DROP FOREIGN KEY \`FK_1478cd2fbbbbe9fefb81e15b296\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`medicos\` DROP FOREIGN KEY \`FK_66bf91a6ca170fbab2535eca668\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`medicos\` DROP FOREIGN KEY \`FK_b348ac93bc12e810de99ecc6594\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`medicos\` DROP FOREIGN KEY \`FK_ced065017c1ddddcd50c7718b12\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_798e841a009e33762edb7fc0c1\` ON \`medicos\``,
    );
    await queryRunner.query(`DROP TABLE \`medicos\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e86aa92137833eed8ba2656dbc\` ON \`especialidades\``,
    );
    await queryRunner.query(`DROP TABLE \`especialidades\``);
  }
}
