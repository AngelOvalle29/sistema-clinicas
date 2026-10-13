import { MigrationInterface, QueryRunner } from 'typeorm';

export class Alertas1791866318503 implements MigrationInterface {
  name = 'Alertas1791866318503';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`severidades_alerta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, \`nivel\` int NOT NULL, UNIQUE INDEX \`IDX_2d7353e36e12c9238bb3ce71eb\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`estados_alerta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_87a08846105ef38fe6aa4542f0\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tipos_alerta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(40) NOT NULL, \`nombre\` varchar(150) NOT NULL, UNIQUE INDEX \`IDX_1e1d277ba1bf65b5fa3f524836\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`alertas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`mensaje\` varchar(500) NOT NULL, \`fecha_generada\` datetime NOT NULL, \`fecha_atendida\` datetime NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`tipo_alerta_id\` int NULL, \`severidad_id\` int NULL, \`estado_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` ADD CONSTRAINT \`FK_5a929f26c28f99d915503c4a844\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` ADD CONSTRAINT \`FK_f5e9275a4a23adbbc191aef2de3\` FOREIGN KEY (\`tipo_alerta_id\`) REFERENCES \`tipos_alerta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` ADD CONSTRAINT \`FK_fef72378eec9144c5f54a5ffa2e\` FOREIGN KEY (\`severidad_id\`) REFERENCES \`severidades_alerta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` ADD CONSTRAINT \`FK_e15cd8babe7257839b06b6cd87e\` FOREIGN KEY (\`estado_id\`) REFERENCES \`estados_alerta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` ADD CONSTRAINT \`FK_5d111bee329c66f12fca9b0f750\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` ADD CONSTRAINT \`FK_0f2088078e299cd26af109a6327\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`alertas\` DROP FOREIGN KEY \`FK_0f2088078e299cd26af109a6327\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` DROP FOREIGN KEY \`FK_5d111bee329c66f12fca9b0f750\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` DROP FOREIGN KEY \`FK_e15cd8babe7257839b06b6cd87e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` DROP FOREIGN KEY \`FK_fef72378eec9144c5f54a5ffa2e\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` DROP FOREIGN KEY \`FK_f5e9275a4a23adbbc191aef2de3\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`alertas\` DROP FOREIGN KEY \`FK_5a929f26c28f99d915503c4a844\``,
    );
    await queryRunner.query(`DROP TABLE \`alertas\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_1e1d277ba1bf65b5fa3f524836\` ON \`tipos_alerta\``,
    );
    await queryRunner.query(`DROP TABLE \`tipos_alerta\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_87a08846105ef38fe6aa4542f0\` ON \`estados_alerta\``,
    );
    await queryRunner.query(`DROP TABLE \`estados_alerta\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2d7353e36e12c9238bb3ce71eb\` ON \`severidades_alerta\``,
    );
    await queryRunner.query(`DROP TABLE \`severidades_alerta\``);
  }
}
