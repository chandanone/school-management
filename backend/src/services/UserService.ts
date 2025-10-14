import { pool } from "../config/db";
import { GenericRepository } from "../repositories/GenericRepository";

export class UserService {
  async getAllUsers() {
    let client;
    try {
      client = await pool.connect();
      console.log("✅ Connected to PostgreSQL");

      await client.query("BEGIN"); // start transaction
      const repo = new GenericRepository<any>(client, "users");
      const users = await repo.getAll();
      await client.query("COMMIT");

      return users;
    } catch (err: any) {
      if (client) await client.query("ROLLBACK");
      console.error("❌ PostgreSQL operation failed:", err.message);
      throw err;
    } finally {
      if (client) {
        client.release();
        console.log("🔄 Connection released");
      }
    }
  }

  async createUser(data: any) {
    let client;
    try {
      client = await pool.connect();
      console.log("✅ Connected to PostgreSQL");

      await client.query("BEGIN"); // start transaction
      const repo = new GenericRepository<any>(client, "users");
      const newUser = await repo.insert(data);
      await client.query("COMMIT");

      return newUser;
    } catch (err: any) {
      if (client) await client.query("ROLLBACK");
      console.error("❌ PostgreSQL operation failed:", err.message);
      throw err;
    } finally {
      if (client) {
        client.release();
        console.log("🔄 Connection released");
      }
    }
  }
}

// import { pool } from "../config/db";
// import { GenericRepository } from "../repositories/GenericRepository";

// export class UserService {
//   async getAllUsers() {
//     const client = await pool.connect();
//     try {
//       const repo = new GenericRepository<any>(client, "users");
//       return await repo.getAll();
//     } finally {
//       client.release();
//     }
//   }

//   async createUser(data: any) {
//     const client = await pool.connect();
//     try {
//       const repo = new GenericRepository<any>(client, "users");
//       return await repo.insert(data);
//     } finally {
//       client.release();
//     }
//   }
// }
