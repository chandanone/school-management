import { PoolClient } from "pg";
import { FilterCondition } from "../models/FilterCondition";

export class GenericRepository<T> {
  private client: PoolClient;
  private tableName: string;

  constructor(client: PoolClient, tableName: string) {
    this.client = client;
    this.tableName = tableName;
  }

  async getAll(selectColumns = "*"): Promise<T[]> {
    const query = `SELECT ${selectColumns} FROM ${this.tableName}`;
    const { rows } = await this.client.query(query);
    return rows;
  }

  async getById(idColumn: string, id: any, selectColumns = "*"): Promise<T | null> {
    const query = `SELECT ${selectColumns} FROM ${this.tableName} WHERE ${idColumn} = $1`;
    const { rows } = await this.client.query(query, [id]);
    return rows[0] || null;
  }

  async insert(entity: Record<string, any>): Promise<T> {
    const keys = Object.keys(entity);
    const values = Object.values(entity);
    const params = keys.map((_, i) => `$${i + 1}`).join(",");
    const query = `
      INSERT INTO ${this.tableName} (${keys.join(",")})
      VALUES (${params})
      RETURNING *;
    `;
    const { rows } = await this.client.query(query, values);
    return rows[0];
  }

  async update(idColumn: string, entity: Record<string, any>): Promise<T> {
    const keys = Object.keys(entity).filter((key) => key !== idColumn);
    const values = keys.map((k) => entity[k]);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(",");
    const query = `
      UPDATE ${this.tableName}
      SET ${setClause}
      WHERE ${idColumn} = $${keys.length + 1}
      RETURNING *;
    `;
    const { rows } = await this.client.query(query, [...values, entity[idColumn]]);
    return rows[0];
  }

  async delete(idColumn: string, id: any): Promise<number | null> {
    const query = `DELETE FROM ${this.tableName} WHERE ${idColumn} = $1`;
    const result = await this.client.query(query, [id]);
    return result.rowCount;
  }

  async getFiltered(
    filters: FilterCondition[] = [],
    orderBy?: string,
    limit?: number,
    selectColumns = "*"
  ): Promise<T[]> {
    const conditions: string[] = [];
    const params: any[] = [];

    filters.forEach((filter, index) => {
      const param = `$${index + 1}`;
      if (filter.operator.toUpperCase() === "IN" && Array.isArray(filter.value)) {
        const inParams = filter.value.map((_: any, i: number) => `$${params.length + i + 1}`).join(",");
        params.push(...filter.value);
        conditions.push(`${filter.column} IN (${inParams})`);
      } else {
        conditions.push(`${filter.column} ${filter.operator} ${param}`);
        params.push(filter.value);
      }
    });

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
    const orderClause = orderBy ? `ORDER BY ${orderBy}` : "";
    const limitClause = limit ? `LIMIT ${limit}` : "";

    const query = `SELECT ${selectColumns} FROM ${this.tableName} ${whereClause} ${orderClause} ${limitClause}`;
    const { rows } = await this.client.query(query, params);
    return rows;
  }
}
