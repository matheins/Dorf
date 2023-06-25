import { relations } from "drizzle-orm"
import {
  boolean,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"
import { AdapterAccount } from "next-auth/adapters"

export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 255 }),
})

export const accounts = mysqlTable(
  "accounts",
  {
    userId: varchar("userId", { length: 255 }).notNull(),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: varchar("access_token", { length: 255 }),
    expires_at: int("expires_at"),
    refresh_token_expires_in: int("refresh_token_expires_in"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: varchar("id_token", { length: 255 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
)

export const sessions = mysqlTable("sessions", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: varchar("userId", { length: 255 }).notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
)

export const forms = mysqlTable("forms", {
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  title: varchar("title", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),
  submitText: varchar("submit_text", { length: 256 }).notNull(),
  published: boolean("published").default(false).notNull(),
  archived: boolean("archived").default(false).notNull(),
  userId: varchar("user_id", { length: 255 }),
})

export const formsRelations = relations(forms, ({ many, one }) => ({
  fields: many(fields),
  submissions: many(submissions),
  user: one(users, {
    fields: [forms.userId],
    references: [users.id],
  }),
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

export const webhooks = mysqlTable("webhooks", {
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  formId: text("form_id").notNull(),
  deleted: boolean("deleted").default(false).notNull(),
  endpoint: text("endpoint").notNull(),
  events: json("events"),
  enabled: boolean("enabled").default(true).notNull(),
  secretKey: varchar("secret_key", { length: 256 }).notNull(),
})

export const webhooksRelations = relations(webhooks, ({ one, many }) => ({
  form: one(forms, {
    fields: [webhooks.formId],
    references: [forms.id],
  }),
  webhookEvents: many(webhookEvents),
}))

export const webhookEvents = mysqlTable("webhook_events", {
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  webhookId: text("webhook_id").notNull(),
  submissionId: text("submission_id").notNull(),
  event: varchar("event", { length: 256 }).notNull(),
  statusCode: int("status_code"),
  status: mysqlEnum("status", ["attempting", "failed", "success"]).default(
    "attempting"
  ),
  lastAttempt: timestamp("last_attempt"),
  nextAttempt: timestamp("next_attempt"),
  attemptCount: int("attempt_count").default(0),
})

export const webhookEventRelations = relations(webhookEvents, ({ one }) => ({
  webhook: one(webhooks, {
    fields: [webhookEvents.webhookId],
    references: [webhooks.id],
  }),
  submission: one(submissions, {
    fields: [webhookEvents.submissionId],
    references: [submissions.id],
  }),
}))

export const feedbacks = mysqlTable("feedback", {
  id: varchar("id", { length: 12 }).primaryKey().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").onUpdateNow(),
  text: varchar("text", { length: 512 }).notNull(),
  url: varchar("url", { length: 256 }).notNull(),
  ua: varchar("ua", { length: 256 }).notNull(),
  userId: varchar("userId", { length: 12 }),
})

export const feedbackRelations = relations(feedbacks, ({ one }) => ({
  user: one(users, {
    fields: [feedbacks.userId],
    references: [users.id],
  }),
}))
