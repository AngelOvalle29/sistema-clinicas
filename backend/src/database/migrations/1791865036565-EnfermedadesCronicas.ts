import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnfermedadesCronicas1791865036565 implements MigrationInterface {
  name = 'EnfermedadesCronicas1791865036565';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`enfermedades_cronicas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo_cie10\` varchar(20) NULL, \`nombre\` varchar(150) NOT NULL, \`frecuencia_control_dias\` int NOT NULL, \`activo\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_82ae4f4a75e024f4af3a565d72\` (\`codigo_cie10\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`paciente_enfermedades_cronicas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`frecuencia_control_dias_override\` int NULL, \`activo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`enfermedad_cronica_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` ADD CONSTRAINT \`FK_034b6f3762e1011788ea1872601\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` ADD CONSTRAINT \`FK_e4ba4ead2857ee9e1b3fba31fac\` FOREIGN KEY (\`enfermedad_cronica_id\`) REFERENCES \`enfermedades_cronicas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` ADD CONSTRAINT \`FK_9a192d8c5ee8aed260b66be0c69\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` ADD CONSTRAINT \`FK_9ea6cf5e768962964bdcdc20ec4\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` DROP FOREIGN KEY \`FK_9ea6cf5e768962964bdcdc20ec4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` DROP FOREIGN KEY \`FK_9a192d8c5ee8aed260b66be0c69\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` DROP FOREIGN KEY \`FK_e4ba4ead2857ee9e1b3fba31fac\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_enfermedades_cronicas\` DROP FOREIGN KEY \`FK_034b6f3762e1011788ea1872601\``,
    );
    await queryRunner.query(`DROP TABLE \`paciente_enfermedades_cronicas\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_82ae4f4a75e024f4af3a565d72\` ON \`enfermedades_cronicas\``,
    );
    await queryRunner.query(`DROP TABLE \`enfermedades_cronicas\``);
  }
}
