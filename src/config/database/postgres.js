import pg from 'pg'
const { Client } = pg

export class Database {
    static #instance = null

    constructor() {
        this.client = new Client({
            user: process.env.USER,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            port: 5432,
            database: process.env.DATABASE,
            connectionString: process.env.DATABASE_URL,
        })

        this.client
            .connect()
            .then(() => {
                console.log('Connected to database')
            })
            .catch((err) => {
                console.error('Error connecting to database', err)
            })
            .finally(() => {
                console.log('instance creation completed')
            })
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database()
        }
        return Database.#instance
    }

    async query({ sql, values = [] }) {
        const cache = new Map()

        const cacheKey = `${sql.text}-${values.join(',')}`

        const cacheEntry = cache.get(cacheKey)

        if (cacheEntry) return cacheEntry

        try {
            const result = await this.client.query(sql, values)
            return result.rows[0]
        } catch (error) {
            console.error('Error executing query', {
                message: error.message,
                stack: error.stack,
                sql: sql.text,
                values: values,
            })
            throw new Error(
                'Database query failed. Please check the logs for more details.'
            )
        }
    }
}
