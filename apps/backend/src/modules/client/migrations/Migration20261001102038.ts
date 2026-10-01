import { Migration } from "@medusajs/framework/mikro-orm/migrations";

export class Migration20261001102038 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "client" drop constraint if exists "client_slug_unique";`);
    this.addSql(`create table if not exists "client" ("id" text not null, "slug" text not null, "name" text not null, "contact_email" text null, "status" text check ("status" in ('pending', 'provisioning', 'active', 'suspended', 'rejected', 'failed')) not null default 'pending', "domains" jsonb null, "config" jsonb null, "content" jsonb null, "publishable_key" text null, "publishable_key_id" text null, "sales_channel_id" text null, "storefront_url" text null, "error" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "client_pkey" primary key ("id"));`);
    this.addSql(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_client_slug_unique" ON "client" ("slug") WHERE deleted_at IS NULL;`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_client_deleted_at" ON "client" ("deleted_at") WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "client" cascade;`);
  }

}
