import { MigrationInterface, QueryRunner } from 'typeorm';

export class Citas1791865229090 implements MigrationInterface {
  name = 'Citas1791865229090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`estados_cita\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, \`es_final\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_11fd6be5c09682b289f0e3e17b\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`citas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fecha_hora_inicio\` datetime NOT NULL, \`fecha_hora_fin\` datetime NOT NULL, \`nivel_prioridad\` int NULL, \`es_control_cronico\` tinyint NOT NULL DEFAULT 0, \`motivo_cancelacion\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`medico_id\` int NULL, \`estado_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` ADD CONSTRAINT \`FK_cb9ae070f79985c5df13ac6bb3a\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` ADD CONSTRAINT \`FK_9bd1afda3f3867918f8fce8be8d\` FOREIGN KEY (\`medico_id\`) REFERENCES \`medicos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` ADD CONSTRAINT \`FK_c7aa593733978347f6e4d7c4c7e\` FOREIGN KEY (\`estado_id\`) REFERENCES \`estados_cita\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` ADD CONSTRAINT \`FK_4ecc5eee429617508ba2fb1c950\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` ADD CONSTRAINT \`FK_f64cf857b574926827ed1cbba17\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`citas\` DROP FOREIGN KEY \`FK_f64cf857b574926827ed1cbba17\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` DROP FOREIGN KEY \`FK_4ecc5eee429617508ba2fb1c950\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` DROP FOREIGN KEY \`FK_c7aa593733978347f6e4d7c4c7e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` DROP FOREIGN KEY \`FK_9bd1afda3f3867918f8fce8be8d\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`citas\` DROP FOREIGN KEY \`FK_cb9ae070f79985c5df13ac6bb3a\``,
    );
    await queryRunner.query(`DROP TABLE \`citas\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_11fd6be5c09682b289f0e3e17b\` ON \`estados_cita\``,
    );
    await queryRunner.query(`DROP TABLE \`estados_cita\``);
  }
}
