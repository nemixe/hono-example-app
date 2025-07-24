CREATE TABLE `alat` (
	`alat_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alat_kategori_id` integer NOT NULL,
	`alat_nama` text NOT NULL,
	`alat_deskripsi` text,
	`alat_harga_sewa_perhari` integer NOT NULL,
	`alat_stok` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`alat_kategori_id`) REFERENCES `alat_kategori`(`alat_kategori_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `alat_kategori` (
	`alat_kategori_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`alat_kategori_nama` text NOT NULL,
	`alat_kategori_deskripsi` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);