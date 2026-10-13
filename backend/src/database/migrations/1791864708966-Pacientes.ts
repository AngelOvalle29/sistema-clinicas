import { MigrationInterface, QueryRunner } from 'typeorm';

export class Pacientes1791864708966 implements MigrationInterface {
  name = 'Pacientes1791864708966';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`estados_paciente\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_1f61590ee6c756c12efe8005c1\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`pacientes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(20) NOT NULL, \`nombres\` varchar(150) NOT NULL, \`apellidos\` varchar(150) NOT NULL, \`dpi\` varchar(20) NULL, \`fecha_nacimiento\` date NULL, \`genero\` varchar(20) NULL, \`telefono\` varchar(30) NULL, \`direccion\` varchar(255) NULL, \`es_prioritario\` tinyint NOT NULL DEFAULT 0, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`estado_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_1eb02d6f7f4fe95b11f350badd\` (\`codigo\`), UNIQUE INDEX \`IDX_a6eddd17534a9bfcfcd2efe101\` (\`dpi\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`categorias_prioridad\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(50) NOT NULL, \`nombre\` varchar(150) NOT NULL, \`nivel\` int NOT NULL, \`activo\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_15a73694196af06c0be92c2620\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`paciente_prioridades\` (\`id\` int NOT NULL AUTO_INCREMENT, \`activo\` tinyint NOT NULL DEFAULT 1, \`fecha_asignacion\` date NOT NULL, \`fecha_retiro\` date NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`categoria_prioridad_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`defunciones\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha\` date NOT NULL, \`causa\` varchar(255) NOT NULL, \`numero_certificado\` varchar(50) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`medico_certifica_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`REL_6ffddceadc63016308166d111e\` (\`paciente_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pacientes\` ADD CONSTRAINT \`FK_fa5692735f549c23bffc1c59cac\` FOREIGN KEY (\`estado_id\`) REFERENCES \`estados_paciente\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pacientes\` ADD CONSTRAINT \`FK_faa39a25ec1a64c54f8b6a7de5e\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`pacientes\` ADD CONSTRAINT \`FK_14c1025616c2bdd4bf8e6e23e5a\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` ADD CONSTRAINT \`FK_11d9aac5f52d2d6a55fd873a197\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` ADD CONSTRAINT \`FK_f2e5c77e7e6de9b5aef946b2f53\` FOREIGN KEY (\`categoria_prioridad_id\`) REFERENCES \`categorias_prioridad\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` ADD CONSTRAINT \`FK_3204fa0ae9e575fb9f0708e2e2f\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` ADD CONSTRAINT \`FK_87adb657f344c3ab117c2e10753\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` ADD CONSTRAINT \`FK_6ffddceadc63016308166d111e7\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` ADD CONSTRAINT \`FK_2c2fe23e9d0b710daf4b1bec636\` FOREIGN KEY (\`medico_certifica_id\`) REFERENCES \`medicos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` ADD CONSTRAINT \`FK_a253dc9fbec2235527d3f6366d0\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` ADD CONSTRAINT \`FK_795139b09eb25e35b986fe13e7e\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` DROP FOREIGN KEY \`FK_795139b09eb25e35b986fe13e7e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` DROP FOREIGN KEY \`FK_a253dc9fbec2235527d3f6366d0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` DROP FOREIGN KEY \`FK_2c2fe23e9d0b710daf4b1bec636\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`defunciones\` DROP FOREIGN KEY \`FK_6ffddceadc63016308166d111e7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` DROP FOREIGN KEY \`FK_87adb657f344c3ab117c2e10753\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` DROP FOREIGN KEY \`FK_3204fa0ae9e575fb9f0708e2e2f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` DROP FOREIGN KEY \`FK_f2e5c77e7e6de9b5aef946b2f53\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`paciente_prioridades\` DROP FOREIGN KEY \`FK_11d9aac5f52d2d6a55fd873a197\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pacientes\` DROP FOREIGN KEY \`FK_14c1025616c2bdd4bf8e6e23e5a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pacientes\` DROP FOREIGN KEY \`FK_faa39a25ec1a64c54f8b6a7de5e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`pacientes\` DROP FOREIGN KEY \`FK_fa5692735f549c23bffc1c59cac\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_6ffddceadc63016308166d111e\` ON \`defunciones\``,
    );
    await queryRunner.query(`DROP TABLE \`defunciones\``);
    await queryRunner.query(`DROP TABLE \`paciente_prioridades\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_15a73694196af06c0be92c2620\` ON \`categorias_prioridad\``,
    );
    await queryRunner.query(`DROP TABLE \`categorias_prioridad\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_a6eddd17534a9bfcfcd2efe101\` ON \`pacientes\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_1eb02d6f7f4fe95b11f350badd\` ON \`pacientes\``,
    );
    await queryRunner.query(`DROP TABLE \`pacientes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_1f61590ee6c756c12efe8005c1\` ON \`estados_paciente\``,
    );
    await queryRunner.query(`DROP TABLE \`estados_paciente\``);
  }
}
