"use strict";
const fs = require("fs");
const pg = require("pg");
const axios = require("axios");

const config = {
    connectionString: "postgres://candidate:62I8anq3cFq5GYh2u4Lh@rc1b-r21uoagjy1t7k77h.mdb.yandexcloud.net:6432/db1",
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(`${process.env.APPDATA}\\.postgresql\\root.crt`).toString(),
    },
};

const client = new pg.Client(config);

client.connect((err) => {
    if (err) throw err;
    console.log("Connected to PostgreSQL");
    dropTable();
});

const dropTable = () => {
    const query = `DROP TABLE IF EXISTS characters;`;
    client.query(query, (err, res) => {
        if (err) throw err;
        console.log("Table dropped if existed");
        createTable();
    });
};

const createTable = () => {
    const query = `
        CREATE TABLE IF NOT EXISTS characters (
            id SERIAL PRIMARY KEY,
            name TEXT,
            data JSONB
        );
    `;
    client.query(query, (err, res) => {
        if (err) throw err;
        console.log("Table created or already exists");
        fetchData();
    });
};

const fetchData = async () => {
    try {
        let url = 'https://rickandmortyapi.com/api/character';
        while (url) {
            const response = await axios.get(url);
            const data = response.data;
            console.log(`Fetched ${data.results.length} characters`);
            await insertData(data.results);
            url = data.info.next;
        }
        console.log("All data inserted");
        client.end();
    } catch (err) {
        console.error("Error fetching data", err);
    }
};

const insertData = async (characters) => {
    const query = `
        INSERT INTO characters (name, data)
        VALUES ($1, $2);
    `;
    for (const character of characters) {
        const values = [
            character.name,
            character
        ];
        try {
            await client.query(query, values);
            console.log(`Inserted character ${character.name}`);
        } catch (err) {
            console.error("Error inserting data", err);
        }
    }
};
