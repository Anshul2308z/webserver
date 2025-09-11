import { pgTable, timestamp, varchar,uuid } from "drizzle-orm/pg-core";

export const users= pgTable("users",{
    id: uuid("id").primaryKey().defaultRandom(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(()=> new Date()),
    email: varchar("email",{length: 256}).unique().notNull(),
});

export type NewUser = typeof users.$inferInsert; 


// Do this a few times. 
//https://www.boot.dev/lessons/2462f016-a3bd-4723-8ffb-c962b1b89e20

//The $onUpdate function sets the updatedAt field to a default value whenever the row is updated.

//$inferInsert is a helper type that infers the type of the object you would pass to the insert function. This is useful for type safety.