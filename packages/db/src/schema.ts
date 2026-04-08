import { relations } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const membershipRoleEnum = pgEnum("membership_role", ["owner", "admin", "member"]);
export const subscriptionProviderEnum = pgEnum("subscription_provider", ["stripe", "manual"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["trialing", "active", "past_due", "canceled"]);
export const priceSheetStatusEnum = pgEnum("price_sheet_status", ["draft", "published"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    ...timestamps,
  },
  (table) => ({
    emailIdx: uniqueIndex("users_email_idx").on(table.email),
  }),
);

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: varchar("slug", { length: 64 }).notNull(),
    ownerId: uuid("owner_id").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex("workspaces_slug_idx").on(table.slug),
  }),
);

export const memberships = pgTable(
  "memberships",
  {
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: membershipRoleEnum("role").default("member").notNull(),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.workspaceId, table.userId], name: "memberships_pkey" }),
  }),
);

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    provider: subscriptionProviderEnum("provider").default("stripe").notNull(),
    status: subscriptionStatusEnum("status").default("trialing").notNull(),
    plan: varchar("plan", { length: 64 }).notNull(),
    externalCustomerId: text("external_customer_id"),
    externalSubscriptionId: text("external_subscription_id"),
    currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
    currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
    ...timestamps,
  },
  (table) => ({
    workspaceIdx: uniqueIndex("subscriptions_workspace_idx").on(table.workspaceId),
  }),
);

export const priceSheets = pgTable(
  "price_sheets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: varchar("slug", { length: 160 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD").notNull(),
    locale: varchar("locale", { length: 32 }).default("en-US").notNull(),
    status: priceSheetStatusEnum("status").default("draft").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdById: uuid("created_by_id").references(() => users.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (table) => ({
    slugIdx: uniqueIndex("price_sheets_slug_idx").on(table.slug),
    workspaceTitleIdx: index("price_sheets_workspace_title_idx").on(table.workspaceId, table.title),
  }),
);

export const priceSheetItems = pgTable(
  "price_sheet_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    priceSheetId: uuid("price_sheet_id")
      .notNull()
      .references(() => priceSheets.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    section: varchar("section", { length: 120 }),
    priceCents: integer("price_cents").notNull(),
    position: integer("position").default(0).notNull(),
    ...timestamps,
  },
  (table) => ({
    priceSheetIdx: index("price_sheet_items_price_sheet_idx").on(table.priceSheetId),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  memberships: many(memberships),
  ownedWorkspaces: many(workspaces),
  createdPriceSheets: many(priceSheets),
}));

export const workspacesRelations = relations(workspaces, ({ many, one }) => ({
  owner: one(users, {
    fields: [workspaces.ownerId],
    references: [users.id],
  }),
  memberships: many(memberships),
  priceSheets: many(priceSheets),
  subscription: one(subscriptions, {
    fields: [workspaces.id],
    references: [subscriptions.workspaceId],
  }),
}));

export const membershipsRelations = relations(memberships, ({ one }) => ({
  user: one(users, {
    fields: [memberships.userId],
    references: [users.id],
  }),
  workspace: one(workspaces, {
    fields: [memberships.workspaceId],
    references: [workspaces.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [subscriptions.workspaceId],
    references: [workspaces.id],
  }),
}));

export const priceSheetsRelations = relations(priceSheets, ({ many, one }) => ({
  createdBy: one(users, {
    fields: [priceSheets.createdById],
    references: [users.id],
  }),
  items: many(priceSheetItems),
  workspace: one(workspaces, {
    fields: [priceSheets.workspaceId],
    references: [workspaces.id],
  }),
}));

export const priceSheetItemsRelations = relations(priceSheetItems, ({ one }) => ({
  priceSheet: one(priceSheets, {
    fields: [priceSheetItems.priceSheetId],
    references: [priceSheets.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Workspace = typeof workspaces.$inferSelect;
export type Membership = typeof memberships.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type PriceSheet = typeof priceSheets.$inferSelect;
export type PriceSheetItem = typeof priceSheetItems.$inferSelect;

export type NewUser = typeof users.$inferInsert;
export type NewWorkspace = typeof workspaces.$inferInsert;
export type NewMembership = typeof memberships.$inferInsert;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type NewPriceSheet = typeof priceSheets.$inferInsert;
export type NewPriceSheetItem = typeof priceSheetItems.$inferInsert;
