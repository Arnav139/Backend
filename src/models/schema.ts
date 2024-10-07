import { pgTable, serial, varchar, text, integer, jsonb, timestamp, boolean } from 'drizzle-orm/pg-core';
import { sql , relations } from 'drizzle-orm';

// Define User table
export const users = pgTable('userss', {
    id: serial('id').primaryKey(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phoneNumber: varchar('phone_number',{length:10}).notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    refreshToken: text('refresh_token'),
    createdAt: timestamp('created_at').default(sql`NOW()`),
    updatedAt: timestamp('updated_at').default(sql`NOW()`),
});

export const documents:any = pgTable('documents', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    metadata: jsonb('metadata').notNull(), 
    keyword:jsonb('keyword'),
    isDeleted: boolean('is_deleted').default(false),
    isFavorite: boolean('is_favorite').default(false),
    createdAt: timestamp('created_at').default(sql`NOW()`),
    updatedAt: timestamp('updated_at').default(sql`NOW()`),

});

export const usersRelations = relations(users, ({ many }) => ({
  documents: many(documents),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));