import { MigrationInterface, QueryRunner } from 'typeorm';

export class Historial1791865518263 implements MigrationInterface {
  name = 'Historial1791865518263';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`consultas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha\` datetime NOT NULL, \`motivo\` varchar(255) NULL, \`diagnostico\` varchar(500) NULL, \`notas\` text NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`cita_id\` int NULL, \`paciente_id\` int NULL, \`medico_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`signos_vitales\` (\`id\` int NOT NULL AUTO_INCREMENT, \`presion_sistolica\` int NULL, \`presion_diastolica\` int NULL, \`glucosa\` decimal(6,2) NULL, \`saturacion_o2\` decimal(5,2) NULL, \`temperatura\` decimal(4,1) NULL, \`peso\` decimal(5,2) NULL, \`talla\` decimal(4,2) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`consulta_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`REL_a0e350505dc631a2d21245a7c5\` (\`consulta_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`antecedentes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo\` varchar(50) NOT NULL, \`descripcion\` varchar(500) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`alergias\` (\`id\` int NOT NULL AUTO_INCREMENT, \`descripcion\` varchar(255) NOT NULL, \`severidad\` varchar(30) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` ADD CONSTRAINT \`FK_71c29909bfe2561f943c02a3908\` FOREIGN KEY (\`cita_id\`) REFERENCES \`citas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` ADD CONSTRAINT \`FK_6831bdfd0989bcfe51895fe9d38\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` ADD CONSTRAINT \`FK_c5997b73e47ed12e19f094ff073\` FOREIGN KEY (\`medico_id\`) REFERENCES \`medicos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` ADD CONSTRAINT \`FK_565514e016107c57a1e5f1d9a96\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` ADD CONSTRAINT \`FK_f9d118732c4a512bd80062426a1\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`signos_vitales\` ADD CONSTRAINT \`FK_a0e350505dc631a2d21245a7c5e\` FOREIGN KEY (\`consulta_id\`) REFERENCES \`consultas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`signos_vitales\` ADD CONSTRAINT \`FK_f42a2cebf9e154c7097144a4c4e\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`signos_vitales\` ADD CONSTRAINT \`FK_5062d0a7ccae19c9d0e71c3f9b0\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`antecedentes\` ADD CONSTRAINT \`FK_80adaf45ded635048d585fc1e64\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`antecedentes\` ADD CONSTRAINT \`FK_ea45bff295013b16e7af77a49d0\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`antecedentes\` ADD CONSTRAINT \`FK_6ab4c07182211d0b65aa56fe4dd\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alergias\` ADD CONSTRAINT \`FK_76282503d24b01e6cc04af24e4e\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alergias\` ADD CONSTRAINT \`FK_937a32ee3610e0c33a0ff5e7081\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alergias\` ADD CONSTRAINT \`FK_2096e5eef39586008819aeb6235\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`alergias\` DROP FOREIGN KEY \`FK_2096e5eef39586008819aeb6235\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`alergias\` DROP FOREIGN KEY \`FK_937a32ee3610e0c33a0ff5e7081\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`alergias\` DROP FOREIGN KEY \`FK_76282503d24b01e6cc04af24e4e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`antecedentes\` DROP FOREIGN KEY \`FK_6ab4c07182211d0b65aa56fe4dd\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`antecedentes\` DROP FOREIGN KEY \`FK_ea45bff295013b16e7af77a49d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`antecedentes\` DROP FOREIGN KEY \`FK_80adaf45ded635048d585fc1e64\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`signos_vitales\` DROP FOREIGN KEY \`FK_5062d0a7ccae19c9d0e71c3f9b0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`signos_vitales\` DROP FOREIGN KEY \`FK_f42a2cebf9e154c7097144a4c4e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`signos_vitales\` DROP FOREIGN KEY \`FK_a0e350505dc631a2d21245a7c5e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` DROP FOREIGN KEY \`FK_f9d118732c4a512bd80062426a1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` DROP FOREIGN KEY \`FK_565514e016107c57a1e5f1d9a96\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` DROP FOREIGN KEY \`FK_c5997b73e47ed12e19f094ff073\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` DROP FOREIGN KEY \`FK_6831bdfd0989bcfe51895fe9d38\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`consultas\` DROP FOREIGN KEY \`FK_71c29909bfe2561f943c02a3908\``,
    );
    await queryRunner.query(`DROP TABLE \`alergias\``);
    await queryRunner.query(`DROP TABLE \`antecedentes\``);
    await queryRunner.query(
      `DROP INDEX \`REL_a0e350505dc631a2d21245a7c5\` ON \`signos_vitales\``,
    );
    await queryRunner.query(`DROP TABLE \`signos_vitales\``);
    await queryRunner.query(`DROP TABLE \`consultas\``);
  }
}
