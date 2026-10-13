import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1791863318427 implements MigrationInterface {
  name = 'InitSchema1791863318427';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`roles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, \`activo\` tinyint NOT NULL DEFAULT 1, UNIQUE INDEX \`IDX_5def9cb8b6a53b45e58ab82e37\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`usuarios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombres\` varchar(150) NOT NULL, \`apellidos\` varchar(150) NOT NULL, \`email\` varchar(200) NOT NULL, \`password_hash\` varchar(200) NOT NULL, \`activo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`rol_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_446adfc18b35418aac32ae0b7b\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`auditoria_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`accion\` enum ('INSERT', 'UPDATE', 'DELETE', 'LOGIN') NOT NULL, \`tabla_afectada\` varchar(100) NOT NULL, \`registro_id\` varchar(50) NULL, \`datos_anteriores\` json NULL, \`datos_nuevos\` json NULL, \`ip\` varchar(45) NULL, \`creado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`usuario_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_9e519760a660751f4fa21453d3e\` FOREIGN KEY (\`rol_id\`) REFERENCES \`roles\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_487a730e7e9780f1e651b1ebfab\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuarios\` ADD CONSTRAINT \`FK_05be51999aab008d2908e4f3d93\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`auditoria_logs\` ADD CONSTRAINT \`FK_f109ccd0dc4c2958aad2523d7c9\` FOREIGN KEY (\`usuario_id\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`auditoria_logs\` DROP FOREIGN KEY \`FK_f109ccd0dc4c2958aad2523d7c9\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_05be51999aab008d2908e4f3d93\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_487a730e7e9780f1e651b1ebfab\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`usuarios\` DROP FOREIGN KEY \`FK_9e519760a660751f4fa21453d3e\``,
    );
    await queryRunner.query(`DROP TABLE \`auditoria_logs\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_446adfc18b35418aac32ae0b7b\` ON \`usuarios\``,
    );
    await queryRunner.query(`DROP TABLE \`usuarios\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_5def9cb8b6a53b45e58ab82e37\` ON \`roles\``,
    );
    await queryRunner.query(`DROP TABLE \`roles\``);
  }
}
