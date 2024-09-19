import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from ".";

const main=async()=>{
    console.log("migrations running");
    await migrate(db,{migrationsFolder:"drizzle"});
    console.log("migrations finished");
};

main().finally(()=>{
    process.exit();
})