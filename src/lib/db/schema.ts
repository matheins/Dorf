import { relations } from "drizzle-orm"
import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

export const forms = mysqlTable("forms", {
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),
  submitText: varchar("submit_text", { length: 256 }).notNull(),
  published: boolean("published").default(false).notNull(),
  archived: boolean("archived").default(false).notNull(),
})

export const formsRelations = relations(forms, ({ many }) => ({
  fields: many(fields),
  submissions: many(submissions),
}))

export const fields = mysqlTable("fields", {
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  type: mysqlEnum("type", [
    "text",
    "checkbox",
    "radio",
    "select",
    "textarea",
    "email",
    "number",
    "url",
    "date",
    "time",
    "tel",
  ]).notNull(),
  label: varchar("label", { length: 256 }).notNull(),
  placeholder: varchar("placeholder", { length: 256 }),
  required: boolean("required").default(false).notNull(),
  description: varchar("description", { length: 512 }),
  order: int("order"),
  options: varchar("options", { length: 512 }),
  formId: text("form_id").notNull(),
})

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  form: one(forms, {
    fields: [fields.formId],
    references: [forms.id],
  }),
}))

export const submissions = mysqlTable("submissions", {
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  formId: text("form_id").notNull(),
  data: json("data"),
})

export const submissionsRelations = relations(submissions, ({ one }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.id],
  }),
}))
