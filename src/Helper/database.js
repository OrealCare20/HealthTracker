import { openDatabase } from "react-native-sqlite-storage";

export const getDBConnection = async () => {
    return openDatabase({ name: "UserDatabase.db", location: "default" });
};

export const createTable = async (db) => {
     // Create a table if it doesn't exist
   const query = `CREATE TABLE IF NOT EXISTS user_reports (id INTEGER PRIMARY KEY AUTOINCREMENT, fcm_token VARCHAR NOT NULL, report_type TEXT, sugar_concentration INTEGER DEFAULT NULL, sugar_check TEXT DEFAULT NULL, systolic_pressure INTEGER DEFAULT NULL, diastolic_pressure INTEGER DEFAULT NULL, pulse INTEGER DEFAULT NULL, status TEXT DEFAULT NULL, temperature INTEGER DEFAULT NULL, bmi INTEGER DEFAULT NULL, heart INTEGER DEFAULT NULL);`;
   await db.executeSql(query);
};

export const addData = async (report_type, sugar_concentration, sugar_check, systolic_pressure, diastolic_pressure, pulse, arm, temperature, bmi) => {
    const db = await getDatabase();
    db.transaction(tx => {
        tx.executeSql(
            'INSERT INTO user_reports (report_type, sugar_concentration, sugar_check, systolic_pressure, diastolic_pressure, pulse, arm, temperature, bmi) VALUES (?,?,?,?,?,?,?,?,?)',
            [report_type, sugar_concentration, sugar_check, systolic_pressure, diastolic_pressure, pulse, arm, temperature, bmi],
            (tx, result) => {
                console.log('Data added successfully');
                // fetchUsers();
            },
            error => {
                console.log('Error adding user', error);
            }
        );
    });
    closeDatabase();
};