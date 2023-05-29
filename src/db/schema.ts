import { relations } from "drizzle-orm"
import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"

export const forms = mysqlTable("forms", {
  id: serial("cuid").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  title: varchar("title", { length: 256 }),
  description: varchar("description", { length: 512 }),
})

export const formsRelations = relations(forms, ({ many }) => ({
  fields: many(fields),
  submissions: many(submissions),
}))

export const fields = mysqlTable("fields", {
  id: serial("cuid").primaryKey(),
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
  ]),
  label: varchar("label", { length: 256 }),
  placeholder: varchar("placeholder", { length: 256 }),
  required: boolean("required"),
  order: int("order"),
  formId: varchar("form_id", { length: 32 }),
})

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  form: one(forms, {
    fields: [fields.formId],
    references: [forms.id],
  }),
  options: many(options),
}))

export const options = mysqlTable("options", {
  id: serial("cuid").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  fieldId: varchar("field_id", { length: 32 }),
  label: varchar("label", { length: 256 }),
  value: varchar("value", { length: 256 }),
  order: int("order"),
})

export const optionsRelations = relations(options, ({ one }) => ({
  field: one(fields, {
    fields: [options.fieldId],
    references: [fields.id],
  }),
}))

export const submissions = mysqlTable("submissions", {
  id: serial("cuid").primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  formId: varchar("form_id", { length: 32 }),
  data: json("data"),
})

export const submissionsRelations = relations(submissions, ({ one }) => ({
  form: one(forms, {
    fields: [submissions.formId],
    references: [forms.id],
  }),
}))
