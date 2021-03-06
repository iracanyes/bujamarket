<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20200527041158 extends AbstractMigration
{
    public function getDescription() : string
    {
        return '';
    }

    public function up(Schema $schema) : void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bjmkt_address CHANGE user_id user_id INT DEFAULT NULL, CHANGE shipper_id shipper_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_admin CHANGE nb_refund_validated nb_refund_validated INT DEFAULT NULL, CHANGE nb_issue_resolved nb_issue_resolved INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_user CHANGE image_id image_id INT DEFAULT NULL, CHANGE roles roles JSON NOT NULL');
        $this->addSql('ALTER TABLE bjmkt_bank_account CHANGE account_balance account_balance DOUBLE PRECISION DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_bill CHANGE date_payment date_payment DATETIME DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_customer_bill CHANGE order_set_id order_set_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_forum CHANGE responder_id responder_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_image CHANGE supplier_product_id supplier_product_id INT DEFAULT NULL, CHANGE title title VARCHAR(255) DEFAULT NULL, CHANGE alt alt VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_message CHANGE attachment_url attachment_url VARCHAR(255) DEFAULT NULL, CHANGE attachment_file attachment_file VARCHAR(255) DEFAULT NULL, CHANGE attachment_image attachment_image VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_order_returned CHANGE bill_refund_id bill_refund_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_order_set CHANGE session_id session_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_payment CHANGE balance_transaction balance_transaction VARCHAR(255) DEFAULT NULL, CHANGE source source VARCHAR(30) DEFAULT NULL, CHANGE session_id session_id VARCHAR(255) DEFAULT NULL');
        $this->addSql('CREATE FULLTEXT INDEX search_index ON bjmkt_product (title, resume, description)');
        $this->addSql('ALTER TABLE bjmkt_supplier CHANGE website website VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_supplier_product CHANGE quantity quantity INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_user_temp CHANGE roles roles JSON NOT NULL');
        $this->addSql('ALTER TABLE bjmkt_withdrawal CHANGE bill_refund_id bill_refund_id INT DEFAULT NULL, CHANGE order_delivered order_delivered TINYINT(1) DEFAULT NULL');
    }

    public function down(Schema $schema) : void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->abortIf($this->connection->getDatabasePlatform()->getName() !== 'mysql', 'Migration can only be executed safely on \'mysql\'.');

        $this->addSql('ALTER TABLE bjmkt_address CHANGE user_id user_id INT DEFAULT NULL, CHANGE shipper_id shipper_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_admin CHANGE nb_refund_validated nb_refund_validated INT DEFAULT NULL, CHANGE nb_issue_resolved nb_issue_resolved INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_bank_account CHANGE account_balance account_balance DOUBLE PRECISION DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE bjmkt_bill CHANGE date_payment date_payment DATETIME DEFAULT \'NULL\'');
        $this->addSql('ALTER TABLE bjmkt_customer_bill CHANGE order_set_id order_set_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_forum CHANGE responder_id responder_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_image CHANGE supplier_product_id supplier_product_id INT DEFAULT NULL, CHANGE title title VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE alt alt VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE bjmkt_message CHANGE attachment_url attachment_url VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE attachment_file attachment_file VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE attachment_image attachment_image VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE bjmkt_order_returned CHANGE bill_refund_id bill_refund_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_order_set CHANGE session_id session_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE bjmkt_payment CHANGE balance_transaction balance_transaction VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE source source VARCHAR(30) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`, CHANGE session_id session_id VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('DROP INDEX search_index ON bjmkt_product');
        $this->addSql('ALTER TABLE bjmkt_supplier CHANGE website website VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT \'NULL\' COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE bjmkt_supplier_product CHANGE quantity quantity INT DEFAULT NULL');
        $this->addSql('ALTER TABLE bjmkt_user CHANGE image_id image_id INT DEFAULT NULL, CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE bjmkt_user_temp CHANGE roles roles LONGTEXT CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_bin`');
        $this->addSql('ALTER TABLE bjmkt_withdrawal CHANGE bill_refund_id bill_refund_id INT DEFAULT NULL, CHANGE order_delivered order_delivered TINYINT(1) DEFAULT \'NULL\'');
    }
}
