import { MigrationInterface, QueryRunner } from 'typeorm';

export class Recetas1791866035057 implements MigrationInterface {
  name = 'Recetas1791866035057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`estados_receta\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, \`es_final\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_8c4f71b91d6eb15cf6e0b0e1d9\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`recetas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(20) NOT NULL, \`fecha_emision\` datetime NOT NULL, \`vigente_hasta\` date NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`paciente_id\` int NULL, \`medico_id\` int NULL, \`estado_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_9e6db94b1a9d3d5d9de3878bd3\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`receta_detalles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad_prescrita\` int NOT NULL, \`cantidad_dispensada\` int NOT NULL DEFAULT '0', \`indicaciones\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`receta_id\` int NULL, \`producto_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` ADD CONSTRAINT \`FK_ef8c3c1f40e399e16ce7dadb747\` FOREIGN KEY (\`paciente_id\`) REFERENCES \`pacientes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` ADD CONSTRAINT \`FK_8b744a966004e95c8f038f2c5cf\` FOREIGN KEY (\`medico_id\`) REFERENCES \`medicos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` ADD CONSTRAINT \`FK_f2915356abafc7e45f9e79ef0ec\` FOREIGN KEY (\`estado_id\`) REFERENCES \`estados_receta\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` ADD CONSTRAINT \`FK_4c92bab981890677f68dd197d31\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` ADD CONSTRAINT \`FK_cf50a7cf8a4c5a7b75bd7552330\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` ADD CONSTRAINT \`FK_12669d87307d4454e85b065f4f1\` FOREIGN KEY (\`receta_id\`) REFERENCES \`recetas\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` ADD CONSTRAINT \`FK_8928c5d9bbd4e925366f7ab80a5\` FOREIGN KEY (\`producto_id\`) REFERENCES \`productos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` ADD CONSTRAINT \`FK_ae65c4029aec84b2fd6244411af\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` ADD CONSTRAINT \`FK_69326bf97e007bd3c68df33ac4b\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` DROP FOREIGN KEY \`FK_69326bf97e007bd3c68df33ac4b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` DROP FOREIGN KEY \`FK_ae65c4029aec84b2fd6244411af\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` DROP FOREIGN KEY \`FK_8928c5d9bbd4e925366f7ab80a5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`receta_detalles\` DROP FOREIGN KEY \`FK_12669d87307d4454e85b065f4f1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` DROP FOREIGN KEY \`FK_cf50a7cf8a4c5a7b75bd7552330\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` DROP FOREIGN KEY \`FK_4c92bab981890677f68dd197d31\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` DROP FOREIGN KEY \`FK_f2915356abafc7e45f9e79ef0ec\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` DROP FOREIGN KEY \`FK_8b744a966004e95c8f038f2c5cf\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`recetas\` DROP FOREIGN KEY \`FK_ef8c3c1f40e399e16ce7dadb747\``,
    );
    await queryRunner.query(`DROP TABLE \`receta_detalles\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_9e6db94b1a9d3d5d9de3878bd3\` ON \`recetas\``,
    );
    await queryRunner.query(`DROP TABLE \`recetas\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_8c4f71b91d6eb15cf6e0b0e1d9\` ON \`estados_receta\``,
    );
    await queryRunner.query(`DROP TABLE \`estados_receta\``);
  }
}
