import { MigrationInterface, QueryRunner } from 'typeorm';

export class Farmacia1791865803058 implements MigrationInterface {
  name = 'Farmacia1791865803058';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tipos_movimiento_inventario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_072d8825941b6fe3a1011224a4\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tipos_producto\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(100) NOT NULL, UNIQUE INDEX \`IDX_38c132c224d3eb4ba6bc1f7a70\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`productos\` (\`id\` int NOT NULL AUTO_INCREMENT, \`codigo\` varchar(30) NOT NULL, \`nombre\` varchar(200) NOT NULL, \`principio_activo\` varchar(200) NULL, \`costo_unitario\` decimal(10,2) NOT NULL DEFAULT '0.00', \`stock_minimo\` int NOT NULL DEFAULT '0', \`activo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`tipo_producto_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, UNIQUE INDEX \`IDX_2da210b34325c2319d784a32d4\` (\`codigo\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`lotes\` (\`id\` int NOT NULL AUTO_INCREMENT, \`numero_lote\` varchar(50) NOT NULL, \`fecha_vencimiento\` date NOT NULL, \`cantidad_actual\` int NOT NULL DEFAULT '0', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`producto_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`movimientos_inventario\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad\` int NOT NULL, \`referencia_tipo\` varchar(50) NULL, \`referencia_id\` int NULL, \`fecha\` datetime NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`lote_id\` int NULL, \`tipo_movimiento_id\` int NULL, \`created_by\` int NULL, \`updated_by\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_f66e547b5ff945b8eb4512aa58c\` FOREIGN KEY (\`tipo_producto_id\`) REFERENCES \`tipos_producto\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_ebf764d22639c0af3c91c91fea5\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`productos\` ADD CONSTRAINT \`FK_dc34729773b4d44c233dd08eac8\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lotes\` ADD CONSTRAINT \`FK_947bc42513ff248a61bd30d8900\` FOREIGN KEY (\`producto_id\`) REFERENCES \`productos\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lotes\` ADD CONSTRAINT \`FK_e3bb10dc4025a413e909b6b8460\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`lotes\` ADD CONSTRAINT \`FK_8f72e1b007a09078fb880c68ccb\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` ADD CONSTRAINT \`FK_3aef8d1e9f86027953ae565a14a\` FOREIGN KEY (\`lote_id\`) REFERENCES \`lotes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` ADD CONSTRAINT \`FK_4cd9c568a3ee9ec147bcc5b0cf0\` FOREIGN KEY (\`tipo_movimiento_id\`) REFERENCES \`tipos_movimiento_inventario\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` ADD CONSTRAINT \`FK_ff4f2b5902e79277b89d4c8d734\` FOREIGN KEY (\`created_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` ADD CONSTRAINT \`FK_bdc313c0931811892ff07e249f5\` FOREIGN KEY (\`updated_by\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` DROP FOREIGN KEY \`FK_bdc313c0931811892ff07e249f5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` DROP FOREIGN KEY \`FK_ff4f2b5902e79277b89d4c8d734\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` DROP FOREIGN KEY \`FK_4cd9c568a3ee9ec147bcc5b0cf0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`movimientos_inventario\` DROP FOREIGN KEY \`FK_3aef8d1e9f86027953ae565a14a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lotes\` DROP FOREIGN KEY \`FK_8f72e1b007a09078fb880c68ccb\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lotes\` DROP FOREIGN KEY \`FK_e3bb10dc4025a413e909b6b8460\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`lotes\` DROP FOREIGN KEY \`FK_947bc42513ff248a61bd30d8900\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_dc34729773b4d44c233dd08eac8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_ebf764d22639c0af3c91c91fea5\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`productos\` DROP FOREIGN KEY \`FK_f66e547b5ff945b8eb4512aa58c\``,
    );
    await queryRunner.query(`DROP TABLE \`movimientos_inventario\``);
    await queryRunner.query(`DROP TABLE \`lotes\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_2da210b34325c2319d784a32d4\` ON \`productos\``,
    );
    await queryRunner.query(`DROP TABLE \`productos\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_38c132c224d3eb4ba6bc1f7a70\` ON \`tipos_producto\``,
    );
    await queryRunner.query(`DROP TABLE \`tipos_producto\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_072d8825941b6fe3a1011224a4\` ON \`tipos_movimiento_inventario\``,
    );
    await queryRunner.query(`DROP TABLE \`tipos_movimiento_inventario\``);
  }
}
